/*
  # Database Schema Update
  
  1. Tables
    - profiles (user profiles with admin support)
    - bookings (service bookings)
    - services (available services)
    - auth_logs (authentication tracking)
    - request_logs (API request tracking)
    - security_events (security monitoring)

  2. Changes
    - Safely drop existing policies
    - Add admin support to profiles
    - Update security policies
    - Add proper RLS policies
*/

-- First, safely drop any existing policies
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Only admins can modify services" ON services;
  DROP POLICY IF EXISTS "Only admins can view auth logs" ON auth_logs;
  DROP POLICY IF EXISTS "Only admins can view request logs" ON request_logs;
  DROP POLICY IF EXISTS "Only admins can view security events" ON security_events;
END $$;

-- Create or update profiles table
DO $$ 
BEGIN
  -- Create profiles table if it doesn't exist
  CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name text,
    phone text,
    type text CHECK (type IN ('customer', 'admin')) DEFAULT 'customer',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Add type column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'type'
  ) THEN
    ALTER TABLE profiles ADD COLUMN type text CHECK (type IN ('customer', 'admin')) DEFAULT 'customer';
  END IF;
END $$;

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create or update bookings table
DO $$ 
BEGIN
  CREATE TABLE IF NOT EXISTS bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    service_type text NOT NULL,
    square_footage numeric NOT NULL,
    scheduled_date timestamptz NOT NULL,
    status text CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
END $$;

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create or update policies
DO $$ 
BEGIN
  -- Drop existing policies first to avoid conflicts
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  
  DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
  DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
  DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

  -- Create new policies
  -- Profiles policies
  CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id OR (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

  CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id OR (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

  CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

  -- Bookings policies
  CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    TO authenticated
    USING (customer_id = auth.uid() OR (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

  CREATE POLICY "Users can create own bookings"
    ON bookings FOR INSERT
    TO authenticated
    WITH CHECK (customer_id = auth.uid());

  CREATE POLICY "Users can update own bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (customer_id = auth.uid() OR (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');
END $$;