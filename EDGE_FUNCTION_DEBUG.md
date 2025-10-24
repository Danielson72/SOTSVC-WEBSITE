# 🔧 Edge Function 500 Error - Diagnostic Report

**Date:** 2025-10-23
**Issue:** Database trigger returns 500 error when calling Edge Function
**Status:** ROOT CAUSE IDENTIFIED ✅

---

## 📊 ANALYSIS RESULTS

### ✅ Payload Format: NO MISMATCH FOUND

**Database Trigger Sends:**
```json
{
  "record": {
    "id": "uuid",
    "created_at": "timestamp",
    "source_site": "SOTSVC.com",
    "form_type": "popup",
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "(407) 123-4567",
    "message": "Test message"
  }
}
```

**Edge Function Expects (index.ts:15-24):**
```typescript
interface ContactRequest {
  id: string
  created_at: string
  source_site: string
  form_type: string | null
  full_name: string         // ← Matches database column
  email: string
  phone: string | null
  message: string | null
}
```

**Verification:**
- ✅ Field names match (snake_case)
- ✅ Data types align
- ✅ Payload structure correct (`{ "record": {...} }`)

---

## ⚠️ MOST LIKELY ROOT CAUSE

### Missing Service Role Key Configuration

**Location:** Line 52 of `20251020_trigger_notify_contact.sql`

```sql
'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
```

**Issue:** This expects a Supabase Vault secret named `app.settings.service_role_key`

**Symptoms if missing:**
- ❌ Edge Function returns 401 Unauthorized
- ❌ Trigger catches exception and returns 500
- ✅ Direct curl test works (uses manual Bearer token)
- ✅ Form submission saves to database (trigger doesn't block)

---

## 🛠️ FIX: Configure Service Role Key

### Step 1: Get Service Role Key

**Option A - From Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/jvznxszxlqtvizpjokav
2. Click: Settings → API
3. Copy: `service_role` key (starts with `eyJ...`)

**Option B - From Local Config:**
```bash
# If you have it in .env.local
grep SERVICE_ROLE_KEY supabase/.env.local
```

### Step 2: Set Vault Secret

**Go to Supabase Dashboard:**
1. Navigate to: Project → Settings → Vault
2. Click: **New Secret**
3. Enter:
   - **Name:** `app.settings.service_role_key`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your service_role key)
4. Click: **Save**

### Step 3: Verify Vault Secret

**Run in SQL Editor:**
```sql
-- Test 1: Check if secret exists
SELECT current_setting('app.settings.service_role_key', true);
-- Expected: Returns your service_role JWT token

-- Test 2: Verify it's not null
SELECT
  CASE
    WHEN current_setting('app.settings.service_role_key', true) IS NULL
    THEN '❌ Secret NOT configured'
    ELSE '✅ Secret configured'
  END AS status;
```

### Step 4: Test Trigger After Fix

**Insert test record:**
```sql
INSERT INTO contact_requests (full_name, email, phone, message, form_type, source_site)
VALUES ('Vault Test', 'test@example.com', '(407) 555-0000', 'Testing after Vault fix', 'popup', 'SOTSVC.com');
```

**Expected Results:**
- ✅ Row inserted successfully
- ✅ Trigger fires without error
- ✅ Edge Function returns 200
- ✅ Emails sent to both owner and visitor

**Check Edge Function Logs:**
```bash
# In Supabase Dashboard
Edge Functions → notify_contact → Logs

# Expected output:
📧 Processing contact request from: Vault Test (test@example.com)
✅ Owner email sent: re_xxxxx
✅ Visitor email sent: re_xxxxx
```

---

## 🔍 ALTERNATIVE ROOT CAUSES (If Vault fix doesn't work)

### Issue #2: Wrong Edge Function URL

**Check:** Line 30 of trigger migration

```sql
function_url := 'https://jvznxszxlqtvizpjokav.supabase.co/functions/v1/notify_contact';
```

**Verify Edge Function exists:**
1. Go to: Supabase Dashboard → Edge Functions
2. Confirm: `notify_contact` is deployed
3. Check: Latest version number

**If function doesn't exist:**
```bash
# Deploy Edge Function
cd /path/to/SOTSVC-WEBSITE
supabase functions deploy notify_contact --project-ref jvznxszxlqtvizpjokav
```

### Issue #3: RESEND_API_KEY Not Set

**Check Edge Function Secrets:**
1. Go to: Edge Functions → notify_contact → Settings
2. Verify: `RESEND_API_KEY` is configured
3. Value should start with: `re_...`

**If missing:**
```bash
# Set secret via CLI
supabase secrets set RESEND_API_KEY=re_your_actual_key --project-ref jvznxszxlqtvizpjokav
```

### Issue #4: pg_net Extension Not Enabled

**Check in SQL Editor:**
```sql
SELECT * FROM pg_extension WHERE extname = 'pg_net';
```

**Expected:** 1 row returned

**If empty:**
```sql
CREATE EXTENSION pg_net WITH SCHEMA extensions;
```

---

## 📞 VERIFICATION CHECKLIST

After applying the fix, verify all these conditions:

- [ ] Vault secret `app.settings.service_role_key` is set
- [ ] Edge Function `notify_contact` is deployed
- [ ] Edge Function secret `RESEND_API_KEY` is set
- [ ] Extension `pg_net` is enabled
- [ ] Test INSERT triggers email successfully
- [ ] Edge Function logs show 200 status
- [ ] Owner receives lead notification email
- [ ] Visitor receives auto-reply email

---

## 🎯 DUAL MESSAGE DISPLAY STATUS

**Status:** ✅ ALREADY FIXED (Commit 9e34657)

**Verification:**
```typescript
// src/components/forms/FormContact.tsx

// Line 44: Clear error on success ✅
setError(null);
setIsSuccess(true);

// Line 53: Clear success on error ✅
setError('Service temporarily unavailable. Please try again in 5 minutes.');
setIsSuccess(false);

// Line 71: Guard error display ✅
{error && !isSuccess && (
  <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-sm">
    {error}
  </div>
)}
```

**If users still see both messages:**
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Hard reload the website
- Check Netlify deployment status (ensure latest commit is deployed)

---

## 📝 NEXT STEPS

1. **Set Vault Secret** (most critical - do this first)
2. **Test with database INSERT**
3. **Check Edge Function logs**
4. **Verify email delivery**
5. **Mark as resolved** ✅

**Expected Time to Fix:** 5 minutes
**Risk Level:** Low (fix is configuration, not code)
