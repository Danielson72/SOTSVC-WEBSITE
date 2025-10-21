-- Add any missing indexes for performance
CREATE INDEX IF NOT EXISTS idx_quote_requests_email ON quote_requests(email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_created_at ON quote_requests(created_at);

-- Add validation function for phone numbers
CREATE OR REPLACE FUNCTION is_valid_phone(phone text)
RETURNS boolean AS $$
BEGIN
  RETURN phone ~ '^[\d\s\-\(\)]+$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add validation function for email
CREATE OR REPLACE FUNCTION is_valid_email(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add constraints for validation
ALTER TABLE quote_requests
  ADD CONSTRAINT valid_phone CHECK (is_valid_phone(phone)),
  ADD CONSTRAINT valid_email CHECK (is_valid_email(email));