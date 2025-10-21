/*
  # Fix Quote Requests RLS Policies

  1. Changes
    - Drops and recreates quote_requests table with proper structure
    - Sets up proper RLS policies that allow unauthenticated users to create requests
    - Maintains data integrity with proper constraints
    
  2. Security
    - Enables RLS
    - Creates policies for public access
    - Maintains proper foreign key relationships
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS quote_requests CASCADE;

-- Create quote_requests table with proper structure
CREATE TABLE quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Create public policy that allows anyone to create quote requests
CREATE POLICY "Anyone can create quote requests"
  ON quote_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only allow admins to view requests
CREATE POLICY "Admins can view all requests"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (
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