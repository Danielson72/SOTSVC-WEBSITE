/*
  # Add Email Notifications for Quote Requests

  1. New Functions
    - Creates a function to send email notifications for new quote requests
    - Adds a trigger to automatically send emails when quotes are submitted

  2. Security
    - Function runs with security definer to ensure proper permissions
    - Email notifications are sent only for valid quote requests
*/

-- Create function to send email notifications
CREATE OR REPLACE FUNCTION notify_new_quote_request()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.resend_api_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', 'Sonz of Thunder SVC <quotes@sotsvc.com>',
      'to', 'sonzofthunder72@gmail.com',
      'subject', 'New Quote Request Received',
      'html', format(
        'New quote request received:<br><br>' ||
        'Service Type: %s<br>' ||
        'Preferred Date: %s<br>' ||
        'Preferred Time: %s<br>' ||
        'Address: %s<br>' ||
        'SMS Opt-in: %s<br><br>' ||
        'Customer Details:<br>' ||
        'Name: %s<br>' ||
        'Email: %s<br>' ||
        'Phone: %s<br>',
        NEW.service_type,
        NEW.preferred_date,
        NEW.preferred_time,
        NEW.address,
        CASE WHEN NEW.sms_opt_in THEN 'Yes' ELSE 'No' END,
        (SELECT full_name FROM profiles WHERE id = NEW.user_id),
        (SELECT email FROM auth.users WHERE id = NEW.user_id),
        (SELECT phone FROM profiles WHERE id = NEW.user_id)
      )
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for email notifications
CREATE TRIGGER send_quote_request_notification
  AFTER INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_quote_request();