-- ====================================================================
-- Production Institutional Platform Schema Migration for Al-Rikabiyyah Platform
-- File: supabase/migrations/001_initial_institutional_schema.sql
-- Strictly ordered by foreign-key dependencies & fully idempotent.
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. SAFE ENUMS CREATION
-- --------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status_enum') THEN
    CREATE TYPE membership_status_enum AS ENUM ('pending', 'under_review', 'active', 'suspended', 'expired', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
    CREATE TYPE payment_status_enum AS ENUM ('submitted', 'pending_review', 'approved', 'rejected', 'voided');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'social_request_status_enum') THEN
    CREATE TYPE social_request_status_enum AS ENUM ('submitted', 'under_review', 'approved', 'disbursed', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lineage_verification_status_enum') THEN
    CREATE TYPE lineage_verification_status_enum AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'publication_status_enum') THEN
    CREATE TYPE publication_status_enum AS ENUM ('draft', 'review', 'published', 'archived');
  END IF;
END $$;

-- --------------------------------------------------------------------
-- 2. PROFILES, ROLES & PERMISSIONS (AUTH & SECURITY)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  state TEXT,
  locality TEXT,
  city TEXT,
  gender TEXT,
  birth_year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role_id)
);

-- --------------------------------------------------------------------
-- 3. REGIONS, LOCALITIES, FAMILIES & BRANCHES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.localities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  region_id UUID REFERENCES public.regions(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  historical_origin TEXT,
  main_locality TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  name_ar TEXT NOT NULL,
  locality TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. DEPARTMENTS & ORGANIZATIONS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  vision TEXT,
  mission TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. MEMBERSHIP PLANS & MEMBERS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  price_sdg NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  duration_months INTEGER NOT NULL DEFAULT 12,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS membership_seq START WITH 1;

CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  membership_number TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  national_id TEXT,
  birth_year INTEGER,
  gender TEXT,
  state TEXT NOT NULL,
  locality TEXT NOT NULL,
  city TEXT,
  family_id UUID REFERENCES public.families(id) ON DELETE SET NULL,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  occupation TEXT,
  education TEXT,
  employer TEXT,
  plan_id UUID REFERENCES public.membership_plans(id),
  status membership_status_enum DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.membership_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.membership_plans(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. PAYMENT METHODS & PAYMENT RECEIPTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  provider TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  iban TEXT,
  phone_number TEXT,
  instructions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  payment_method_id UUID REFERENCES public.payment_methods(id),
  amount NUMERIC(12, 2) NOT NULL,
  payment_type TEXT NOT NULL,
  transaction_reference TEXT UNIQUE NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  receipt_path TEXT NOT NULL,
  notes TEXT,
  status payment_status_enum DEFAULT 'pending_review',
  rejection_reason TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. FINANCIAL ACCOUNTS, TRANSACTIONS, EXPENSES & BUDGETS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.financial_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  balance NUMERIC(15, 2) DEFAULT 0.00,
  currency TEXT DEFAULT 'SDG',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id UUID REFERENCES public.payment_receipts(id) ON DELETE SET NULL,
  account_id UUID REFERENCES public.financial_accounts(id),
  transaction_type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  currency TEXT DEFAULT 'SDG',
  reference_number TEXT UNIQUE NOT NULL,
  description TEXT,
  created_by UUID REFERENCES public.profiles(id),
  transaction_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  approved_by UUID REFERENCES public.profiles(id),
  expense_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year INTEGER NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE CASCADE,
  allocated_amount NUMERIC(15, 2) NOT NULL,
  spent_amount NUMERIC(15, 2) DEFAULT 0.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.financial_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  report_period TEXT NOT NULL,
  summary TEXT,
  file_path TEXT,
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. DONATIONS, CAMPAIGNS & PROJECTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.donation_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  category TEXT NOT NULL,
  target_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  current_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.donation_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  campaign_id UUID REFERENCES public.donation_campaigns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_amount NUMERIC(12, 2) NOT NULL,
  current_amount NUMERIC(12, 2) DEFAULT 0.00,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  receipt_id UUID REFERENCES public.payment_receipts(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES public.donation_campaigns(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.donation_projects(id) ON DELETE SET NULL,
  donor_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  donor_name TEXT,
  donor_phone TEXT,
  amount NUMERIC(12, 2) NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  status payment_status_enum DEFAULT 'pending_review',
  donation_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. SOCIAL SUPPORT & TAKAFUL SYSTEM
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_number TEXT UNIQUE NOT NULL,
  applicant_name TEXT NOT NULL,
  applicant_phone TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  required_amount NUMERIC(12, 2) NOT NULL,
  approved_amount NUMERIC(12, 2) DEFAULT 0.00,
  status social_request_status_enum DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  amount_requested NUMERIC(12, 2) NOT NULL,
  document_paths JSONB DEFAULT '[]'::jsonb,
  status social_request_status_enum DEFAULT 'submitted',
  review_notes TEXT,
  reviewed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.social_disbursements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID REFERENCES public.social_requests(id) ON DELETE CASCADE,
  amount NUMERIC(12, 2) NOT NULL,
  disbursed_at DATE DEFAULT CURRENT_DATE,
  disbursed_by UUID REFERENCES public.profiles(id),
  transaction_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 10. GENEALOGY & LINEAGE SYSTEM
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.lineage_nodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES public.families(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
  parent_id UUID REFERENCES public.lineage_nodes(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  title_or_nickname TEXT,
  generation_level INTEGER DEFAULT 1,
  birth_year INTEGER,
  death_year INTEGER,
  biography TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lineage_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID REFERENCES public.lineage_nodes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lineage_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id UUID REFERENCES public.lineage_nodes(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES public.profiles(id),
  status lineage_verification_status_enum DEFAULT 'submitted',
  verifier_notes TEXT,
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 11. BUSINESS NETWORK, SPONSORS & JOBS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.business_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  position TEXT NOT NULL,
  services_offered TEXT,
  willing_to_sponsor BOOLEAN DEFAULT FALSE,
  willing_to_provide_jobs BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website TEXT,
  phone TEXT,
  email TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  industry TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  contact_email TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  resume_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 12. GOVERNANCE & LEADERSHIP
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leadership_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  state TEXT,
  bio TEXT,
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_leadership_body BOOLEAN DEFAULT FALSE,
  is_executive_council BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  appointed_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 13. CONTENT MANAGEMENT & DIGITAL ARCHIVE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'عام',
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id),
  status publication_status_enum DEFAULT 'published',
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.official_statements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  statement_number TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
  pdf_url TEXT,
  issued_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS doc_archive_seq START WITH 1;

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  archive_number TEXT UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  media_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  tag TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  category TEXT,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 14. NOTIFICATIONS & AUDIT LOGS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  link_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  before_state JSONB,
  after_state JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 15. FUNCTIONS & TRIGGERS
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_membership_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.membership_number IS NULL AND NEW.status = 'active' THEN
    NEW.membership_number := 'RK-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('membership_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_membership_number ON public.members;
CREATE TRIGGER trg_membership_number
BEFORE INSERT OR UPDATE ON public.members
FOR EACH ROW EXECUTE FUNCTION generate_membership_number();

CREATE OR REPLACE FUNCTION generate_document_archive_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.archive_number IS NULL THEN
    NEW.archive_number := 'RK-DOC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(NEXTVAL('doc_archive_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_doc_archive_number ON public.documents;
CREATE TRIGGER trg_doc_archive_number
BEFORE INSERT ON public.documents
FOR EACH ROW EXECUTE FUNCTION generate_document_archive_number();

-- --------------------------------------------------------------------
-- 16. IDEMPOTENT ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Helper to safely recreate policy
DO $$
BEGIN
  -- Plans policy
  DROP POLICY IF EXISTS "Public can read membership plans" ON public.membership_plans;
  CREATE POLICY "Public can read membership plans" ON public.membership_plans FOR SELECT USING (is_active = TRUE);

  -- Payment methods policy
  DROP POLICY IF EXISTS "Public can read active payment methods" ON public.payment_methods;
  CREATE POLICY "Public can read active payment methods" ON public.payment_methods FOR SELECT USING (is_active = TRUE);

  -- Campaigns policy
  DROP POLICY IF EXISTS "Public can read active campaigns" ON public.donation_campaigns;
  CREATE POLICY "Public can read active campaigns" ON public.donation_campaigns FOR SELECT USING (is_active = TRUE);

  -- News policy
  DROP POLICY IF EXISTS "Public can read published news" ON public.news;
  CREATE POLICY "Public can read published news" ON public.news FOR SELECT USING (status = 'published');

  -- Leadership policy
  DROP POLICY IF EXISTS "Public can read active leadership" ON public.leadership_members;
  CREATE POLICY "Public can read active leadership" ON public.leadership_members FOR SELECT USING (is_active = TRUE);

  -- Departments policy
  DROP POLICY IF EXISTS "Public can read departments" ON public.departments;
  CREATE POLICY "Public can read departments" ON public.departments FOR SELECT USING (is_active = TRUE);

  -- Profile policies
  DROP POLICY IF EXISTS "Users read own profile" ON public.profiles;
  CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
  CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

  -- Member policy
  DROP POLICY IF EXISTS "Users read own member record" ON public.members;
  CREATE POLICY "Users read own member record" ON public.members FOR SELECT USING (auth.uid() = user_id);

  -- Receipt policies
  DROP POLICY IF EXISTS "Users view own receipts" ON public.payment_receipts;
  CREATE POLICY "Users view own receipts" ON public.payment_receipts FOR SELECT USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "Users insert own receipts" ON public.payment_receipts;
  CREATE POLICY "Users insert own receipts" ON public.payment_receipts FOR INSERT WITH CHECK (auth.uid() = user_id);

  -- Service role full access policies
  DROP POLICY IF EXISTS "Service role full access profiles" ON public.profiles;
  CREATE POLICY "Service role full access profiles" ON public.profiles FOR ALL USING (auth.jwt()->>'role' = 'service_role');

  DROP POLICY IF EXISTS "Service role full access members" ON public.members;
  CREATE POLICY "Service role full access members" ON public.members FOR ALL USING (auth.jwt()->>'role' = 'service_role');

  DROP POLICY IF EXISTS "Service role full access receipts" ON public.payment_receipts;
  CREATE POLICY "Service role full access receipts" ON public.payment_receipts FOR ALL USING (auth.jwt()->>'role' = 'service_role');

  DROP POLICY IF EXISTS "Service role full access audit" ON public.audit_logs;
  CREATE POLICY "Service role full access audit" ON public.audit_logs FOR ALL USING (auth.jwt()->>'role' = 'service_role');
END $$;
