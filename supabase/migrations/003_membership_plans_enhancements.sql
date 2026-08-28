-- ====================================================================
-- Migration: Membership Plans Enhancements & Grace Period Policies
-- File: supabase/migrations/003_membership_plans_enhancements.sql
-- Strictly idempotent & foreign-key ordered.
-- ====================================================================

-- 1. Add fields to membership_plans table
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS is_payment_required BOOLEAN DEFAULT TRUE;
ALTER TABLE public.membership_plans ADD COLUMN IF NOT EXISTS downgrade_months_grace_period INTEGER DEFAULT 2;

-- 2. Ensure basic plan has is_payment_required = FALSE
UPDATE public.membership_plans
SET is_payment_required = FALSE, is_default = TRUE
WHERE code = 'basic' OR name_ar LIKE '%أساسية%' OR price_sdg = 0;
