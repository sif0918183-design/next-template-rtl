# Manual Bank Transfer & Receipt Verification Workflow

1. **Member Transfer**: User executes transfer via Bankak / O-Cash / Fawry.
2. **Receipt Submission**: User submits transaction reference, amount, and receipt image/PDF.
3. **Private Storage**: Receipt image is saved in private bucket `payment-receipts`.
4. **Admin Review**: Admin opens `/admin`, views signed URL image preview, and clicks Approve or Reject (with reason).
5. **Ledger & Activation**: On approval, a financial transaction ledger entry is created, membership status set to `active`, and subscription extended.
