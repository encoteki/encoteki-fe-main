-- supabase/migrations/0006_allocate_whitelist_spot_referral.sql
--
-- Extends allocate_whitelist_spot to validate and atomically consume a
-- referral code, record the new "like" attestation, and mint a fresh code
-- for the new entry — all inside the same transaction that already
-- enforces the spot cap, so referral-code consumption is race-safe the
-- same way spots_used already is. See
-- docs/superpowers/specs/2026-09-04-referral-code-gate-design.md.

drop function if exists allocate_whitelist_spot(text, text, text, boolean, boolean);

create or replace function allocate_whitelist_spot(
  p_x_user_id text,
  p_x_username text,
  p_wallet_address text,
  p_follow_attested boolean,
  p_retweet_attested boolean,
  p_like_attested boolean,
  p_referral_code text
) returns table (
  spot_number integer,
  rejection_reason text,
  referral_code text
)
language plpgsql
as $$
declare
  v_spot integer;
  v_existing_spot integer;
  v_existing_entry_id uuid;
  v_existing_code text;
  v_referral_uses integer;
  v_referral_max integer;
  v_new_entry_id uuid;
  v_new_code text;
  v_charset text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- excludes 0/O, 1/I
  v_attempt integer := 0;
begin
  select whitelist_entries.id, whitelist_entries.spot_number
    into v_existing_entry_id, v_existing_spot
  from whitelist_entries
  where x_user_id = p_x_user_id;

  if v_existing_entry_id is not null then
    select referral_codes.code into v_existing_code
    from referral_codes
    where owner_entry_id = v_existing_entry_id;

    return query select v_existing_spot, 'duplicate_x_account'::text, v_existing_code;
    return;
  end if;

  if exists (select 1 from whitelist_entries where wallet_address = p_wallet_address) then
    return query select null::integer, 'duplicate_wallet'::text, null::text;
    return;
  end if;

  -- Lock the referral code's row for the rest of this transaction so a
  -- second concurrent claimant using the same code blocks here and
  -- re-reads the post-increment uses_count once this transaction commits,
  -- rather than racing on a stale value — the same technique
  -- campaign_counter's UPDATE below already relies on.
  select referral_codes.uses_count, referral_codes.max_uses
    into v_referral_uses, v_referral_max
  from referral_codes
  where code = p_referral_code
  for update;

  if v_referral_uses is null then
    return query select null::integer, 'referral_code_invalid'::text, null::text;
    return;
  end if;

  if v_referral_uses >= v_referral_max then
    return query select null::integer, 'referral_code_exhausted'::text, null::text;
    return;
  end if;

  update campaign_counter
     set spots_used = spots_used + 1
   where id = 1 and spots_used < spots_cap
   returning spots_used into v_spot;

  if v_spot is null then
    return query select null::integer, 'whitelist_full'::text, null::text;
    return;
  end if;

  update referral_codes
     set uses_count = uses_count + 1
   where code = p_referral_code;

  insert into whitelist_entries (
    x_user_id, x_username, wallet_address,
    follow_attested, retweet_attested, like_attested,
    status, spot_number, used_referral_code
  ) values (
    p_x_user_id, p_x_username, p_wallet_address,
    p_follow_attested, p_retweet_attested, p_like_attested,
    'eligible', v_spot, p_referral_code
  )
  returning id into v_new_entry_id;

  -- Mint a fresh code for the new entry. The ~32-character unambiguous
  -- alphabet at 6 characters gives ~1 billion possible codes, so a
  -- collision on insert is a formality to handle, not a real-world risk —
  -- retry a bounded number of times rather than looping forever.
  loop
    v_new_code := (
      select string_agg(
        substr(v_charset, floor(random() * length(v_charset))::integer + 1, 1),
        ''
      )
      from generate_series(1, 6)
    );

    begin
      insert into referral_codes (code, owner_entry_id, max_uses, uses_count)
      values (v_new_code, v_new_entry_id, 5, 0);
      exit;
    exception when unique_violation then
      v_attempt := v_attempt + 1;
      if v_attempt >= 10 then
        raise exception 'could not generate a unique referral code after % attempts', v_attempt;
      end if;
    end;
  end loop;

  return query select v_spot, null::text, v_new_code;
end;
$$;

-- Re-apply the grant restrictions from 0003 to the new 7-parameter
-- signature — dropping and recreating the function resets its grants to
-- Postgres's default (EXECUTE to PUBLIC), reopening the exact hole 0003
-- closed. See 0003's comment for why the `from public` revoke is the one
-- that matters.
revoke execute on function allocate_whitelist_spot(text, text, text, boolean, boolean, boolean, text) from public;
revoke execute on function allocate_whitelist_spot(text, text, text, boolean, boolean, boolean, text) from anon, authenticated;
