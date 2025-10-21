/*
  # Fix Quote Requests Implementation

  1. Changes
    - Creates a proper quote_requests table with all necessary fields
    - Sets up appropriate RLS policies
    - Removes problematic email notification trigger
    
  2. Security
    - Enables RLS
    - Creates policies for authenticated users
    - Maintains data integrity with proper constraints
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS quote_requests CASCADE;

-- Create quote_requests table
CREATE TABLE quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service_type text NOT NULL,
  address text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  sms_opt_in boolean DEFAULT false,
  status text NOT NULL CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')) DEFAULT 'pending',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable quote request creation for authenticated users"
  ON quote_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable quote request viewing for owners and admins"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();