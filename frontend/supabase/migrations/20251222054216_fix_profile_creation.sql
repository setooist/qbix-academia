/*
  # Fix Profile Creation on Signup

  ## Changes
  - Add INSERT policy to allow profile creation during signup
  - The trigger function runs with SECURITY DEFINER but we need an explicit policy
  
  ## Security
  - Allow INSERT for authenticated users (for their own profile during signup)
  - This works with the handle_new_user() trigger function
*/

-- Add INSERT policy for profiles to allow creation during signup
CREATE POLICY "Allow profile creation during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
