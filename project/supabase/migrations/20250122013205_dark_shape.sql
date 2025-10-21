/*
  # Fix RLS Policies for Form Submissions

  1. Changes
    - Update RLS policies to allow anonymous submissions
    - Add validation trigger to form_submissions table
    - Drop old contact_messages table

  2. Security
    - Allow public submissions without authentication
    - Restrict viewing to admins only
    - Add data validation on insert
*/

-- Drop old table
DROP TABLE IF EXISTS contact_messages;

-- Update form_submissions policies
DROP POLICY IF EXISTS "Anyone can submit forms" ON form_submissions;
DROP POLICY IF EXISTS "Admins can view submissions" ON form_submissions;

-- Create new policies
CREATE POLICY "Enable public form submissions"
  ON form_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Only admins can view submissions"
  ON form_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND type = 'admin'
    )
  );

-- Add validation trigger
CREATE TRIGGER validate_form_submission_trigger
  BEFORE INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION validate_form_submission();