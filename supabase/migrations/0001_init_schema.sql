-- supabase/migrations/0001_init_schema.sql

create table whitelist_entries (
  id uuid primary key default gen_random_uuid(),
  x_user_id text not null unique,
  x_username text not null,
  wallet_address text not null unique,
  wallet_signature text not null,
  follow_attested boolean not null,
  retweet_attested boolean not null,
  status text not null default 'eligible' check (status = 'eligible'),
  spot_number integer not null unique,
  created_at timestamptz not null default now()
);

create table campaign_counter (
  id integer primary key default 1 check (id = 1),
  spots_used integer not null default 0,
  spots_cap integer not null
);

-- This 3600 is the ONLY cap the app enforces. `allocate_whitelist_spot`
-- (migration 0002) checks `spots_used < spots_cap` inside the allocating
-- transaction; nothing reads the `CAMPAIGN_SPOTS_CAP` env var at runtime, so
-- changing that var does not change the cap. See the note on `spotsCap` in
-- `src/lib/campaign-config.ts`. To change the cap after launch, run:
--   UPDATE campaign_counter SET spots_cap = <new cap> WHERE id = 1;
insert into campaign_counter (id, spots_used, spots_cap) values (1, 0, 3600);
