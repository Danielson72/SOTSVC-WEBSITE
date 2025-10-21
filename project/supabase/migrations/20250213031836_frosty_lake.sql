-- Drop existing testimonials table if it exists
DROP TABLE IF EXISTS testimonials CASCADE;

-- Create testimonials table with improved structure
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

-- Create improved RLS policies
CREATE POLICY "Anyone can view approved testimonials"
  ON testimonials FOR SELECT
  USING (is_approved = true OR auth.uid() = user_id);

CREATE POLICY "Users can create testimonials"
  ON testimonials FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own testimonials"
  ON testimonials FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can delete own testimonials"
  ON testimonials FOR DELETE
  TO authenticated
  USING (
    auth.uid() = user_id OR
    (SELECT type FROM profiles WHERE id = auth.uid()) = 'admin'
  );

-- Add updated_at trigger
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to notify admins of new testimonials
CREATE OR REPLACE FUNCTION notify_new_testimonial()
RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify(
    'new_testimonial',
    json_build_object(
      'id', NEW.id,
      'name', NEW.name,
      'rating', NEW.rating,
      'created_at', NEW.created_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for notifications
CREATE TRIGGER notify_new_testimonial_trigger
  AFTER INSERT ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_testimonial();