-- supabase/migrations/0005_referral_codes.sql
--
-- Referral-gate mechanic: every whitelist claim must consume a valid,
-- not-yet-exhausted referral code, and successfully claiming mints a fresh
-- code (max 5 uses) for the claimant to share. See
-- docs/superpowers/specs/2026-09-04-referral-code-gate-design.md.
--
-- `owner_entry_id` uses ON DELETE SET NULL rather than CASCADE: if a
-- whitelist_entries row were ever removed, the code it minted shouldn't
-- vanish along with everyone who used it to get in. It's also what makes
-- wholesale test cleanup safe — deleting every whitelist_entries row never
-- fails on this FK, it just orphans the codes, which the next delete then
-- clears.

create table referral_codes (
  code text primary key,
  owner_entry_id uuid unique references whitelist_entries(id) on delete set null,
  max_uses integer not null default 5,
  uses_count integer not null default 0,
  created_at timestamptz not null default now()
);

-- Same treatment as whitelist_entries/campaign_counter in
-- 0003_enable_rls.sql: RLS enabled with zero policies denies every row to
-- every non-BYPASSRLS role. This app only ever talks to Postgres through
-- the service-role client (src/lib/supabase.ts), which bypasses RLS, so
-- this has no effect on the app itself — it only closes off the anon key
-- from reading/writing referral_codes directly via PostgREST.
alter table referral_codes enable row level security;

-- The table is empty at this point (no whitelist_entries rows exist yet —
-- this app is pre-launch), so both columns can be added NOT NULL directly
-- with no backfill.
alter table whitelist_entries
  add column used_referral_code text not null references referral_codes(code),
  add column like_attested boolean not null;
