/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `pricing_type` (text: 'flat' or 'per_sqft')
      - `min_square_footage` (numeric)
      - `max_square_footage` (numeric)
      - `available_frequencies` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on services table
    - Add policy for public read access
    - Add policy for admin-only write access

  3. Initial Data
    - Insert basic service types
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS services CASCADE;

-- Services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  pricing_type text CHECK (pricing_type IN ('flat', 'per_sqft')),
  min_square_footage numeric,
  max_square_footage numeric,
  available_frequencies text[] DEFAULT ARRAY['one-time'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Services are viewable by everyone"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify services"
  ON services
  USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

-- Add updated_at trigger
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert initial services
INSERT INTO services (name, description, price, pricing_type, min_square_footage, max_square_footage, available_frequencies)
VALUES 
  (
    'Deep Cleaning',
    'A thorough cleaning of every nook and cranny, including baseboards, light fixtures, and hard-to-reach areas.',
    150,
    'flat',
    500,
    3000,
    ARRAY['one-time']
  ),
  (
    'Residential Cleaning',
    'Regular or one-time cleaning of homes, including kitchens, bathrooms, living spaces, and bedrooms.',
    100,
    'flat',
    500,
    NULL,
    ARRAY['one-time', 'weekly', 'bi-weekly', 'monthly']
  ),
  (
    'Commercial Cleaning',
    'Professional cleaning services for offices, retail spaces, and other commercial properties.',
    0.15,
    'per_sqft',
    1000,
    NULL,
    ARRAY['one-time', 'weekly', 'bi-weekly', 'monthly']
  ),
  (
    'Move-In/Move-Out Cleaning',
    'Detailed cleaning of empty properties, preparing them for new tenants or homeowners.',
    200,
    'flat',
    500,
    3000,
    ARRAY['one-time']
  );