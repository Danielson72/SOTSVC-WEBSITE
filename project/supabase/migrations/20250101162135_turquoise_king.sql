/*
  # Create Services Management System

  1. New Tables
    - `services` - Core services offered
      - id: Unique identifier
      - name: Service name
      - description: Service description
      - base_price: Starting price
      - price_unit: Price calculation method (flat or per sq ft)
      - min_square_footage: Minimum area requirement
      - created_at: Creation timestamp
      - updated_at: Last update timestamp

  2. Security
    - Enable RLS
    - Public read access
    - Admin-only write access

  3. Changes
    - Add core services table
    - Add RLS policies
    - Add update trigger
*/

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  base_price numeric NOT NULL CHECK (base_price >= 0),
  price_unit text CHECK (price_unit IN ('flat', 'per_sqft')),
  min_square_footage numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ 
BEGIN
  -- Public read access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Services are viewable by everyone'
  ) THEN
    CREATE POLICY "Services are viewable by everyone"
      ON services FOR SELECT
      TO authenticated
      USING (true);
  END IF;

  -- Admin-only write access
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'services' AND policyname = 'Only admins can modify services'
  ) THEN
    CREATE POLICY "Only admins can modify services"
      ON services
      USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');
  END IF;
END $$;

-- Add updated_at trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_services_updated_at'
  ) THEN
    CREATE TRIGGER update_services_updated_at
        BEFORE UPDATE ON services
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;