/*
  # Auth and Booking Updates
  
  1. New Tables
    - user_sessions
      - id (uuid, primary key)
      - user_id (uuid, references profiles)
      - last_seen (timestamp)
      - is_active (boolean)
  
  2. Changes
    - Add special_details to bookings table
    
  3. Security
    - Enable RLS on all tables
    - Add policies for user access
*/

-- Create user_sessions table
CREATE TABLE user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  last_seen timestamptz DEFAULT now(),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON user_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add special_details to bookings if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'bookings' AND column_name = 'special_details'
  ) THEN
    ALTER TABLE bookings ADD COLUMN special_details text;
  END IF;
END $$;