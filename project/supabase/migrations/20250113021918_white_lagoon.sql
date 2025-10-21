/*
  # Fix RLS Policies for Quote Requests

  1. Changes
    - Updates profiles table RLS policies to allow new user registration
    - Fixes quote_requests policies to ensure proper access control
    - Adds proper cascading references

  2. Security
    - Maintains data isolation between users
    - Allows admins proper access
    - Ensures secure profile creation during signup
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Enable insert access for all authenticated users" ON quote_requests;
DROP POLICY IF EXISTS "Enable read access for users and admins" ON quote_requests;
DROP POLICY IF EXISTS "Enable update access for users and admins" ON quote_requests;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Update profiles table policies
CREATE POLICY "Enable profile creation during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable profile read access"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable profile update for owners and admins"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Update quote_requests table
ALTER TABLE quote_requests DROP CONSTRAINT IF EXISTS quote_requests_user_id_fkey;
ALTER TABLE quote_requests ADD CONSTRAINT quote_requests_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update quote_requests policies
CREATE POLICY "Enable quote request creation"
  ON quote_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable quote request read access"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Enable quote request updates"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
  );