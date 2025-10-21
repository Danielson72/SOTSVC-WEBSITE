-- Migration: Database Trigger for Contact Email Notifications
-- Created: 2025-10-20
-- Purpose: Auto-invoke Edge Function when new contact request is submitted
-- Reference: FORMS-PRD.md Section 2 (Edge Function Integration)

-- ============================================================================
-- TRIGGER FUNCTION
-- ============================================================================
-- This function fires AFTER INSERT on contact_requests
-- It makes an HTTP POST to the Edge Function with the new row data

create or replace function public.trigger_notify_contact()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  request_id bigint;
  function_url text;
  payload jsonb;
begin
  -- ========================================================================
  -- 1. CONSTRUCT EDGE FUNCTION URL
  -- ========================================================================
  -- Format: https://<project-ref>.supabase.co/functions/v1/notify_contact
  -- Note: Replace <project-ref> with your actual Supabase project reference
  -- For SOTSVC project: jvznxszxlqtvizpjokav

  function_url := 'https://jvznxszxlqtvizpjokav.supabase.co/functions/v1/notify_contact';

  -- ========================================================================
  -- 2. PREPARE PAYLOAD
  -- ========================================================================
  -- Send the entire new row as JSON
  -- Edge Function expects: { "record": { ...row data... } }

  payload := jsonb_build_object(
    'record', to_jsonb(NEW)
  );

  -- ========================================================================
  -- 3. INVOKE EDGE FUNCTION (ASYNC)
  -- ========================================================================
  -- Uses pg_net extension for async HTTP requests
  -- This prevents INSERT from blocking if email service is slow

  select net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
    ),
    body := payload
  ) into request_id;

  -- Log the request for debugging
  raise log 'Contact email notification queued: request_id=%, contact_id=%',
    request_id, NEW.id;

  -- ========================================================================
  -- 4. RETURN NEW ROW
  -- ========================================================================
  -- Required for AFTER INSERT triggers
  -- The row is already inserted, this just satisfies the trigger contract

  return NEW;

exception
  when others then
    -- ======================================================================
    -- ERROR HANDLING
    -- ======================================================================
    -- If email fails, DON'T block the form submission
    -- Log the error and continue
    raise warning 'Failed to queue email notification: %', SQLERRM;
    return NEW;

end;
$$;

-- ============================================================================
-- CREATE TRIGGER
-- ============================================================================
-- Fires AFTER each INSERT on contact_requests
-- Calls trigger_notify_contact() function

create trigger tg_contact_email
  after insert on public.contact_requests
  for each row
  execute function public.trigger_notify_contact();

-- ============================================================================
-- ENABLE pg_net EXTENSION
-- ============================================================================
-- Required for HTTP requests from database triggers
-- This extension allows async HTTP calls without blocking

create extension if not exists pg_net with schema extensions;

-- ============================================================================
-- COMMENTS
-- ============================================================================

comment on function public.trigger_notify_contact is
  'Trigger function that invokes notify_contact Edge Function when new contact request is submitted';

comment on trigger tg_contact_email on public.contact_requests is
  'Automatically sends email notifications for new contact form submissions';

-- ============================================================================
-- TESTING QUERIES
-- ============================================================================
-- Uncomment to test trigger functionality

-- Test 1: Insert a test record (should trigger email)
-- INSERT INTO public.contact_requests (full_name, email, phone, message, form_type)
-- VALUES ('Trigger Test', 'test@example.com', '(407) 555-0100', 'Testing trigger', 'embedded');

-- Test 2: Check trigger exists
-- SELECT trigger_name, event_manipulation, event_object_table
-- FROM information_schema.triggers
-- WHERE trigger_name = 'tg_contact_email';

-- Test 3: Check function exists
-- SELECT routine_name, routine_type
-- FROM information_schema.routines
-- WHERE routine_name = 'trigger_notify_contact';

-- ============================================================================
-- IMPORTANT NOTES FOR DEPLOYMENT
-- ============================================================================
--
-- 1. SERVICE ROLE KEY:
--    The trigger uses `current_setting('app.settings.service_role_key', true)`
--    This must be set in Supabase Dashboard → Settings → Vault
--    Key name: app.settings.service_role_key
--    Value: Your service_role JWT token
--
-- 2. EDGE FUNCTION URL:
--    Update the function_url variable if deploying to different project
--    Current: https://jvznxszxlqtvizpjokav.supabase.co/functions/v1/notify_contact
--
-- 3. pg_net EXTENSION:
--    Verify extension is enabled: SELECT * FROM pg_extension WHERE extname = 'pg_net';
--    If not enabled, run: CREATE EXTENSION pg_net;
--
-- 4. ERROR HANDLING:
--    The trigger is designed to NEVER block form submissions
--    If email fails, it logs a warning but allows INSERT to complete
--    This ensures user experience is not affected by email service downtime
--
-- 5. TESTING:
--    After deployment, insert a test row and check Edge Function logs:
--    supabase functions logs notify_contact --tail
--
