-- supabase/migrations/0011_whitelist_entries_character_slug.sql
--
-- Records which quiz character led to a claimant's whitelist spot, so the
-- app can composite that character's card art with their own referral code
-- into a downloadable image. Nullable: a visitor who never took the quiz
-- can still complete the whitelist flow normally, just without this.
--
-- Set exactly once, at the moment allocate_whitelist_spot successfully
-- inserts a NEW whitelist_entries row for a given x_user_id — the function
-- already never reaches that insert a second time for the same user (every
-- later call for that user hits the "existing entry" branch near the top
-- and returns early), so this is the entire mechanism for "the character is
-- locked in on first successful claim, and a later quiz retake never
-- changes it." No separate locking logic exists anywhere else.
--
-- This repo (encoteki-fe-main) has no prior migrations of its own —
-- 0001-0010 live only in the sibling repo (encoteki-whitelist-app), applied
-- to the same live Supabase project, and stay there as history. This is the
-- first migration to live in encoteki-fe-main; the numbering continues from
-- 0010 because both directories describe the same database's history, just
-- split across two repos at this exact point.
--
-- Reproduces allocate_whitelist_spot's current body verbatim (as of
-- encoteki-whitelist-app's 0010_handle_concurrent_duplicate_claim.sql) and
-- changes only: the new p_character_slug parameter, and adding
-- character_slug to the one INSERT statement.

alter table whitelist_entries add column if not exists character_slug text;

drop function if exists allocate_whitelist_spot(text, text, text, boolean, boolean, boolean, text);

create or replace function allocate_whitelist_spot(
  p_x_user_id text,
  p_x_username text,
  p_wallet_address text,
  p_follow_attested boolean,
  p_retweet_attested boolean,
  p_like_attested boolean,
  p_referral_code text,
  p_character_slug text default null
) returns table (
  spot_number integer,
  rejection_reason text,
  referral_code text,
  tier text
)
language plpgsql
as $$
declare
  v_spot integer;
  v_existing_spot integer;
  v_existing_entry_id uuid;
  v_existing_code text;
  v_existing_tier text;
  v_code text;
  v_owner_entry_id uuid;
  v_uses integer;
  v_new_entry_id uuid;
  v_new_code text;
  v_charset text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- excludes 0/O, 1/I
  v_attempt integer := 0;
  -- Keep in sync with `guaranteedThreshold` in src/lib/whitelist/campaign-config.ts.
  -- Deliberately not a column: a cap may need retuning after launch, but
  -- changing the threshold mid-campaign would change the rules for people
  -- who already played by them.
  c_threshold constant integer := 3;
begin
  -- Every whitelist_entries column named here is qualified because the
  -- RETURNS TABLE output columns (spot_number, referral_code, tier) are
  -- implicitly in scope as PL/pgSQL variables inside this body. An
  -- unqualified reference is ambiguous and raises at runtime.
  select whitelist_entries.id,
         whitelist_entries.spot_number,
         whitelist_entries.tier
    into v_existing_entry_id, v_existing_spot, v_existing_tier
  from whitelist_entries
  where x_user_id = p_x_user_id;

  if v_existing_entry_id is not null then
    select referral_codes.code into v_existing_code
    from referral_codes
    where owner_entry_id = v_existing_entry_id;

    return query select v_existing_spot,
                        'duplicate_x_account'::text,
                        v_existing_code,
                        v_existing_tier;
    return;
  end if;

  if exists (select 1 from whitelist_entries where wallet_address = p_wallet_address) then
    return query select null::integer, 'duplicate_wallet'::text, null::text, null::text;
    return;
  end if;

  -- Blank and whitespace-only both mean "I don't have a referral code".
  v_code := nullif(btrim(coalesce(p_referral_code, '')), '');

  -- Codes are never deleted (owner_entry_id is ON DELETE SET NULL), so a
  -- code that exists here still exists at the increment below. No lock is
  -- needed to make this check meaningful.
  if v_code is not null
     and not exists (select 1 from referral_codes where code = v_code) then
    return query select null::integer, 'referral_code_invalid'::text, null::text, null::text;
    return;
  end if;

  -- Lock order across this function is campaign_counter (single row, always
  -- first) -> referral_codes -> whitelist_entries. Every claim takes the
  -- counter row first, which serializes claims and makes deadlock
  -- impossible. No cap predicate any more: this only assigns a number.
  --
  -- The three statements below are grouped in their own sub-block so a
  -- unique_violation on the INSERT (a concurrent claim for the same
  -- x_user_id/wallet_address that committed after the checks above ran)
  -- rolls all three back together via the block's implicit savepoint,
  -- rather than leaving the counter/referral increments applied for a
  -- claim that never actually produced a whitelist_entries row.
  begin
    update campaign_counter
       set spots_used = spots_used + 1
     where id = 1
     returning spots_used into v_spot;

    if v_code is not null then
      update referral_codes
         set uses_count = uses_count + 1
       where code = v_code
       returning uses_count, owner_entry_id into v_uses, v_owner_entry_id;
    end if;

    insert into whitelist_entries (
      x_user_id, x_username, wallet_address,
      follow_attested, retweet_attested, like_attested,
      status, spot_number, used_referral_code, tier, character_slug
    ) values (
      p_x_user_id, p_x_username, p_wallet_address,
      p_follow_attested, p_retweet_attested, p_like_attested,
      'eligible', v_spot, v_code, 'fcfs', p_character_slug
    )
    returning id into v_new_entry_id;
  exception when unique_violation then
    -- Re-run the same duplicate checks from the top of this function
    -- against the now-committed state — the row we collided with is
    -- visible now under READ COMMITTED even if it wasn't when we first
    -- checked.
    select whitelist_entries.id,
           whitelist_entries.spot_number,
           whitelist_entries.tier
      into v_existing_entry_id, v_existing_spot, v_existing_tier
    from whitelist_entries
    where x_user_id = p_x_user_id;

    if v_existing_entry_id is not null then
      select referral_codes.code into v_existing_code
      from referral_codes
      where owner_entry_id = v_existing_entry_id;

      return query select v_existing_spot,
                          'duplicate_x_account'::text,
                          v_existing_code,
                          v_existing_tier;
      return;
    end if;

    return query select null::integer, 'duplicate_wallet'::text, null::text, null::text;
    return;
  end;

  -- Mint a fresh code for the new entry. The 32-character unambiguous
  -- alphabet at 6 characters gives ~1 billion codes, so a collision is a
  -- formality to handle, not a real risk — retry a bounded number of times.
  loop
    v_new_code := (
      select string_agg(
        substr(v_charset, floor(random() * length(v_charset))::integer + 1, 1),
        ''
      )
      from generate_series(1, 6)
    );

    begin
      insert into referral_codes (code, owner_entry_id, uses_count)
      values (v_new_code, v_new_entry_id, 0);
      exit;
    exception when unique_violation then
      v_attempt := v_attempt + 1;
      if v_attempt >= 10 then
        raise exception 'could not generate a unique referral code after % attempts', v_attempt;
      end if;
    end;
  end loop;

  -- Promotion. The `tier = 'fcfs'` predicate is what makes uses 4, 5, 100
  -- no-ops: an owner already promoted matches nothing. There is no counter
  -- to overdraw and no quota to race for, so no extra locking is needed.
  -- Codes whose owner row was deleted carry a null owner_entry_id and
  -- promote nobody, as does the ownerless root code.
  if v_owner_entry_id is not null and v_uses >= c_threshold then
    update whitelist_entries
       set tier = 'guaranteed'
     where whitelist_entries.id = v_owner_entry_id
       and whitelist_entries.tier = 'fcfs';
  end if;

  return query select v_spot, null::text, v_new_code, 'fcfs'::text;
end;
$$;

-- Re-apply the grant restrictions every prior signature-changing migration
-- has re-applied at this point: dropping and recreating the function resets
-- its grants to Postgres's default (EXECUTE to PUBLIC), reopening the hole
-- 0003 closed. This is now a fresh 8-parameter signature.
revoke execute on function allocate_whitelist_spot(text, text, text, boolean, boolean, boolean, text, text) from public;
revoke execute on function allocate_whitelist_spot(text, text, text, boolean, boolean, boolean, text, text) from anon, authenticated;
