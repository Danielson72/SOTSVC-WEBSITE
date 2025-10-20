-- Migration: Contact Requests Schema
-- Created: 2025-10-20
-- Purpose: SOTSVC Universal Contact Form backend storage
-- Reference: FORMS-PRD.md Section 1

-- ============================================================================
-- TABLE: contact_requests
-- ============================================================================
-- Stores all contact form submissions from SOTSVC and future properties

create table public.contact_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  source_site text not null default 'SOTSVC.com',
  form_type   text check (form_type in ('embedded','popup','standalone')),
  full_name   text not null,
  email       text not null check (
    email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  phone       text,
  message     text
);

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Performance optimization for common queries

create index idx_contact_requests_created_at
  on public.contact_requests (created_at desc);

create index idx_contact_requests_source_site
  on public.contact_requests (source_site);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Security policies to control data access

-- Enable RLS on the table
alter table public.contact_requests enable row level security;

-- Policy 1: Allow anonymous form submissions (public website visitors)
-- Anonymous users can INSERT but not SELECT (prevents data scraping)
create policy "Allow anonymous form submissions"
  on public.contact_requests
  for insert
  to anon
  with check (true);

-- Policy 2: Service role has full read access (dashboards, analytics)
-- Backend systems can read all submissions for business intelligence
create policy "Service role can read all"
  on public.contact_requests
  for select
  to service_role
  using (true);

-- Policy 3: Authenticated users can view their own submissions
-- If we add auth in future, users can track their requests
create policy "Users can read own submissions"
  on public.contact_requests
  for select
  to authenticated
  using (email = auth.jwt() ->> 'email');

-- ============================================================================
-- COMMENTS
-- ============================================================================
-- Documentation for future developers

comment on table public.contact_requests is
  'Contact form submissions from SOTSVC.com and affiliated properties';

comment on column public.contact_requests.source_site is
  'Origin domain of the form submission (SOTSVC.com, TrustedCleaningExpert.com, etc.)';

comment on column public.contact_requests.form_type is
  'UI variant: embedded (inline), popup (modal), standalone (full page)';

-- ============================================================================
-- TESTING QUERIES
-- ============================================================================
-- Uncomment to verify migration success

-- SELECT COUNT(*) FROM public.contact_requests;
-- Expected: 0 (empty table on first deploy)

-- INSERT INTO public.contact_requests (full_name, email, form_type)
-- VALUES ('Test User', 'test@example.com', 'embedded');
-- Expected: Success (anon insert allowed)

-- SELECT * FROM public.contact_requests;
-- Expected: Error (anon cannot SELECT due to RLS)
