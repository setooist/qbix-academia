/*
  # Add RBAC Permissions System

  ## Overview
  This migration adds a comprehensive permission system to the existing role-based structure.

  ## 1. New Tables
  
  ### `permissions` table
  Defines granular permissions for different actions
  - `id` (uuid, primary key) - Unique permission identifier
  - `name` (text, unique) - Permission name (e.g., "content.create", "users.manage")
  - `display_name` (text) - Human-readable permission name
  - `description` (text) - Permission description
  - `resource` (text) - Resource type (e.g., "content", "users", "activities")
  - `action` (text) - Action type (e.g., "create", "read", "update", "delete")
  - `created_at` (timestamptz) - Creation timestamp

  ### `role_permissions` table
  Maps permissions to roles (many-to-many relationship)
  - `role_id` (uuid) - Foreign key to member_roles
  - `permission_id` (uuid) - Foreign key to permissions
  - `created_at` (timestamptz) - Creation timestamp
  - Primary key: (role_id, permission_id)

  ## 2. Table Modifications
  
  ### Update `member_roles` table
  - Add `level` column for hierarchy (higher = more authority)
  
  ### Update `profiles` table
  - Add `is_staff` boolean column for quick staff checks

  ## 3. Security (RLS Policies)
  
  ### permissions table
  - Everyone can view permissions
  - Only admins can modify permissions
  
  ### role_permissions table
  - Everyone can view role permissions
  - Only admins can modify role permissions

  ## 4. Important Notes
  - Permission names follow resource.action naming convention
  - Admins get all permissions
  - Staff roles automatically set is_staff = true
  - Role levels determine hierarchy
*/

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_name text NOT NULL,
  description text,
  resource text NOT NULL,
  action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid REFERENCES member_roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

-- Add level column to member_roles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'member_roles' AND column_name = 'level'
  ) THEN
    ALTER TABLE member_roles ADD COLUMN level integer DEFAULT 0;
  END IF;
END $$;

-- Add is_staff column to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'is_staff'
  ) THEN
    ALTER TABLE profiles ADD COLUMN is_staff boolean DEFAULT false;
  END IF;
END $$;

-- Update role levels
UPDATE member_roles SET level = 100 WHERE name = 'Admin';
UPDATE member_roles SET level = 80 WHERE name = 'Content Manager';
UPDATE member_roles SET level = 80 WHERE name = 'Activity Manager';
UPDATE member_roles SET level = 80 WHERE name = 'Event Manager';
UPDATE member_roles SET level = 50 WHERE name = 'Mentor';
UPDATE member_roles SET level = 50 WHERE name = 'Faculty';
UPDATE member_roles SET level = 30 WHERE name = 'Partner';
UPDATE member_roles SET level = 10 WHERE name = 'Student';

-- Insert permissions
INSERT INTO permissions (name, display_name, description, resource, action) VALUES
  -- Content permissions
  ('content.create', 'Create Content', 'Create new content items', 'content', 'create'),
  ('content.read', 'Read Content', 'View content items', 'content', 'read'),
  ('content.update', 'Update Content', 'Edit existing content', 'content', 'update'),
  ('content.delete', 'Delete Content', 'Delete content items', 'content', 'delete'),
  ('content.publish', 'Publish Content', 'Publish/unpublish content', 'content', 'publish'),
  
  -- User/Profile permissions
  ('users.create', 'Create Users', 'Create new user accounts', 'users', 'create'),
  ('users.read', 'Read Users', 'View user information', 'users', 'read'),
  ('users.update', 'Update Users', 'Edit user information', 'users', 'update'),
  ('users.delete', 'Delete Users', 'Delete user accounts', 'users', 'delete'),
  ('users.manage_roles', 'Manage User Roles', 'Assign/change user roles', 'users', 'manage_roles'),
  
  -- Activity permissions
  ('activities.create', 'Create Activities', 'Create activity templates', 'activities', 'create'),
  ('activities.read', 'Read Activities', 'View activities', 'activities', 'read'),
  ('activities.update', 'Update Activities', 'Edit activities', 'activities', 'update'),
  ('activities.delete', 'Delete Activities', 'Delete activities', 'activities', 'delete'),
  ('activities.assign', 'Assign Activities', 'Assign activities to users', 'activities', 'assign'),
  ('activities.review', 'Review Activities', 'Review and provide feedback', 'activities', 'review'),
  
  -- Event permissions
  ('events.create', 'Create Events', 'Create new events', 'events', 'create'),
  ('events.read', 'Read Events', 'View events', 'events', 'read'),
  ('events.update', 'Update Events', 'Edit events', 'events', 'update'),
  ('events.delete', 'Delete Events', 'Delete events', 'events', 'delete'),
  ('events.manage', 'Manage Events', 'Manage event registrations', 'events', 'manage'),
  
  -- Settings permissions
  ('settings.read', 'Read Settings', 'View system settings', 'settings', 'read'),
  ('settings.update', 'Update Settings', 'Modify system settings', 'settings', 'update'),
  ('roles.manage', 'Manage Roles', 'Create and modify roles', 'roles', 'manage'),
  ('tiers.manage', 'Manage Tiers', 'Create and modify member tiers', 'tiers', 'manage')
ON CONFLICT (name) DO NOTHING;

-- Assign permissions to roles
-- Admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM member_roles r
CROSS JOIN permissions p
WHERE r.name = 'Admin'
ON CONFLICT DO NOTHING;

-- Content Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM member_roles r
CROSS JOIN permissions p
WHERE r.name = 'Content Manager'
  AND p.name IN (
    'content.create', 'content.read', 'content.update', 'content.delete', 'content.publish',
    'users.read'
  )
ON CONFLICT DO NOTHING;

-- Activity Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM member_roles r
CROSS JOIN permissions p
WHERE r.name = 'Activity Manager'
  AND p.name IN (
    'activities.create', 'activities.read', 'activities.update', 'activities.delete',
    'activities.assign', 'activities.review',
    'users.read', 'content.read'
  )
ON CONFLICT DO NOTHING;

-- Event Manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM member_roles r
CROSS JOIN permissions p
WHERE r.name = 'Event Manager'
  AND p.name IN (
    'events.create', 'events.read', 'events.update', 'events.delete', 'events.manage',
    'users.read'
  )
ON CONFLICT DO NOTHING;

-- Mentor and Faculty permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM member_roles r
CROSS JOIN permissions p
WHERE r.name IN ('Mentor', 'Faculty')
  AND p.name IN (
    'activities.read', 'activities.review',
    'content.read', 'users.read'
  )
ON CONFLICT DO NOTHING;

-- Partner permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM member_roles r
CROSS JOIN permissions p
WHERE r.name = 'Partner'
  AND p.name IN (
    'content.read', 'activities.read', 'events.read'
  )
ON CONFLICT DO NOTHING;

-- Student permissions (default)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM member_roles r
CROSS JOIN permissions p
WHERE r.name = 'Student'
  AND p.name IN (
    'content.read', 'activities.read', 'events.read'
  )
ON CONFLICT DO NOTHING;

-- Set is_staff flag for staff roles
UPDATE profiles
SET is_staff = true
WHERE role_id IN (
  SELECT id FROM member_roles WHERE name IN ('Admin', 'Content Manager', 'Activity Manager', 'Event Manager')
);

-- Enable RLS on all RBAC tables
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for permissions table
CREATE POLICY "Anyone can view permissions"
  ON permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert permissions"
  ON permissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN member_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Admin'
    )
  );

CREATE POLICY "Only admins can update permissions"
  ON permissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN member_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Admin'
    )
  );

CREATE POLICY "Only admins can delete permissions"
  ON permissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN member_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Admin'
    )
  );

-- RLS Policies for role_permissions table
CREATE POLICY "Anyone can view role permissions"
  ON role_permissions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can insert role permissions"
  ON role_permissions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN member_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Admin'
    )
  );

CREATE POLICY "Only admins can delete role permissions"
  ON role_permissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN member_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Admin'
    )
  );

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(permission_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles p
    JOIN role_permissions rp ON p.role_id = rp.role_id
    JOIN permissions perm ON rp.permission_id = perm.id
    WHERE p.id = auth.uid() AND perm.name = permission_name
  );
END;
$$;

-- Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT r.name INTO user_role
  FROM profiles p
  JOIN member_roles r ON p.role_id = r.id
  WHERE p.id = auth.uid();
  
  RETURN user_role;
END;
$$;

-- Create function to check if user is staff
CREATE OR REPLACE FUNCTION is_user_staff()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM profiles
    WHERE id = auth.uid() AND is_staff = true
  );
END;
$$;

-- Create indexes for faster permission lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role_id ON profiles(role_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_staff ON profiles(is_staff);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);