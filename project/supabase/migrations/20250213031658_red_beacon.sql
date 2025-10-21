/*
  # Add Testimonials System

  1. New Tables
    - testimonials
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - name (text)
      - job_title (text, optional)
      - rating (integer)
      - comment (text)
      - is_approved (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on testimonials table
    - Add policies for:
      - Public read access to approved testimonials
      - Authenticated users can create testimonials
      - Users can delete their own testimonials
      - Admins can manage all testimonials
*/

-- Create testimonials table
CREATE TABLE testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  job_title text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  is_approved boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authenticated users can create testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING ((SELECT type FROM profiles WHERE id = auth.uid()) = 'admin');

-- Add updated_at trigger
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();