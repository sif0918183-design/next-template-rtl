# Deployment Guide

1. Configure Vercel Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Server Only)
2. Execute SQL Migrations:
   - Run `supabase/migrations/20260101000000_institutional_schema.sql` in Supabase SQL Editor.
   - Run `supabase/seed.sql` to populate initial configuration.
3. Build Verification:
   - Execute `npm run build`.
