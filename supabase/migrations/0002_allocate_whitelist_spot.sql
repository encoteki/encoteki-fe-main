-- supabase/migrations/0002_allocate_whitelist_spot.sql

create or replace function allocate_whitelist_spot(
  p_x_user_id text,
  p_x_username text,
  p_wallet_address text,
  p_wallet_signature text,
  p_follow_attested boolean,
  p_retweet_attested boolean
) returns table (spot_number integer, rejection_reason text)
language plpgsql
as $$
declare
  v_spot integer;
begin
  if exists (select 1 from whitelist_entries where x_user_id = p_x_user_id) then
    return query select null::integer, 'duplicate_x_account'::text;
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
    x_user_id, x_username, wallet_address, wallet_signature,
    follow_attested, retweet_attested, status, spot_number
  ) values (
    p_x_user_id, p_x_username, p_wallet_address, p_wallet_signature,
    p_follow_attested, p_retweet_attested, 'eligible', v_spot
  );

  return query select v_spot, null::text;
end;
$$;
