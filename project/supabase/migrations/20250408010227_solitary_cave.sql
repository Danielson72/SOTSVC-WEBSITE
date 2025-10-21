/*
  # Security Improvements
  
  1. Changes
    - Add security event logging
    - Improve RLS policies
    - Add input validation
    - Add rate limiting
    
  2. Security
    - Enforce proper authentication
    - Add row-level security
    - Validate user input
*/

-- Add security event logging function
CREATE OR REPLACE FUNCTION log_security_event(
  event_type text,
  severity text,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO security_events (
    event_type,
    severity,
    description,
    metadata
  ) VALUES (
    event_type,
    severity,
    description,
    metadata
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Improve profiles RLS
DROP POLICY IF EXISTS "Enable all operations for profiles" ON profiles;
CREATE POLICY "Restrict profile access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Improve bookings RLS
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;

CREATE POLICY "Restrict booking access"
  ON bookings
  FOR ALL
  TO authenticated
  USING (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND type = 'admin'
    )
  )
  WITH CHECK (
    customer_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Add input validation functions
CREATE OR REPLACE FUNCTION validate_email(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION validate_phone(phone text)
RETURNS boolean AS $$
BEGIN
  RETURN phone ~ '^\+?[\d\s-\(\)]+$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add constraints to profiles
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_email'
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT valid_email CHECK (validate_email(email));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'valid_phone'
  ) THEN
    ALTER TABLE profiles
      ADD CONSTRAINT valid_phone CHECK (validate_phone(phone));
  END IF;
END $$;

-- Add rate limiting function
CREATE OR REPLACE FUNCTION check_rate_limit(
  user_id uuid,
  action text,
  max_requests int DEFAULT 100,
  window_minutes int DEFAULT 60
) RETURNS boolean AS $$
DECLARE
  request_count int;
BEGIN
  SELECT COUNT(*)
  INTO request_count
  FROM request_logs
  WHERE 
    request_logs.user_id = check_rate_limit.user_id
    AND request_logs.created_at >= NOW() - (window_minutes || ' minutes')::interval;
    
  RETURN request_count < max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create request_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS request_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  endpoint text,
  method text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Add request logging trigger
CREATE OR REPLACE FUNCTION log_request()
RETURNS trigger AS $$
BEGIN
  INSERT INTO request_logs (
    user_id,
    endpoint,
    method,
    ip_address,
    user_agent
  ) VALUES (
    auth.uid(),
    current_setting('request.path', true),
    current_setting('request.method', true),
    current_setting('request.headers', true)::jsonb->>'x-real-ip',
    current_setting('request.headers', true)::jsonb->>'user-agent'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for request logging
DROP TRIGGER IF EXISTS log_request_trigger ON auth.users;
CREATE TRIGGER log_request_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION log_request();

-- Enable RLS on request_logs
ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;

-- Add RLS policy for request_logs
CREATE POLICY "Only admins can view request logs"
  ON request_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND type = 'admin'
    )
  );