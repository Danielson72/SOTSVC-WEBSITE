/*
  # Initial Schema Setup for Sonz of Thunder SVC

  1. Tables
    - profiles
      - id (uuid, references auth.users)
      - full_name (text)
      - phone (text)
      - type (text: 'customer' or 'admin')
      - created_at (timestamp)
      - updated_at (timestamp)
    
    - services
      - id (uuid)
      - name (text)
      - description (text)
      - price (numeric)
      - duration (interval)
      - created_at (timestamp)
      - updated_at (timestamp)

    - bookings
      - id (uuid)
      - customer_id (uuid, references profiles)
      - service_id (uuid, references services)
      - scheduled_for (timestamp)
      - status (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text,
  phone text,
  type text CHECK (type IN ('customer', 'admin')) DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  duration interval NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify services"
  ON services
  USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

-- Bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES profiles(id),
  service_id uuid REFERENCES services(id),
  scheduled_for timestamptz NOT NULL,
  status text CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = customer_id OR (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = customer_id OR (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');