# 🚀 SOTSVC Contact Forms Backend - Deployment Guide

**Project:** SOTSVC Universal Contact Forms
**Component:** Backend (Database + Edge Function + Trigger)
**Created:** 2025-10-20
**Last Updated:** 2025-10-20

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Deployment](#database-deployment)
4. [Edge Function Deployment](#edge-function-deployment)
5. [Verification & Testing](#verification--testing)
6. [Troubleshooting](#troubleshooting)
7. [Rollback Procedures](#rollback-procedures)

---

## 🔧 Prerequisites

Before deploying, ensure you have:

- [x] **Supabase CLI** installed and authenticated
  ```bash
  # Install (if needed)
  brew install supabase/tap/supabase

  # Login
  supabase login

  # Verify authentication
  supabase projects list
  ```

- [x] **Resend Account** with API key
  - Sign up at: https://resend.com
  - Get API key from: https://resend.com/api-keys
  - Verify sender domain: `sotsvc.com`

- [x] **Git Access** to SOTSVC-WEBSITE repository
  ```bash
  git clone https://github.com/Danielson72/SOTSVC-WEBSITE.git
  cd SOTSVC-WEBSITE
  ```

- [x] **Project Reference ID**: `jvznxszxlqtvizpjokav`

---

## 🔐 Environment Setup

### Step 1: Link to Supabase Project

```bash
# Navigate to project directory
cd "/Users/danielalvarez/Development/My web projects and apps/NET POWER/WEBSITE/SOTSVC-WEBSITE"

# Link to remote project
supabase link --project-ref jvznxszxlqtvizpjokav

# Verify link
supabase status
```

**Expected Output:**
```
Linked to project: jvznxszxlqtvizpjokav (sotsvc-contact)
Status: Running
```

### Step 2: Set Resend API Key

```bash
# Set secret in Supabase vault
supabase secrets set RESEND_API_KEY="re_live_YOUR_ACTUAL_KEY_HERE"

# Verify secret is set (value will be redacted)
supabase secrets list
```

**Expected Output:**
```
┌──────────────────┬─────────────┐
│ NAME             │ VALUE       │
├──────────────────┼─────────────┤
│ RESEND_API_KEY   │ [REDACTED]  │
└──────────────────┴─────────────┘
```

### Step 3: Set Service Role Key (For Trigger)

```bash
# Get service_role key from Supabase Dashboard
# https://supabase.com/dashboard/project/jvznxszxlqtvizpjokav/settings/api

# Set as vault secret
supabase secrets set SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## 🗄️ Database Deployment

### Step 1: Review Migrations

```bash
# Check existing migrations
ls -la supabase/migrations/

# Expected files:
# - 20251020_contact_requests_schema.sql
# - 20251020_trigger_notify_contact.sql
```

### Step 2: Apply Migrations Locally (Optional - for testing)

```bash
# Start local Supabase instance (requires Docker)
supabase start

# Reset local database and apply all migrations
supabase db reset

# Check tables were created
supabase db list
```

### Step 3: Deploy to Production Database

```bash
# Push migrations to remote database
supabase db push

# Confirm when prompted:
# "Apply migrations to remote database? (y/N)"
# Type: y
```

**Expected Output:**
```
Applying migration 20251020_contact_requests_schema.sql...
Applying migration 20251020_trigger_notify_contact.sql...
✅ Migrations applied successfully
```

### Step 4: Verify Database Schema

```bash
# Connect to remote database
supabase db shell

# Run verification queries:
```

```sql
-- Check table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name = 'contact_requests';

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'contact_requests';

-- Check policies exist
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'contact_requests';

-- Check trigger exists
SELECT trigger_name, event_manipulation
FROM information_schema.triggers
WHERE trigger_name = 'tg_contact_email';

-- Exit
\q
```

**Expected Results:**
- Table: `contact_requests` ✅
- RLS: `true` ✅
- Policies: 3 policies (anon insert, service_role select, authenticated select) ✅
- Trigger: `tg_contact_email` on INSERT ✅

---

## ⚡ Edge Function Deployment

### Step 1: Verify Function Files

```bash
# Check function directory structure
ls -la supabase/functions/notify_contact/

# Expected file:
# - index.ts
```

### Step 2: Deploy Edge Function

```bash
# Deploy function (--no-verify-jwt allows database trigger access)
supabase functions deploy notify_contact --no-verify-jwt

# Wait for deployment to complete...
```

**Expected Output:**
```
Deploying function notify_contact...
✅ Function deployed successfully
URL: https://jvznxszxlqtvizpjokav.supabase.co/functions/v1/notify_contact
```

### Step 3: Verify Function is Active

```bash
# List all functions
supabase functions list

# Expected output should show notify_contact with status: ACTIVE
```

### Step 4: Check Function Logs (Optional)

```bash
# Tail function logs to monitor activity
supabase functions logs notify_contact --tail

# Keep this running in a separate terminal window
# Press Ctrl+C to stop
```

---

## ✅ Verification & Testing

### Test 1: Manual Database Insert (Smoke Test)

```bash
# Connect to database
supabase db shell
```

```sql
-- Insert test contact request
INSERT INTO public.contact_requests
  (full_name, email, phone, message, form_type, source_site)
VALUES
  ('Smoke Test User', 'test@example.com', '(407) 123-4567', 'Testing backend deployment', 'embedded', 'SOTSVC.com');

-- Exit
\q
```

**Expected Behavior:**
1. ✅ Row inserts successfully (no errors)
2. ✅ Trigger fires automatically
3. ✅ Edge Function is invoked
4. ✅ Two emails sent within 5 seconds:
   - Owner email to: `dalvarez@sotsvc.com`
   - Visitor email to: `test@example.com`

### Test 2: Verify Email Delivery

**Check Owner Inbox:**
- Email should arrive at: `dalvarez@sotsvc.com`
- Subject: "🚀 New SOTSVC Lead – Smoke Test User"
- Contains all form fields
- Professional HTML formatting

**Check Test Inbox:**
- Email should arrive at: `test@example.com`
- Subject: "We received your request ✨"
- Personalized greeting
- Company information and phone number

### Test 3: Check Function Logs

```bash
# View recent function invocations
supabase functions logs notify_contact --tail
```

**Expected Log Output:**
```
📧 Processing contact request from: Smoke Test User (test@example.com)
✅ Owner email sent: re_xxxxxxxxx
✅ Visitor email sent: re_xxxxxxxxx
```

### Test 4: Verify RLS Policies

```bash
# Try to SELECT as anonymous user (should fail)
supabase db shell
```

```sql
-- Set role to anonymous
SET ROLE anon;

-- Try to read contacts (should return empty or error due to RLS)
SELECT * FROM public.contact_requests;

-- Reset role
RESET ROLE;

-- Read as service_role (should succeed)
SELECT * FROM public.contact_requests;

\q
```

**Expected Behavior:**
- ✅ anon role: Cannot SELECT (RLS blocks)
- ✅ service_role: Can SELECT all rows

---

## 🐛 Troubleshooting

### Issue: Migration Fails with "relation already exists"

**Solution:**
```bash
# Check if table already exists
supabase db shell
SELECT * FROM public.contact_requests LIMIT 1;

# If exists, either:
# Option A: Drop and recreate (WARNING: loses data)
DROP TABLE IF EXISTS public.contact_requests CASCADE;

# Option B: Skip migration if schema matches
# (manually verify schema matches migration file)
```

### Issue: Edge Function Deployment Fails

**Common Causes:**
1. TypeScript syntax errors in `index.ts`
2. Missing Deno import URLs
3. Function already exists with different configuration

**Solution:**
```bash
# Check function syntax locally
deno check supabase/functions/notify_contact/index.ts

# Delete existing function and redeploy
supabase functions delete notify_contact
supabase functions deploy notify_contact --no-verify-jwt
```

### Issue: Emails Not Sending

**Diagnostic Steps:**

1. **Check Resend API Key:**
   ```bash
   supabase secrets list
   # Verify RESEND_API_KEY is set
   ```

2. **Check Function Logs:**
   ```bash
   supabase functions logs notify_contact --tail
   # Look for error messages
   ```

3. **Verify Sender Domain:**
   - Visit: https://resend.com/domains
   - Ensure `sotsvc.com` is verified
   - Check DNS records are configured

4. **Test Resend API Directly:**
   ```bash
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "forms@sotsvc.com",
       "to": ["test@example.com"],
       "subject": "Test",
       "html": "<p>Test email</p>"
     }'
   ```

### Issue: Trigger Not Firing

**Diagnostic Steps:**

1. **Check Trigger Exists:**
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE trigger_name = 'tg_contact_email';
   ```

2. **Check pg_net Extension:**
   ```sql
   SELECT * FROM pg_extension WHERE extname = 'pg_net';
   ```

3. **Enable Trigger Logging:**
   ```sql
   -- Triggers log to Postgres logs
   -- Check Supabase Dashboard → Logs → Postgres
   ```

4. **Manual Function Test:**
   ```bash
   # Invoke function directly
   curl -X POST https://jvznxszxlqtvizpjokav.supabase.co/functions/v1/notify_contact \
     -H "Content-Type: application/json" \
     -d '{
       "record": {
         "id": "test",
         "full_name": "Test",
         "email": "test@example.com",
         "created_at": "2025-10-20T12:00:00Z",
         "source_site": "SOTSVC.com",
         "form_type": "embedded"
       }
     }'
   ```

---

## 🔄 Rollback Procedures

### Rollback Database Migrations

```bash
# WARNING: This will lose all data in contact_requests table

# Connect to database
supabase db shell
```

```sql
-- Drop trigger
DROP TRIGGER IF EXISTS tg_contact_email ON public.contact_requests;

-- Drop trigger function
DROP FUNCTION IF EXISTS public.trigger_notify_contact();

-- Drop table (CASCADE removes policies and indexes)
DROP TABLE IF EXISTS public.contact_requests CASCADE;

-- Disable extension (optional)
DROP EXTENSION IF EXISTS pg_net;

\q
```

### Rollback Edge Function

```bash
# Delete function from Supabase
supabase functions delete notify_contact

# Confirm when prompted
```

### Rollback Secrets

```bash
# Remove secrets (if needed)
supabase secrets unset RESEND_API_KEY
supabase secrets unset SERVICE_ROLE_KEY
```

### Full Rollback to Previous State

```bash
# If you need to completely undo this deployment:

# 1. Delete function
supabase functions delete notify_contact

# 2. Revert database
supabase db shell
DROP TRIGGER IF EXISTS tg_contact_email ON public.contact_requests;
DROP FUNCTION IF EXISTS public.trigger_notify_contact();
DROP TABLE IF EXISTS public.contact_requests CASCADE;
\q

# 3. Clean secrets
supabase secrets unset RESEND_API_KEY

# 4. Git revert (if committed)
git revert HEAD
git push origin main
```

---

## 📊 Post-Deployment Checklist

After successful deployment, verify:

- [ ] Database table `contact_requests` exists
- [ ] RLS policies are active (3 policies)
- [ ] Trigger `tg_contact_email` is enabled
- [ ] Edge Function `notify_contact` status is ACTIVE
- [ ] Secret `RESEND_API_KEY` is set
- [ ] Smoke test insert succeeds
- [ ] Owner email received
- [ ] Visitor email received
- [ ] Function logs show no errors
- [ ] Resend dashboard shows 2 emails sent

---

## 🔗 Reference Links

- **Supabase Dashboard**: https://supabase.com/dashboard/project/jvznxszxlqtvizpjokav
- **Resend Dashboard**: https://resend.com/emails
- **Function Logs**: https://supabase.com/dashboard/project/jvznxszxlqtvizpjokav/functions/notify_contact/logs
- **Database Logs**: https://supabase.com/dashboard/project/jvznxszxlqtvizpjokav/logs/postgres-logs
- **FORMS-PRD**: [FORMS-PRD.md](../FORMS-PRD.md)

---

## 📞 Support

**Deployed By:** Claude Code (AI Agent)
**Project Owner:** Daniel Alvarez
**Contact:** dalvarez@sotsvc.com
**Phone:** (407) 461-6039

**Scripture Foundation:**
> "Let all things be done decently and in order." – 1 Corinthians 14:40

---

**End of Deployment Guide**

*Last Updated: 2025-10-20*
