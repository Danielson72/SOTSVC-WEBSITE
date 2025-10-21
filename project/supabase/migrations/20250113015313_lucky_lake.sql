/*
  # Add Quote Requests System

  1. New Tables
    - `quote_requests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `service_type` (text)
      - `address` (text)
      - `preferred_date` (date)
      - `preferred_time` (text)
      - `sms_opt_in` (boolean)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on quote_requests table
    - Add policies for users to manage their own requests
    - Add policies for admins to view all requests
*/

-- Create quote_requests table
CREATE TABLE quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  service_type text NOT NULL,
  address text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time text NOT NULL,
  sms_opt_in boolean DEFAULT false,
  status text NOT NULL CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')) DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own quote requests"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can create own quote requests"
  ON quote_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quote requests"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

-- Add updated_at trigger
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();