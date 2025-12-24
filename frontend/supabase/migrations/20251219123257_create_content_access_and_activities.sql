/*
  # Create Content Access Control and Activities System

  ## Overview
  This migration creates tables for managing content access control based on roles,
  tiers, and individual allowlists, plus the Activities module for student assignments.

  ## New Tables

  ### `content_access_rules`
  Defines who can access which content items.
  - `id` (uuid, primary key)
  - `content_type` (text) - 'blog', 'case_study', 'downloadable', 'recommendation', 'event'
  - `content_id` (uuid) - ID of the content item
  - `access_level` (text) - 'public', 'registered', 'tier', 'role', 'allowlist'
  - `tier_ids` (uuid[]) - Array of tier IDs (for tier-based access)
  - `role_ids` (uuid[]) - Array of role IDs (for role-based access)
  - `created_at` (timestamp)

  ### `content_allowlist`
  Individual user allowlist for specific content.
  - `id` (uuid, primary key)
  - `content_type` (text)
  - `content_id` (uuid)
  - `user_id` (uuid)
  - `granted_by` (uuid) - Admin who granted access
  - `created_at` (timestamp)

  ### `activities`
  Activity templates and assignments for students.
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `instructions` (text) - Detailed instructions
  - `due_date` (timestamp, nullable)
  - `points` (integer) - Points for completion
  - `attachment_url` (text, nullable)
  - `created_by` (uuid) - Activity Manager who created it
  - `is_published` (boolean)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ### `activity_assignments`
  Assignment of activities to specific students.
  - `id` (uuid, primary key)
  - `activity_id` (uuid)
  - `student_id` (uuid)
  - `assigned_by` (uuid) - Who assigned it
  - `due_date` (timestamp, nullable) - Can override activity due date
  - `status` (text) - 'assigned', 'in_progress', 'submitted', 'reviewed', 'completed'
  - `assigned_at` (timestamp)
  - `started_at` (timestamp, nullable)
  - `submitted_at` (timestamp, nullable)
  - `reviewed_at` (timestamp, nullable)

  ### `activity_submissions`
  Student submissions for activities.
  - `id` (uuid, primary key)
  - `assignment_id` (uuid)
  - `student_id` (uuid)
  - `content` (text) - Submission content
  - `attachment_urls` (text[]) - Array of attachment URLs
  - `submitted_at` (timestamp)
  - `score` (integer, nullable)
  - `feedback` (text, nullable)
  - `reviewed_by` (uuid, nullable)
  - `reviewed_at` (timestamp, nullable)

  ### `team_members`
  Team members (Desk/Connect sections).
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable) - Links to profiles if they have an account
  - `full_name` (text)
  - `title` (text)
  - `department` (text) - 'desk' or 'connect'
  - `bio` (text)
  - `avatar_url` (text)
  - `email` (text)
  - `phone` (text, nullable)
  - `linkedin_url` (text, nullable)
  - `display_order` (integer)
  - `is_active` (boolean)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

  ## Security
  - Enable RLS on all tables
  - Complex access control for content based on rules
  - Students can view their own activities and submit
  - Mentors/Faculty can review submissions
  - Activity Managers can create and assign activities
*/

-- Create content_access_rules table
CREATE TABLE IF NOT EXISTS content_access_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  access_level text NOT NULL DEFAULT 'registered',
  tier_ids uuid[] DEFAULT '{}',
  role_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_type, content_id)
);

ALTER TABLE content_access_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view access rules"
  ON content_access_rules FOR SELECT
  TO authenticated, anon
  USING (true);

-- Create content_allowlist table
CREATE TABLE IF NOT EXISTS content_allowlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL,
  content_id uuid NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  granted_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_type, content_id, user_id)
);

ALTER TABLE content_allowlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own allowlist entries"
  ON content_allowlist FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  instructions text DEFAULT '',
  due_date timestamptz,
  points integer DEFAULT 0,
  attachment_url text,
  created_by uuid REFERENCES profiles(id),
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published activities"
  ON activities FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Create activity_assignments table
CREATE TABLE IF NOT EXISTS activity_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  assigned_by uuid REFERENCES profiles(id),
  due_date timestamptz,
  status text DEFAULT 'assigned',
  assigned_at timestamptz DEFAULT now(),
  started_at timestamptz,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  UNIQUE(activity_id, student_id)
);

ALTER TABLE activity_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own assignments"
  ON activity_assignments FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can update own assignment status"
  ON activity_assignments FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Create activity_submissions table
CREATE TABLE IF NOT EXISTS activity_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid REFERENCES activity_assignments(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text DEFAULT '',
  attachment_urls text[] DEFAULT '{}',
  submitted_at timestamptz DEFAULT now(),
  score integer,
  feedback text,
  reviewed_by uuid REFERENCES profiles(id),
  reviewed_at timestamptz
);

ALTER TABLE activity_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions"
  ON activity_submissions FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create own submissions"
  ON activity_submissions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  full_name text NOT NULL,
  title text NOT NULL,
  department text NOT NULL,
  bio text DEFAULT '',
  avatar_url text,
  email text,
  phone text,
  linkedin_url text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active team members"
  ON team_members FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_activities_updated_at ON activities;
CREATE TRIGGER update_activities_updated_at
  BEFORE UPDATE ON activities
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to check content access
CREATE OR REPLACE FUNCTION can_access_content(
  p_content_type text,
  p_content_id uuid,
  p_user_id uuid
)
RETURNS boolean AS $$
DECLARE
  v_access_level text;
  v_tier_ids uuid[];
  v_role_ids uuid[];
  v_user_tier_id uuid;
  v_user_role_id uuid;
  v_has_access boolean;
BEGIN
  -- Get access rule
  SELECT access_level, tier_ids, role_ids
  INTO v_access_level, v_tier_ids, v_role_ids
  FROM content_access_rules
  WHERE content_type = p_content_type AND content_id = p_content_id;

  -- If no rule exists, default to registered access
  IF v_access_level IS NULL THEN
    v_access_level := 'registered';
  END IF;

  -- Public access
  IF v_access_level = 'public' THEN
    RETURN true;
  END IF;

  -- Must be logged in for other access levels
  IF p_user_id IS NULL THEN
    RETURN false;
  END IF;

  -- Registered access
  IF v_access_level = 'registered' THEN
    RETURN true;
  END IF;

  -- Get user tier and role
  SELECT tier_id, role_id INTO v_user_tier_id, v_user_role_id
  FROM profiles
  WHERE id = p_user_id;

  -- Tier-based access
  IF v_access_level = 'tier' AND v_user_tier_id = ANY(v_tier_ids) THEN
    RETURN true;
  END IF;

  -- Role-based access
  IF v_access_level = 'role' AND v_user_role_id = ANY(v_role_ids) THEN
    RETURN true;
  END IF;

  -- Allowlist access
  IF v_access_level = 'allowlist' THEN
    SELECT EXISTS(
      SELECT 1 FROM content_allowlist
      WHERE content_type = p_content_type
        AND content_id = p_content_id
        AND user_id = p_user_id
    ) INTO v_has_access;
    RETURN v_has_access;
  END IF;

  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;