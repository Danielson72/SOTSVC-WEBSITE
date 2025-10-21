/*
  # Form Submissions API Setup

  1. New Tables
    - `form_submissions` (unified table for all form submissions)
      - `id` (uuid, primary key)
      - `type` (text) - 'contact' or 'quote'
      - `data` (jsonb) - stores all form fields
      - `status` (text) - 'pending', 'processed', 'failed'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policy for public submissions
    - Add policy for admin viewing
*/

-- Create form_submissions table
CREATE TABLE form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('contact', 'quote')),
  data jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'processed', 'failed')) DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can submit forms"
  ON form_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view submissions"
  ON form_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Add updated_at trigger
CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to validate form data
CREATE OR REPLACE FUNCTION validate_form_submission()
RETURNS trigger AS $$
BEGIN
  -- Validate email format
  IF NEW.data->>'email' IS NOT NULL AND 
     NEW.data->>'email' !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Validate phone format (if provided)
  IF NEW.data->>'phone' IS NOT NULL AND 
     NEW.data->>'phone' !~ '^[\d\s\-\(\)]+$' THEN
    RAISE EXCEPTION 'Invalid phone format';
  END IF;

  -- Validate required fields based on form type
  IF NEW.type = 'contact' THEN
    IF NEW.data->>'name' IS NULL OR NEW.data->>'email' IS NULL OR NEW.data->>'message' IS NULL THEN
      RAISE EXCEPTION 'Missing required fields for contact form';
    END IF;
  ELSIF NEW.type = 'quote' THEN
    IF NEW.data->>'fullName' IS NULL OR 
       NEW.data->>'email' IS NULL OR 
       NEW.data->>'phone' IS NULL OR
       NEW.data->>'serviceType' IS NULL OR
       NEW.data->>'address' IS NULL THEN
      RAISE EXCEPTION 'Missing required fields for quote form';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;