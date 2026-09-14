-- supabase/migrations/0009_backfill_guaranteed_tier.sql
--
-- 0008 added whitelist_entries.tier with `default 'fcfs'`, which backfilled
-- every pre-existing row to 'fcfs' with no promotion pass. Under the rules
-- in force before 0008, a referral code had no upgrade to earn, so it could
-- legitimately already have accumulated 3, 4, or 5 uses — meaning some
-- owners already meet the new promotion rule and are simply missing the
-- tier a fresh claim would have given them. This migration runs that
-- missed promotion pass once, after the fact.
--
-- Idempotent and a no-op once applied (or on a database with no such rows):
-- re-running only ever moves a row from 'fcfs' to 'guaranteed', and the
-- `tier = 'fcfs'` predicate means an already-promoted row matches nothing
-- on a second run.
--
-- Deliberately a new migration rather than an edit to 0008: 0008 has
-- already been applied to local databases, and editing an applied
-- migration causes checksum drift instead of re-running anything.
--
-- The threshold below (3) must match `c_threshold` in 0008's
-- allocate_whitelist_spot function.
update whitelist_entries e set tier = 'guaranteed'
 where e.tier = 'fcfs'
   and exists (select 1 from referral_codes c
                where c.owner_entry_id = e.id and c.uses_count >= 3);
