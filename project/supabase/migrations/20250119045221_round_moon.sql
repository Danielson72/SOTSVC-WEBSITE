-- Create a function to send webhook notifications
CREATE OR REPLACE FUNCTION notify_quote_request_webhook()
RETURNS TRIGGER AS $$
BEGIN
  -- Make HTTP POST request to Zapier webhook
  PERFORM
    http_post(
      'https://hooks.zapier.com/hooks/catch/21348455/2k50hfb/',
      jsonb_build_object(
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
      )::text,
      'application/json'
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for webhook notifications
DROP TRIGGER IF EXISTS send_quote_request_webhook ON quote_requests;
CREATE TRIGGER send_quote_request_webhook
  AFTER INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_quote_request_webhook();