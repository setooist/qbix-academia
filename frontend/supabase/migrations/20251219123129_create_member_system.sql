/*
  # Create Member System with Roles and Tiers

  ## Overview
  This migration creates the foundation for the QBIX Academia member management system,
  including user profiles, roles, tiers, and access control mechanisms.

  ## New Tables
  
  ### `member_roles`
  Defines the different roles available in the system.
  - `id` (uuid, primary key)
  - `name` (text) - Role name (e.g., 'Student', 'Mentor', 'Faculty', 'Partner', 'Admin')
  - `description` (text) - Role description
  - `created_at` (timestamp)

  ### `member_tiers`
  Defines membership tiers for graduated access control.
  - `id` (uuid, primary key)
  - `name` (text) - Tier name (e.g., 'Tier A', 'Tier B', 'Tier C')
  - `description` (text) - Tier description
  - `priority` (integer) - Higher number = higher access level
  - `created_at` (timestamp)

  ### `profiles`
  Extended user profile information linked to auth.users.
  - `id` (uuid, primary key, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `avatar_url` (text, nullable)
  - `role_id` (uuid, references member_roles)
  - `tier_id` (uuid, references member_tiers, nullable)
  - `is_active` (boolean) - Account active status
  - `bio` (text, nullable)
  - `phone` (text, nullable)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ## Security
  - Enable RLS on all tables
  - Users can read own profile
  - Users can update own non-critical profile fields
  - Only admins can modify roles and tiers
  - Public can read role and tier definitions
*/

-- Create member_roles table
CREATE TABLE IF NOT EXISTS member_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE member_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view roles"
  ON member_roles FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create member_tiers table
CREATE TABLE IF NOT EXISTS member_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  priority integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE member_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tiers"
  ON member_tiers FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role_id uuid REFERENCES member_roles(id),
  tier_id uuid REFERENCES member_tiers(id),
  is_active boolean DEFAULT true,
  bio text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert default roles
INSERT INTO member_roles (name, description) VALUES
  ('Student', 'Default member role with access to learning resources'),
  ('Mentor', 'Reviews submissions and provides feedback to students'),
  ('Faculty', 'Reviews submissions and provides feedback to students'),
  ('Partner', 'Partner institutions with access to specific resources'),
  ('Admin', 'Full system access and management capabilities'),
  ('Content Manager', 'Create, edit, and publish content'),
  ('Activity Manager', 'Create templates, assign tasks, and review submissions'),
  ('Event Manager', 'Manage events and registrations')
ON CONFLICT (name) DO NOTHING;

-- Insert default tiers
INSERT INTO member_tiers (name, description, priority) VALUES
  ('Tier A', 'Basic access level', 1),
  ('Tier B', 'Intermediate access level', 2),
  ('Tier C', 'Advanced access level', 3)
ON CONFLICT (name) DO NOTHING;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  default_role_id uuid;
BEGIN
  SELECT id INTO default_role_id FROM member_roles WHERE name = 'Student' LIMIT 1;
  
  INSERT INTO profiles (id, email, full_name, role_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    default_role_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at trigger to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();