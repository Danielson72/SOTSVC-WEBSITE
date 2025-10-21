/*
  # User Authentication and Booking System Schema

  1. New Tables
    - profiles
      - id (uuid, primary key, references auth.users)
      - full_name (text)
      - phone (text)
      - type (text, customer/admin)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - bookings
      - id (uuid, primary key)
      - customer_id (uuid, references profiles)
      - service_type (text)
      - square_footage (numeric)
      - scheduled_date (timestamptz)
      - status (text: pending/confirmed/completed/cancelled)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Add admin-specific policies
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
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
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile"
      ON profiles FOR SELECT
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile"
      ON profiles FOR UPDATE
      TO authenticated
      USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile"
      ON profiles FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;

  -- Admin policies
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles'
  ) THEN
    CREATE POLICY "Admins can view all profiles"
      ON profiles FOR SELECT
      TO authenticated
      USING (
        (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
      );
  END IF;
END $$;

-- Create bookings table
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

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create bookings policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Users can view own bookings'
  ) THEN
    CREATE POLICY "Users can view own bookings"
      ON bookings FOR SELECT
      TO authenticated
      USING (
        customer_id = auth.uid() OR
        (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Users can create own bookings'
  ) THEN
    CREATE POLICY "Users can create own bookings"
      ON bookings FOR INSERT
      TO authenticated
      WITH CHECK (customer_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'bookings' AND policyname = 'Users can update own bookings'
  ) THEN
    CREATE POLICY "Users can update own bookings"
      ON bookings FOR UPDATE
      TO authenticated
      USING (
        customer_id = auth.uid() OR
        (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
      );
  END IF;
END $$;