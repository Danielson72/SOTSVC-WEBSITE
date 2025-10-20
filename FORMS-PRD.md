# 📋 SOTSVC Universal Contact Forms – Project Requirements Document

**Project Owner:** Daniel Alvarez  
**Project Type:** Backend + Frontend Integration  
**Status:** 🟡 In Progress  
**Last Updated:** October 20, 2025  
**Version:** 1.0

---

## 🎯 Executive Summary

Replace GoHighLevel iframe forms across SOTSVC properties with a unified Supabase-powered contact form system that:
- Captures lead data in a centralized database
- Sends instant email notifications via Resend
- Provides auto-reply confirmations to visitors
- Scales across multiple brand properties

**Business Impact:**
- ✅ Own our lead data (no vendor lock-in)
- ✅ Faster page loads (no iframe overhead)
- ✅ Better UX (native form styling)
- ✅ Lower costs (Supabase free tier + Resend)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                         │
│  Visitor fills form on sotsvc.com/contact                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (Next.js)                          │
│  FormContact.tsx component                                  │
│  - Client-side validation                                   │
│  - Supabase client insert                                   │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE DATABASE                              │
│  Table: public.contact_requests                             │
│  - Row Level Security (RLS)                                 │
│  - Anonymous inserts allowed                                │
│  - Service role can read all                                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼ (Database Trigger)
┌─────────────────────────────────────────────────────────────┐
│              EDGE FUNCTION                                  │
│  notify_contact (Deno/TypeScript)                           │
│  - Receives new row data                                    │
│  - Formats two emails                                       │
│  - Calls Resend API                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────┐
│                 RESEND (Email Service)                      │
│  Owner Email  → dalvarez@sotsvc.com                         │
│  Visitor Reply → {submitted email}                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Repository & Infrastructure

### Primary Deployment (Phase 1)
| Component | Value |
|-----------|-------|
| **Repository** | [SOTSVC-WEBSITE](https://github.com/Danielson72/SOTSVC-WEBSITE) |
| **Local Path** | `/Users/danielalvarez/Development/My web projects and apps/NET POWER/WEBSITE/SOTSVC-WEBSITE` |
| **Framework** | Next.js 14+ |
| **Database** | Supabase (Project: `jvznxszxlqtvizpjokav`) |
| **Email Provider** | Resend |
| **Hosting** | Vercel |
| **Domain** | https://sotsvc.com |

### Future Deployments (Phase 2-5)
| Site | Repository | Supabase Project | Domain |
|------|-----------|------------------|--------|
| TrustedCleaningExpert | TBD | `tce-contact` | https://trustedcleaningexpert.com |
| JM Home Decor | TBD | `jmhomedecor-contact` | https://jmhomedecor.com |
| Boss of Clean | TBD | `bossofclean-contact` | https://bossofclean.com |
| AI Command Lab | AI-Command-Lab | `universal-contact` | Multi-domain router |

---

## 👥 User Stories

### As a Website Visitor
- **I want to** contact SOTSVC easily
- **So that** I can request cleaning services
- **Acceptance Criteria:**
  - Form is visible on home page and /contact page
  - Form validates my email before submission
  - I receive instant confirmation email after submitting
  - Form doesn't reload the page (smooth UX)

### As Daniel (Business Owner)
- **I want to** receive instant email notifications for new leads
- **So that** I can respond quickly and close more sales
- **Acceptance Criteria:**
  - Email arrives within 5 seconds of submission
  - Email contains all form fields (name, email, phone, message)
  - Email indicates which form variant was used
  - Email is formatted professionally

### As a Developer
- **I want to** reuse this form system across multiple sites
- **So that** I don't rebuild forms from scratch each time
- **Acceptance Criteria:**
  - Schema is documented and reusable
  - Edge Function is parameterized
  - Frontend component accepts props for customization
  - Deployment process is documented

---

## 🛠️ Technical Specifications

### 1. Database Schema

**Table:** `public.contact_requests`

```sql
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

-- Indexes
create index idx_contact_requests_created_at 
  on public.contact_requests (created_at desc);

create index idx_contact_requests_source_site 
  on public.contact_requests (source_site);
```

**Row Level Security:**
```sql
-- Enable RLS
alter table public.contact_requests enable row level security;

-- Allow anonymous inserts (form submissions)
create policy "Allow anonymous form submissions"
  on public.contact_requests 
  for insert 
  to anon 
  with check (true);

-- Service role can read all (dashboard, analytics)
create policy "Service role can read all"
  on public.contact_requests 
  for select 
  to service_role 
  using (true);

-- Authenticated users can read own submissions
create policy "Users can read own submissions"
  on public.contact_requests 
  for select 
  to authenticated 
  using (email = auth.jwt() ->> 'email');
```

---

### 2. Edge Function

**Function Name:** `notify_contact`  
**Language:** TypeScript (Deno)  
**Trigger:** Database trigger on `contact_requests` INSERT

**Environment Variables:**
- `RESEND_API_KEY` (stored in Supabase secrets)

**Email Logic:**
1. Receives new row data via trigger
2. Formats owner notification email (HTML)
3. Formats visitor auto-reply email (HTML)
4. Sends both emails via Resend API
5. Logs success/failure to console
6. Returns 200 OK or 500 error

**Error Handling:**
- Missing RESEND_API_KEY → Log error, return 500
- Invalid record data → Return 400 Bad Request
- Resend API failure → Log error, don't crash

---

### 3. Frontend Component

**Component:** `FormContact.tsx`  
**Location:** `/components/FormContact.tsx`

**Props:**
```typescript
interface FormContactProps {
  formType?: 'embedded' | 'popup' | 'standalone';
}
```

**Features:**
- Client-side validation (HTML5 + custom)
- Loading state during submission
- Success message display
- Error handling with user-friendly messages
- Responsive design (mobile-first)
- Accessibility (ARIA labels, keyboard navigation)

**Usage Examples:**
```tsx
// Embedded (inline on page)
<FormContact formType="embedded" />

// Popup (in modal)
<FormContactPopup>
  <FormContact formType="popup" />
</FormContactPopup>

// Standalone (full page)
<FormContact formType="standalone" />
```

---

### 4. Email Templates

**Owner Notification Email**

```
From: Forms <forms@sotsvc.com>
To: dalvarez@sotsvc.com
Subject: 🚀 New SOTSVC Lead – {full_name}

Content:
- New Lead header (gradient background)
- Name, Email (clickable), Phone, Message
- Form Type indicator
- Source Site indicator
- Professional HTML styling
```

**Visitor Auto-Reply Email**

```
From: Sonz of Thunder Services <noreply@sotsvc.com>
To: {visitor_email}
Subject: We received your request ✨

Content:
- Personalized greeting (first name)
- Confirmation of receipt
- 24-hour response time promise
- Phone number: (407) 461-6039
- Faith-based tagline
- Professional HTML styling
```

---

## 🔒 Security & Compliance

### Data Protection
- ✅ **RLS Enabled:** Anonymous users can only INSERT, not SELECT
- ✅ **Email Validation:** Regex check prevents invalid emails
- ✅ **No PII in Logs:** Edge Function logs only names, not full records
- ✅ **Secrets Management:** API keys in Supabase vault, never in code

### Rate Limiting
- **Database:** Supabase free tier limits (50,000 rows/month)
- **Edge Function:** 500,000 invocations/month
- **Resend:** 100 emails/day (free), 50,000/month (paid)

**Recommendation:** Add Cloudflare rate limiting (10 submissions/minute per IP)

### GDPR Compliance
- Store only necessary data (name, email, phone, message)
- Provide data deletion on request
- Include privacy policy link on form
- Auto-delete submissions older than 2 years (future enhancement)

---

## 🧪 Testing Protocol

### Integration Tests

**Test 1: Database Insert**
```sql
INSERT INTO public.contact_requests 
  (full_name, email, phone, message, form_type)
VALUES 
  ('Test User', 'test@example.com', '(407) 123-4567', 'Testing', 'embedded');
```
**Expected:**
- ✅ Row inserted successfully
- ✅ RLS allows insert (anon role)
- ✅ Constraints pass (email format valid)

**Test 2: Trigger Invocation**
```bash
# Check function logs after insert
supabase functions logs notify_contact --tail
```
**Expected:**
- ✅ Function invoked automatically
- ✅ Logs show "Processing: Test User"
- ✅ Logs show "✅ Emails sent"

**Test 3: Email Delivery**
**Expected:**
- ✅ Owner email arrives at dalvarez@sotsvc.com (< 5 seconds)
- ✅ Auto-reply arrives at test@example.com (< 5 seconds)
- ✅ Both emails formatted correctly (HTML renders)

**Test 4: Frontend Submission**
1. Deploy to Vercel preview
2. Navigate to /contact
3. Fill out form with valid data
4. Submit

**Expected:**
- ✅ Success message displays
- ✅ Form resets
- ✅ Database row created
- ✅ Emails sent

**Test 5: Error Scenarios**
- Submit without required fields → Browser validation blocks
- Submit invalid email → Browser validation blocks
- Disable Edge Function → Error message shown
- Invalid Resend key → Edge Function logs error

---

## 🚀 Deployment Workflow

### Phase 1: Backend Setup
```bash
1. git checkout -b feature/contact-forms-backend
2. supabase migration new contact_requests
3. supabase db reset && supabase db push
4. supabase secrets set RESEND_API_KEY="..."
5. supabase functions new notify_contact
6. supabase functions deploy notify_contact --no-verify-jwt
7. Create trigger (SQL)
8. Smoke test (manual INSERT)
9. git commit && git push
10. Create PR → main
```

### Phase 2: Frontend Integration
```bash
1. git checkout -b feature/contact-forms-frontend
2. npm install @supabase/supabase-js
3. Create FormContact.tsx component
4. Update home page (embedded form)
5. Update /contact page (standalone form)
6. Add .env.local with Supabase credentials
7. npm run build (verify no errors)
8. git commit && git push
9. Create PR → main
```

### Phase 3: Production Deploy
```bash
1. Review & merge backend PR
2. Review & merge frontend PR
3. Vercel auto-deploys main branch
4. Verify deployment: https://sotsvc.com
5. Test live form submission
6. Monitor Supabase logs for 24 hours
7. Remove old GHL forms
```

### Phase 4: Monitoring
- Check Supabase table for new submissions daily
- Monitor Resend dashboard for delivery rates
- Review Edge Function logs for errors
- Track conversion rate (form → phone call)

---

## 📅 Phase Rollout Plan

### Phase 1: SOTSVC.com ✅
**Timeline:** Week of October 20, 2025  
**Scope:**
- ✅ Backend (database, function, trigger)
- ✅ Frontend (FormContact component)
- ✅ Production deployment
- ✅ Live testing

**Success Criteria:**
- 100% form submissions reach database
- 100% email delivery (< 5 seconds)
- 0 console errors
- Business owner approval

---

### Phase 2: TrustedCleaningExpert.com
**Timeline:** Week of October 27, 2025  
**Scope:**
- Clone SOTSVC backend to new Supabase project
- Update `source_site` default to 'TrustedCleaningExpert.com'
- Create FormContact component in TCE repo
- Update email templates (TCE branding)
- Deploy to production

**Differences from SOTSVC:**
- Email sender: `forms@trustedcleaningexpert.com`
- Phone number: TBD
- Branding colors: TBD

---

### Phase 3: JMHomeDecor.com
**Timeline:** Week of November 3, 2025  
**Scope:**
- Clone SOTSVC backend to new Supabase project
- Update `source_site` default to 'JMHomeDecor.com'
- Create FormContact component in JM repo
- Home decor specific form fields (add: project_type)
- Deploy to production

**Differences from SOTSVC:**
- Additional field: "Project Type" (Kitchen, Bathroom, Full Home, etc.)
- Email sender: `forms@jmhomedecor.com`
- Phone number: TBD

---

### Phase 4: BossOfClean.com
**Timeline:** Week of November 10, 2025  
**Scope:**
- Clone SOTSVC backend to new Supabase project
- Update `source_site` default to 'BossOfClean.com'
- Create FormContact component in BOC repo
- Deploy to production

---

### Phase 5: AI-Command-Lab (Universal System)
**Timeline:** December 2025  
**Scope:**
- Create universal Supabase project
- Multi-tenant schema (add `tenant_id` column)
- Route forms to appropriate handlers
- Centralized analytics dashboard
- API for external integrations

**Advanced Features:**
- Webhook notifications
- CRM integration (GoHighLevel, HubSpot)
- A/B testing framework
- Spam detection (Akismet integration)
- Lead scoring algorithm

---

## 📊 Success Metrics

### Technical KPIs
| Metric | Target | Measurement |
|--------|--------|-------------|
| Form submission success rate | 99.5%+ | Supabase logs |
| Email delivery rate | 100% (valid emails) | Resend dashboard |
| Email delivery time | < 5 seconds | Edge Function logs |
| Page load time impact | < 100ms slower | Lighthouse |
| Uptime | 99.9% | Uptime Robot |

### Business KPIs
| Metric | Target | Measurement |
|--------|--------|-------------|
| Lead response time | < 4 hours | Manual tracking |
| Form → Call conversion | 40%+ | CRM data |
| Cost per lead | < $2 | Monthly costs / leads |
| Customer satisfaction | 4.5/5+ | Post-service survey |

---

## 🔗 Reference Links

### Repositories
- SOTSVC Website: https://github.com/Danielson72/SOTSVC-WEBSITE
- Boss of Clean (archive): https://github.com/Danielson72/Boss-of_clean-2
- AI Command Lab: https://github.com/Danielson72/AI-Command-Lab-

### Infrastructure
- Supabase Dashboard: https://supabase.com/dashboard/project/jvznxszxlqtvizpjokav
- Resend Dashboard: https://resend.com/emails
- Vercel Dashboard: https://vercel.com/danielson72

### Documentation
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- Resend API: https://resend.com/docs/api-reference/emails/send-email
- Next.js Forms: https://nextjs.org/docs/app/building-your-application/data-fetching/forms

---

## 👥 Team & Roles

| Role | Responsibility | Agent/Person |
|------|---------------|--------------|
| **Project Owner** | Final approval, business decisions | Daniel Alvarez |
| **Tech Lead** | Architecture, coordination | Claude Code |
| **Frontend Developer** | React components, UX | Manus AI |
| **Backend Developer** | Supabase, Edge Functions | Will (ChatGPT) |
| **Security Auditor** | Code review, secrets management | Claude Sonnet |
| **QA Tester** | Integration testing, smoke tests | Claude Code |
| **DevOps Engineer** | Deployment, monitoring | Claude Code |

---

## 🙏 Guiding Principles

**Scripture Foundation:**
> "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters." – Colossians 3:23

**Core Values:**
1. **Excellence** – Build as if building for God
2. **Ownership** – Own our data, own our infrastructure
3. **Simplicity** – Fewer moving parts, easier maintenance
4. **Scalability** – Design once, deploy everywhere
5. **Security** – Protect customer data as sacred trust

---

## 📝 Change Log

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-20 | Initial PRD created | Claude Sonnet |

---

**End of Document**

*This is a living document. Update as project evolves.*
