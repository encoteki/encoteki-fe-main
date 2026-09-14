-- supabase/migrations/0004_paste_wallet_no_signature.sql
--
-- Wallet connect + sign was removed in favor of a plain pasted address (no
-- ownership proof — see docs/superpowers/specs/2026-09-01-nft-whitelist-design.md,
-- Verification Logic > Wallet). Drop the now-unused signature column and
-- redefine allocate_whitelist_spot without the p_wallet_signature parameter.
--
-- Also adds: on a duplicate x_user_id, return the EXISTING row's spot_number
-- instead of null, so the caller can show "you're already whitelisted — spot
-- #X" (see spec's Allocation section) instead of a bare rejection.

alter table whitelist_entries drop column wallet_signature;

drop function if exists allocate_whitelist_spot(text, text, text, text, boolean, boolean);

create or replace function allocate_whitelist_spot(
  p_x_user_id text,
  p_x_username text,
  p_wallet_address text,
  p_follow_attested boolean,
  p_retweet_attested boolean
) returns table (spot_number integer, rejection_reason text)
language plpgsql
as $$
declare
  v_spot integer;
  v_existing_spot integer;
begin
  -- `spot_number` is qualified here because the RETURNS TABLE output column
  -- of the same name is implicitly in scope as a PL/pgSQL variable inside
  -- this function body — an unqualified reference is ambiguous between that
  -- variable and whitelist_entries.spot_number (confirmed against the local
  -- instance: raises "column reference \"spot_number\" is ambiguous").
  select whitelist_entries.spot_number into v_existing_spot
  from whitelist_entries
  where x_user_id = p_x_user_id;

  if v_existing_spot is not null then
    return query select v_existing_spot, 'duplicate_x_account'::text;
    return;
  end if;

  if exists (select 1 from whitelist_entries where wallet_address = p_wallet_address) then
    return query select null::integer, 'duplicate_wallet'::text;
    return;
  end if;

  update campaign_counter
     set spots_used = spots_used + 1
   where id = 1 and spots_used < spots_cap
   returning spots_used into v_spot;

  if v_spot is null then
    return query select null::integer, 'whitelist_full'::text;
    return;
  end if;

  insert into whitelist_entries (
    x_user_id, x_username, wallet_address,
    follow_attested, retweet_attested, status, spot_number
  ) values (
    p_x_user_id, p_x_username, p_wallet_address,
    p_follow_attested, p_retweet_attested, 'eligible', v_spot
  );

  return query select v_spot, null::text;
end;
$$;

-- Re-apply the grant restrictions from 0003 to the new 5-parameter
-- signature — dropping and recreating the function resets its grants to
-- Postgres's default (EXECUTE to PUBLIC), reopening the exact hole 0003
-- closed. See 0003's comment for why the `from public` revoke is the one
-- that matters.
revoke execute on function allocate_whitelist_spot(text, text, text, boolean, boolean) from public;
revoke execute on function allocate_whitelist_spot(text, text, text, boolean, boolean) from anon, authenticated;
