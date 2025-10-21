-- First, drop the previous trigger and function
DROP TRIGGER IF EXISTS send_quote_request_webhook ON quote_requests;
DROP FUNCTION IF EXISTS notify_quote_request_webhook();

-- Create a more reliable notification system using pg_notify
CREATE OR REPLACE FUNCTION notify_new_quote_request()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify through Postgres notification system
  PERFORM pg_notify(
    'new_quote_request',
    json_build_object(
      'id', NEW.id,
      'full_name', NEW.full_name,
      'email', NEW.email,
      'phone', NEW.phone,
      'service_type', NEW.service_type,
      'address', NEW.address,
      'preferred_date', NEW.preferred_date,
      'preferred_time', NEW.preferred_time,
      'sms_opt_in', NEW.sms_opt_in,
      'created_at', NEW.created_at
    )::text
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for notifications
CREATE TRIGGER notify_new_quote_request_trigger
  AFTER INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_quote_request();