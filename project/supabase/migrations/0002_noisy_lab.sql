/*
  # Security-related tables

  1. New Tables
    - `auth_logs`: Track authentication attempts
    - `request_logs`: Track API requests for rate limiting
    - `security_events`: Log security-related events
  
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
*/

-- Auth Logs
CREATE TABLE auth_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  email text,
  action text NOT NULL,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view auth logs"
  ON auth_logs FOR SELECT
  TO authenticated
  USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

-- Request Logs
CREATE TABLE request_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  endpoint text NOT NULL,
  method text NOT NULL,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE request_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view request logs"
  ON request_logs FOR SELECT
  TO authenticated
  USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

-- Security Events
CREATE TABLE security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  severity text NOT NULL,
  description text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view security events"
  ON security_events FOR SELECT
  TO authenticated
  USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');