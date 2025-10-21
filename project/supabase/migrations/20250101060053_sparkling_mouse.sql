/*
  # Authentication System Fixes

  1. Schema Updates
    - Consolidate profile and booking tables
    - Add proper constraints
    - Ensure consistent RLS policies
    
  2. Changes
    - Make profile fields required
    - Add proper foreign key constraints
    - Update RLS policies for better security
*/

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table with proper constraints
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  type text NOT NULL CHECK (type IN ('customer', 'admin')) DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create bookings table with proper constraints
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  square_footage numeric NOT NULL CHECK (square_footage > 0),
  scheduled_date timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create improved RLS policies
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

  -- Bookings policies with improved security
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
    WITH CHECK (
      customer_id = auth.uid() AND
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid())
    );

  CREATE POLICY "Users can update own bookings"
    ON bookings FOR UPDATE
    TO authenticated
    USING (
      (customer_id = auth.uid() AND status IN ('pending', 'cancelled')) OR 
      (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
    );
END $$;

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();