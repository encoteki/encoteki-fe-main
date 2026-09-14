-- supabase/migrations/0007_referral_codes_bounds_check.sql
--
-- Defense-in-depth on referral_codes' core invariant: uses_count must never
-- exceed max_uses. The atomic consume-or-nothing logic in
-- allocate_whitelist_spot (0006) already enforces this in practice — this
-- constraint means a future regression there hard-aborts the transaction
-- instead of silently over-consuming an invite. See
-- docs/superpowers/specs/2026-09-04-referral-code-gate-design.md.

alter table referral_codes
  add constraint referral_codes_uses_count_bounds
  check (uses_count >= 0 and uses_count <= max_uses);
