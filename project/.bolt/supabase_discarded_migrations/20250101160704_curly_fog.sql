/*
  # Authentication System Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `email` (text)
      - `phone` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `purchases`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `service_type` (text)
      - `purchase_date` (timestamp)
      - `price` (numeric)
      - `created_at` (timestamp)
    
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `appointment_date` (timestamp)
      - `service_type` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Purchases table
CREATE TABLE purchases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    service_type text NOT NULL,
    purchase_date timestamptz DEFAULT now(),
    price numeric NOT NULL CHECK (price >= 0),
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Purchases policies
CREATE POLICY "Users can view own purchases"
    ON purchases FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own purchases"
    ON purchases FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Appointments table
CREATE TABLE appointments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    appointment_date timestamptz NOT NULL,
    service_type text NOT NULL,
    status text NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS on appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Appointments policies
CREATE POLICY "Users can view own appointments"
    ON appointments FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
    ON appointments FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
    ON appointments FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Add updated_at trigger for appointments
CREATE TRIGGER appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();