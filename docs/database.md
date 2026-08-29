# Database Schema Documentation

## Database Tables
- `profiles`: User account details and location information.
- `members`: Official membership records with sequential numbering (`RK-YYYY-XXXXXX`).
- `membership_plans`: Configurable tiers and SDG pricing managed via DB.
- `payment_methods`: Configurable bank transfer details (Bankak, O-Cash, Fawry).
- `payment_receipts`: Manual transfer upload tracking with status workflow (`pending_review`, `approved`, `rejected`).
- `financial_transactions`: Audit-ready income and expense ledger.
- `donation_campaigns`: Campaigns with targets and live approved progress sums.
- `social_requests`: Takaful social support applications.
- `leadership_members`: 26-member Leadership Body & Executive Council registry.
- `departments`: Institutional specialized departments.
- `documents`: Official Digital Archive with sequential numbering (`RK-DOC-YYYY-XXXX`).
- `audit_logs`: Operations tracking for governance and compliance.
