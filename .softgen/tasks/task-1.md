---
title: Mandatory Breeder Verification System
status: in_progress
priority: urgent
type: feature
tags: [verification, breeders, supabase, rls]
created_by: agent
created_at: 2026-08-19T12:47:00Z
position: 1
---
## Notes
Create a mandatory breeder verification system. Unverified breeders cannot publish listings.

## Checklist
- [ ] Create breeder_verifications table in Supabase
- [ ] Create breeder_verification_documents table
- [ ] Add RLS policies for verification tables
- [ ] Create verification submission form/page
- [ ] Block unverified breeders from creating listings
- [ ] Show verification status in breeder dashboard
- [ ] Admin verification review interface
- [ ] Verified Breeder badge on profiles and listings
- [ ] Allow rejected breeders to re-submit
- [ ] Update listing creation API to check verification status