/*
  # Fix Database Policies and Admin Features

  1. Changes
    - Drop existing policies safely
    - Add admin type to profiles
    - Recreate policies with proper checks
    
  2. Security
    - Maintain RLS
    - Add admin access controls
*/

-- First, safely drop dependent policies
DO $$ 
BEGIN
  -- Drop policies that depend on profiles table
  DROP POLICY IF EXISTS "Only admins can modify services" ON services;
  DROP POLICY IF EXISTS "Only admins can view auth logs" ON auth_logs;
  DROP POLICY IF EXISTS "Only admins can view request logs" ON request_logs;
  DROP POLICY IF EXISTS "Only admins can view security events" ON security_events;
END $$;

-- Add missing admin features
DO $$ 
BEGIN
  -- Add type column to profiles if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN type text CHECK (type IN ('customer', 'admin')) DEFAULT 'customer';
  END IF;
END $$;

-- Update policies with admin access
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Only admins can modify services" ON services;
  DROP POLICY IF EXISTS "Only admins can view auth logs" ON auth_logs;
  DROP POLICY IF EXISTS "Only admins can view request logs" ON request_logs;
  DROP POLICY IF EXISTS "Only admins can view security events" ON security_events;

  -- Create new policies
  CREATE POLICY "Only admins can modify services"
    ON services
    USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

  CREATE POLICY "Only admins can view auth logs"
    ON auth_logs
    FOR SELECT
    TO authenticated
    USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

  CREATE POLICY "Only admins can view request logs"
    ON request_logs
    FOR SELECT
    TO authenticated
    USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

  CREATE POLICY "Only admins can view security events"
    ON security_events
    FOR SELECT
    TO authenticated
    USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');
END $$;