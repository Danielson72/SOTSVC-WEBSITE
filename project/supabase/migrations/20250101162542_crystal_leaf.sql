/*
  # Authentication and User Management System

  1. New Tables
    - `auth_sessions` - User authentication sessions
      - session tracking
      - device information
      - last activity
    - `auth_logs` - Authentication activity logging
      - login attempts
      - password changes
      - security events

  2. Security
    - Enable RLS on all tables
    - Strict access control
    - Activity logging for security events

  3. Changes
    - Add session management
    - Add security logging
*/

-- Auth Sessions table
CREATE TABLE IF NOT EXISTS auth_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  device_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  ip_address text,
  last_activity timestamptz DEFAULT now(),
  is_valid boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;

-- Auth Logs table
CREATE TABLE IF NOT EXISTS auth_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN (
    'login_success',
    'login_failed',
    'logout',
    'password_change',
    'password_reset_request',
    'email_change',
    'profile_update'
  )),
  ip_address text,
  user_agent text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE auth_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Auth Sessions policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_sessions' AND policyname = 'Users can view own sessions'
  ) THEN
    CREATE POLICY "Users can view own sessions"
      ON auth_sessions FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_sessions' AND policyname = 'Users can update own sessions'
  ) THEN
    CREATE POLICY "Users can update own sessions"
      ON auth_sessions FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_sessions' AND policyname = 'System can manage sessions'
  ) THEN
    CREATE POLICY "System can manage sessions"
      ON auth_sessions
      TO authenticated
      USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin')
      WITH CHECK ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');
  END IF;
END $$;

-- Auth Logs policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_logs' AND policyname = 'Users can view own logs'
  ) THEN
    CREATE POLICY "Users can view own logs"
      ON auth_logs FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'auth_logs' AND policyname = 'System can create logs'
  ) THEN
    CREATE POLICY "System can create logs"
      ON auth_logs FOR INSERT
      TO authenticated
      WITH CHECK (
        auth.uid() = user_id OR
        (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
      );
  END IF;
END $$;

-- Add triggers for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_auth_sessions_updated_at'
  ) THEN
    CREATE TRIGGER update_auth_sessions_updated_at
        BEFORE UPDATE ON auth_sessions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create function to log auth events
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id uuid,
  p_event_type text,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS uuid AS $$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO auth_logs (
    user_id,
    event_type,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_user_id,
    p_event_type,
    p_ip_address,
    p_user_agent,
    p_metadata
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;