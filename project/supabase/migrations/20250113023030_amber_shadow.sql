/*
  # Fix Email Notification Issues

  1. Changes
    - Removes the problematic email notification trigger
    - Keeps the core quote request functionality intact
    
  2. Security
    - Maintains existing RLS policies
    - No impact on data security
*/

-- Drop the problematic notification function and trigger
DROP TRIGGER IF EXISTS send_quote_request_notification ON quote_requests;
DROP FUNCTION IF EXISTS notify_new_quote_request();

-- Ensure quote_requests table has proper structure
DO $$ 
BEGIN
  -- Add any missing columns if needed
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quote_requests' AND column_name = 'notes'
  ) THEN
    ALTER TABLE quote_requests ADD COLUMN notes text;
  END IF;
END $$;