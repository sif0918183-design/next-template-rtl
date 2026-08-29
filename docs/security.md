# Security Architecture & RLS

## Secret Key Protection
- `SUPABASE_SERVICE_ROLE_KEY` is restricted strictly to server-only code (`lib/supabase/admin.ts` and Server Actions).
- It is NEVER exposed to Next.js `NEXT_PUBLIC_*` environment variables or client bundles.

## Row Level Security (RLS)
- Enabled across all sensitive tables: `profiles`, `members`, `payment_receipts`, `social_requests`, `audit_logs`.
- Members can only view their own membership and payment details.
- Public read access is granted only to non-sensitive catalogs (`membership_plans`, `payment_methods`, `leadership_members`, `published news`).
