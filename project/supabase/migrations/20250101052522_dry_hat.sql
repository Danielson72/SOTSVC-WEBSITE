/*
  # Fix Schema Migration

  1. Changes
    - Drop dependent policies first
    - Drop existing tables
    - Create new profiles and bookings tables
    - Set up RLS and policies
    
  2. Security
    - Enable RLS on all tables
    - Add customer and admin policies
*/

-- First drop dependent policies
DO $$ 
BEGIN
  -- Drop policies that depend on profiles table
  DROP POLICY IF EXISTS "Only admins can modify services" ON services;
  DROP POLICY IF EXISTS "Only admins can view auth logs" ON auth_logs;
  DROP POLICY IF EXISTS "Only admins can view request logs" ON request_logs;
  DROP POLICY IF EXISTS "Only admins can view security events" ON security_events;
END $$;

-- Now drop tables
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS user_profiles;
DROP TABLE IF EXISTS profiles;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  phone text,
  type text CHECK (type IN ('customer', 'admin')) DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
DO $$ 
BEGIN
  -- Basic user policies
  CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

  CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

  -- Admin policies
  CREATE POLICY "Admins can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');
END $$;

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  square_footage numeric NOT NULL,
  scheduled_date timestamptz NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create bookings policies
DO $$ 
BEGIN
  -- Customer policies
  CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (
      customer_id = auth.uid() OR
      (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
    );

  CREATE POLICY "Users can create own bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (customer_id = auth.uid());

  CREATE POLICY "Users can update own bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (
      customer_id = auth.uid() OR
      (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
    );
END $$;