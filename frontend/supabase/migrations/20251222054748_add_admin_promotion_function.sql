/*
  # Add Admin Promotion Function

  ## Overview
  This migration adds a secure function to promote a user to admin status.
  This solves the chicken-and-egg problem of creating the first admin.
  
  ## Changes
  1. Create a function that can be called by service role to promote users to admin
  2. Add a special policy to allow self-promotion only when no admins exist
  
  ## Security
  - The function requires either:
    - Being called by an existing admin
    - No admins exist in the system (for first admin)
  - Uses SECURITY DEFINER to bypass RLS
*/

-- Create function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_id uuid)
RETURNS void
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_role_id uuid;
  admin_count integer;
BEGIN
  -- Check if any admins exist
  SELECT COUNT(*) INTO admin_count
  FROM profiles p
  JOIN member_roles r ON p.role_id = r.id
  WHERE r.name = 'Admin';
  
  -- Get admin role ID
  SELECT id INTO admin_role_id
  FROM member_roles
  WHERE name = 'Admin'
  LIMIT 1;
  
  IF admin_role_id IS NULL THEN
    RAISE EXCEPTION 'Admin role not found';
  END IF;
  
  -- Allow promotion if:
  -- 1. No admins exist (first admin), OR
  -- 2. Current user is already an admin
  IF admin_count = 0 OR EXISTS (
    SELECT 1 FROM profiles p
    JOIN member_roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name = 'Admin'
  ) THEN
    UPDATE profiles
    SET role_id = admin_role_id,
        is_staff = true
    WHERE id = user_id;
  ELSE
    RAISE EXCEPTION 'Only existing admins can promote users to admin';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION promote_to_admin(uuid) TO authenticated;
