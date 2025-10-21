-- First, enable the http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- Drop existing function and trigger
DROP TRIGGER IF EXISTS send_form_notification ON form_submissions;
DROP FUNCTION IF EXISTS notify_form_submission();

-- Create function to trigger email notification
CREATE OR REPLACE FUNCTION notify_form_submission()
RETURNS trigger AS $$
BEGIN
  -- Call Edge Function to send email
  PERFORM
    extensions.http_post(
      url := CONCAT(current_setting('app.settings.supabase_url'), '/functions/v1/form-notification'),
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', CONCAT('Bearer ', current_setting('app.settings.service_role_key'))
      ),
      body := jsonb_build_object(
        'record', row_to_json(NEW)
      )::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for form submissions
CREATE TRIGGER send_form_notification
  AFTER INSERT ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION notify_form_submission();