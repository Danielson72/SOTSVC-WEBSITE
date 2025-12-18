-- ============================================================================
-- SOTSVC Contact Form RLS Policy Fix
-- Run this in Supabase SQL Editor: supabase.com → Project → SQL Editor
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Remove any existing broken policies
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow anonymous contact form submissions" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow anonymous contact submissions" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow public inserts to contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow anonymous inserts to contact_requests" ON public.contact_requests;
DROP POLICY IF EXISTS "Allow anonymous to not select contact_requests" ON public.contact_requests;

-- Create the correct INSERT policy for anonymous users
CREATE POLICY "Allow public inserts to contact_requests"
ON public.contact_requests
FOR INSERT
TO anon
WITH CHECK (true);

-- Verify the policy was created
SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'contact_requests';
