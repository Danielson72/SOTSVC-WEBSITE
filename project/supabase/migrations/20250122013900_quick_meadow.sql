/*
  # Update Form Submissions Validation and Policies

  1. Changes
    - Update validation function with improved error handling
    - Add better data validation for form submissions
    - Ensure proper trigger setup

  2. Security
    - Maintain existing RLS policies
    - Add robust data validation
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS validate_form_submission_trigger ON form_submissions;

-- Update validation function with better error messages
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

-- Create new trigger with updated validation
CREATE TRIGGER validate_form_submission_trigger
  BEFORE INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION validate_form_submission();