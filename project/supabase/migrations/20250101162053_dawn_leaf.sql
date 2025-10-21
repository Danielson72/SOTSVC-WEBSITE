/*
  # Add Service Management and Reviews

  1. New Tables
    - `service_areas` - Coverage areas for services
    - `payments` - Payment records
    - `reviews` - Customer reviews and ratings

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add admin-specific policies

  3. Changes
    - Add service-specific fields
    - Add payment processing
    - Add review system
*/

-- Service Areas table
CREATE TABLE IF NOT EXISTS service_areas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  county text NOT NULL,
  city text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(county, city)
);

ALTER TABLE service_areas ENABLE ROW LEVEL SECURITY;

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount > 0),
  status text CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method text NOT NULL,
  transaction_id text UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Service Areas policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'service_areas' AND policyname = 'Service areas are viewable by everyone'
  ) THEN
    CREATE POLICY "Service areas are viewable by everyone"
      ON service_areas FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Payments policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'payments' AND policyname = 'Users can view own payments'
  ) THEN
    CREATE POLICY "Users can view own payments"
      ON payments FOR SELECT
      TO authenticated
      USING (
        EXISTS (
          SELECT 1 FROM bookings
          WHERE bookings.id = payments.booking_id
          AND bookings.customer_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Reviews policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can view public reviews'
  ) THEN
    CREATE POLICY "Users can view public reviews"
      ON reviews FOR SELECT
      TO authenticated
      USING (is_public = true OR customer_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'reviews' AND policyname = 'Users can create own reviews'
  ) THEN
    CREATE POLICY "Users can create own reviews"
      ON reviews FOR INSERT
      TO authenticated
      WITH CHECK (
        customer_id = auth.uid() AND
        EXISTS (
          SELECT 1 FROM bookings
          WHERE bookings.id = reviews.booking_id
          AND bookings.customer_id = auth.uid()
          AND bookings.status = 'completed'
        )
      );
  END IF;
END $$;

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_service_areas_updated_at'
  ) THEN
    CREATE TRIGGER update_service_areas_updated_at
        BEFORE UPDATE ON service_areas
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_payments_updated_at'
  ) THEN
    CREATE TRIGGER update_payments_updated_at
        BEFORE UPDATE ON payments
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_reviews_updated_at'
  ) THEN
    CREATE TRIGGER update_reviews_updated_at
        BEFORE UPDATE ON reviews
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;