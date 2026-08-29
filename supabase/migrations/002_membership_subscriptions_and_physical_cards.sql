-- ====================================================================
-- Migration: Membership Subscriptions & Physical Card Requests System
-- File: supabase/migrations/002_membership_subscriptions_and_physical_cards.sql
-- Strictly idempotent & foreign-key ordered.
-- ====================================================================

-- 1. Profile Completion Fields
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_place TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country_residence TEXT DEFAULT 'السودان';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS specialization TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profession TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS marital_status TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS family_members_count INTEGER DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completion_pct INTEGER DEFAULT 40;

-- 2. Membership Plans Enhancement
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS is_recommended BOOLEAN DEFAULT FALSE;
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 1;

-- 3. Monthly Membership Goals
CREATE TABLE IF NOT EXISTS public.membership_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_month DATE NOT NULL UNIQUE, -- e.g., '2026-03-01'
  target_members_count INTEGER NOT NULL DEFAULT 1000,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Physical Card Requests Table
CREATE SEQUENCE IF NOT EXISTS physical_card_req_seq START WITH 1;

CREATE TABLE IF NOT EXISTS public.physical_card_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_number TEXT UNIQUE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  fee_sdg NUMERIC(12, 2) NOT NULL DEFAULT 50000.00,
  payment_receipt_id UUID REFERENCES public.payment_receipts(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending_review', -- 'pending_review', 'payment_pending', 'approved_for_printing', 'in_printing', 'ready_for_pickup', 'delivered', 'rejected'
  rejection_reason TEXT,
  delivery_notes TEXT,
  delivery_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for Physical Card Request Numbers: RK-CARD-YYYY-XXXX
CREATE OR REPLACE FUNCTION generate_physical_card_request_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.request_number IS NULL THEN
    NEW.request_number := 'RK-CARD-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('physical_card_req_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_physical_card_request_number ON public.physical_card_requests;
CREATE TRIGGER trg_physical_card_request_number
BEFORE INSERT ON public.physical_card_requests
FOR EACH ROW EXECUTE FUNCTION generate_physical_card_request_number();

-- 5. RLS Policies for Physical Card Requests
ALTER TABLE public.physical_card_requests ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Users view own card requests" ON public.physical_card_requests;
  CREATE POLICY "Users view own card requests" ON public.physical_card_requests FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users insert own card requests" ON public.physical_card_requests;
  CREATE POLICY "Users insert own card requests" ON public.physical_card_requests FOR INSERT WITH CHECK (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Service role full access physical cards" ON public.physical_card_requests;
  CREATE POLICY "Service role full access physical cards" ON public.physical_card_requests FOR ALL USING (auth.jwt()->>'role' = 'service_role');
END $$;
