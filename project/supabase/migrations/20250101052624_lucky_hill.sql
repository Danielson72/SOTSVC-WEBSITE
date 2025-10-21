/*
  # Add Admin Policies

  1. Changes
    - Add admin type to profiles
    - Add admin-specific policies
    - Update existing policies with admin access
    
  2. Security
    - Maintain existing RLS
    - Add admin-specific permissions
*/

-- Add type column to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN type text CHECK (type IN ('customer', 'admin')) DEFAULT 'customer';
  END IF;
END $$;

-- Update policies to include admin access
DO $$ 
BEGIN
  -- Drop existing policies first
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  
  -- Recreate with admin access
  CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (
      auth.uid() = id OR 
      (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
    );

  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (
      auth.uid() = id OR 
      (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
    );

  -- Add admin-specific policies
  CREATE POLICY "Admins can manage all profiles"
    ON profiles
    TO authenticated
    USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin')
    WITH CHECK ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');
END $$;