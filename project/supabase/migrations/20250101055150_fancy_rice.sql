/*
  # Fix Database Schema and Authentication

  1. Changes
    - Drop and recreate tables with proper structure
    - Add proper RLS policies
    - Add admin functionality
    
  2. Security
    - Enable RLS on all tables
    - Add proper user and admin policies
    - Add proper foreign key constraints
*/

-- First, safely drop everything
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  type text CHECK (type IN ('customer', 'admin')) DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

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

-- Create policies
DO $$ 
BEGIN
  -- Profiles policies
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

  CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

  -- Bookings policies
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