-- supabase/migrations/0003_enable_rls.sql
--
-- Close off the Supabase anon key. The anon key is public by design (it ships
-- to browsers), and with RLS disabled PostgREST's default grants let it read
-- and write both tables directly and call `allocate_whitelist_spot` — minting
-- whitelist spots while bypassing OAuth, attestation and signature checks
-- entirely.
--
-- This app never uses the anon key: every database access goes through
-- `src/lib/supabase.ts`, which is server-only and uses the service role key.
-- `service_role` has BYPASSRLS, so enabling RLS with no policies leaves the
-- app (and the integration tests) working exactly as before, while leaving
-- `anon`/`authenticated` with no way in.
--
-- No policies are created deliberately: RLS enabled with zero policies denies
-- every row to every non-BYPASSRLS role, which is exactly the intent.

alter table whitelist_entries enable row level security;
alter table campaign_counter enable row level security;

-- RLS alone does not stop a direct RPC call, so also drop the EXECUTE grant.
--
-- The `from public` revoke is the one that actually matters. Postgres grants
-- EXECUTE on every new function to PUBLIC by default, and `anon` /
-- `authenticated` reach the function through that implicit grant rather than
-- a direct one — so revoking from `anon, authenticated` alone leaves
-- `pg_proc.proacl` as `{=X/postgres,...}` (the leading `=X` is PUBLIC) and
-- the anon key can still call the RPC. Verified against the local instance:
-- with only the role-level revoke, `POST /rest/v1/rpc/allocate_whitelist_spot`
-- with the anon key still returned HTTP 200.
--
-- `service_role` holds its own explicit grant (Supabase grants it directly),
-- which the PUBLIC revoke does not touch, so the app keeps working.
revoke execute on function allocate_whitelist_spot(text, text, text, text, boolean, boolean) from public;
revoke execute on function allocate_whitelist_spot(text, text, text, text, boolean, boolean) from anon, authenticated;
