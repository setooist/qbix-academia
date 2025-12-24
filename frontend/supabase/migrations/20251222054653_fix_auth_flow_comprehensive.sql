/*
  # Comprehensive Auth Flow Fix

  ## Changes
  1. Drop the conflicting INSERT policy on profiles
  2. Recreate the handle_new_user trigger function with proper RLS bypass
  3. Add error handling and logging
  4. Ensure all auth flows work correctly
  
  ## Security
  - The trigger function runs with SECURITY DEFINER to bypass RLS
  - Users can still only read/update their own profiles via existing policies
  - This allows automatic profile creation during signup
*/

-- Drop the problematic INSERT policy that conflicts with SECURITY DEFINER
DROP POLICY IF EXISTS "Allow profile creation during signup" ON profiles;

-- Recreate the handle_new_user function with explicit RLS bypass and error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  default_role_id uuid;
BEGIN
  -- Get the default Student role
  SELECT id INTO default_role_id 
  FROM member_roles 
  WHERE name = 'Student' 
  LIMIT 1;
  
  -- If no default role found, raise an error
  IF default_role_id IS NULL THEN
    RAISE EXCEPTION 'Default Student role not found';
  END IF;
  
  -- Insert the profile with RLS bypassed due to SECURITY DEFINER
  INSERT INTO public.profiles (id, email, full_name, role_id, is_active)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    default_role_id,
    true
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and re-raise
    RAISE EXCEPTION 'Error creating profile for user %: %', NEW.id, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Add admin read access to profiles (for admin panel)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN member_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Admin'
    )
  );

-- Add admin update access to profiles (for user management)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN member_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN member_roles r ON p.role_id = r.id
      WHERE p.id = auth.uid() AND r.name = 'Admin'
    )
  );
