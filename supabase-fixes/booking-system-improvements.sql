-- ============================================================================
-- SOTSVC Booking System Database Improvements
-- Run this in Supabase SQL Editor: supabase.com → Project → SQL Editor
-- ============================================================================
-- This script improves the booking system tables:
-- - profiles, bookings, payments, reviews
-- - Adds indexes for performance
-- - Sets up RLS policies for security
-- - Adds updated_at triggers for audit trails
-- ============================================================================

-- ============================================================================
-- 1. Ensure pgcrypto extension (for gen_random_uuid)
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- 2. Create updated_at trigger function
-- ============================================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END $$;

-- ============================================================================
-- 3. Add indexes for profiles table
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_type ON public.profiles(type);

-- ============================================================================
-- 4. Add indexes for bookings table
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled_date ON public.bookings(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_bookings_active ON public.bookings(status) WHERE status IN ('pending','confirmed');

-- ============================================================================
-- 5. Create payments table if not exists
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','completed','failed','refunded')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_booking ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. Add indexes for reviews table
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_reviews_booking ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer ON public.reviews(customer_id);

-- ============================================================================
-- 7. Add updated_at triggers to all tables
-- ============================================================================
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_bookings ON public.bookings;
CREATE TRIGGER set_updated_at_bookings
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_payments ON public.payments;
CREATE TRIGGER set_updated_at_payments
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_reviews ON public.reviews;
CREATE TRIGGER set_updated_at_reviews
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================================
-- 8. RLS Policies for profiles (self-access)
-- ============================================================================
-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Users can read/update their own profile
DROP POLICY IF EXISTS "profiles_self_select" ON public.profiles;
CREATE POLICY "profiles_self_select"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_self_update" ON public.profiles;
CREATE POLICY "profiles_self_update"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 9. RLS Policies for bookings (self-access)
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;

DROP POLICY IF EXISTS "bookings_self_select" ON public.bookings;
CREATE POLICY "bookings_self_select"
ON public.bookings FOR SELECT TO authenticated
USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "bookings_self_insert" ON public.bookings;
CREATE POLICY "bookings_self_insert"
ON public.bookings FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "bookings_self_update" ON public.bookings;
CREATE POLICY "bookings_self_update"
ON public.bookings FOR UPDATE TO authenticated
USING (customer_id = auth.uid())
WITH CHECK (customer_id = auth.uid());

-- ============================================================================
-- 10. RLS Policies for payments (tied to booking ownership)
-- ============================================================================
GRANT SELECT ON public.payments TO authenticated;

DROP POLICY IF EXISTS "payments_self_select" ON public.payments;
CREATE POLICY "payments_self_select"
ON public.payments FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.bookings b
  WHERE b.id = payments.booking_id
    AND b.customer_id = auth.uid()
));

-- ============================================================================
-- 11. RLS Policies for reviews
-- ============================================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;

-- Public can view public reviews
DROP POLICY IF EXISTS "reviews_public_view" ON public.reviews;
CREATE POLICY "reviews_public_view"
ON public.reviews FOR SELECT TO anon, authenticated
USING (is_public = true);

-- Users can manage their own reviews
DROP POLICY IF EXISTS "reviews_self_select" ON public.reviews;
CREATE POLICY "reviews_self_select"
ON public.reviews FOR SELECT TO authenticated
USING (customer_id = auth.uid());

DROP POLICY IF EXISTS "reviews_self_insert" ON public.reviews;
CREATE POLICY "reviews_self_insert"
ON public.reviews FOR INSERT TO authenticated
WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "reviews_self_update" ON public.reviews;
CREATE POLICY "reviews_self_update"
ON public.reviews FOR UPDATE TO authenticated
USING (customer_id = auth.uid())
WITH CHECK (customer_id = auth.uid());

DROP POLICY IF EXISTS "reviews_self_delete" ON public.reviews;
CREATE POLICY "reviews_self_delete"
ON public.reviews FOR DELETE TO authenticated
USING (customer_id = auth.uid());

-- ============================================================================
-- VERIFICATION QUERIES (Optional - run separately to check results)
-- ============================================================================
-- SELECT indexname FROM pg_indexes WHERE tablename IN ('profiles','bookings','payments','reviews');
-- SELECT policyname, tablename, cmd FROM pg_policies WHERE tablename IN ('profiles','bookings','payments','reviews');
-- SELECT tgname, tgrelid::regclass FROM pg_trigger WHERE tgname LIKE 'set_updated_at%';
