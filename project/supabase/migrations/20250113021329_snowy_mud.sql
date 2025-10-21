-- Drop existing quote_requests table and its policies
DROP TABLE IF EXISTS quote_requests CASCADE;

-- Create quote_requests table with proper structure
CREATE TABLE quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
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

-- Create improved RLS policies
CREATE POLICY "Enable insert access for all authenticated users"
  ON quote_requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for users and admins"
  ON quote_requests FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Enable update access for users and admins"
  ON quote_requests FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() OR 
    (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Add updated_at trigger
CREATE TRIGGER update_quote_requests_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();