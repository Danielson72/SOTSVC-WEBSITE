-- Drop existing table if it exists
DROP TABLE IF EXISTS form_submissions CASCADE;

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

-- Create policies with unique names
CREATE POLICY "form_submissions_insert_policy"
  ON form_submissions FOR INSERT
  TO public
  WITH CHECK (
    type IN ('contact', 'quote') AND
    (data ? 'email') AND
    (data->>'email' IS NOT NULL)
  );

CREATE POLICY "form_submissions_select_policy"
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

-- Create validation function
CREATE OR REPLACE FUNCTION validate_form_submission()
RETURNS trigger AS $$
BEGIN
  -- Basic validation
  IF NEW.type NOT IN ('contact', 'quote') THEN
    RAISE EXCEPTION 'Invalid form type';
  END IF;

  -- Email validation
  IF NEW.data->>'email' IS NULL OR 
     NEW.data->>'email' !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Type-specific validation
  CASE NEW.type
    WHEN 'contact' THEN
      IF NEW.data->>'name' IS NULL OR NEW.data->>'message' IS NULL THEN
        RAISE EXCEPTION 'Missing required fields for contact form';
      END IF;
    WHEN 'quote' THEN
      IF NEW.data->>'fullName' IS NULL OR 
         NEW.data->>'phone' IS NULL OR
         NEW.data->>'serviceType' IS NULL OR
         NEW.data->>'address' IS NULL OR
         NEW.data->>'preferredDate' IS NULL OR
         NEW.data->>'preferredTime' IS NULL THEN
        RAISE EXCEPTION 'Missing required fields for quote form';
      END IF;
  END CASE;

  -- Phone validation (if provided)
  IF (NEW.data->>'phone' IS NOT NULL) AND 
     (NEW.data->>'phone' !~ '^[\d\s\-\(\)]+$') THEN
    RAISE EXCEPTION 'Invalid phone number format';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add validation trigger
CREATE TRIGGER validate_form_submission_trigger
  BEFORE INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION validate_form_submission();