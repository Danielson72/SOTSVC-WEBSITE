/*
  # Create Contact Messages Table

  1. New Tables
    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `message` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `contact_messages` table
    - Add policy for public form submissions
    - Add policy for admin access
*/

-- Create contact_messages table
CREATE TABLE contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable public contact message submissions"
  ON contact_messages FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admins can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add validation function
CREATE OR REPLACE FUNCTION validate_contact_message()
RETURNS trigger AS $$
BEGIN
  -- Email validation
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Phone validation (if provided)
  IF NEW.phone IS NOT NULL AND NEW.phone !~ '^[\d\s\-\(\)]+$' THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger
CREATE TRIGGER validate_contact_message_trigger
  BEFORE INSERT ON contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION validate_contact_message();