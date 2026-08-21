# System Architecture: Al-Rikabiyyah Digital Platform

## Overview
The Al-Rikabiyyah platform is built as an enterprise-grade institutional portal for the Al-Rikabiyyah community in Sudan and abroad.

## Core Tech Stack
- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI & React**: React 19, Tailwind CSS v4, shadcn/ui
- **Database & Auth**: Supabase Postgres with Row Level Security (RLS)
- **File Storage**: Private Supabase Storage bucket (`payment-receipts`) with signed temporary URLs
- **Language**: TypeScript

## Key Operational Rules
1. **Production First**: No static mock statistics, no `admin123` hardcoded checks, no local storage fallback for core metrics.
2. **Database Single Source of Truth**: All operational counts, members, donations, and receipts are queried directly from Supabase. Empty states display `0` or explicit Arabic empty notices.
3. **Financial Integrity**: Donations and project progress calculate ONLY from receipts where `payment_status = 'approved'`.
