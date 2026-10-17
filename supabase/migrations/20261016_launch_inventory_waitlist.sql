-- Nexa Audio — Launch inventory / waitlist / stock-hold orders
-- 300 units hard cap · atomic decrement via FOR UPDATE
-- Apply in Supabase SQL editor or: supabase db push

create extension if not exists "pgcrypto";

-- ─── Inventory (single SKU row for launch) ───────────────────────────
create table if not exists public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_name text not null unique,
  stock_count integer not null default 300
    check (stock_count >= 0),
  updated_at timestamptz not null default now()
);

insert into public.inventory (product_name, stock_count)
values ('Nexa Pro 3D', 300)
on conflict (product_name) do nothing;

-- ─── Waitlist (pre-launch · 48h early-access code issued in app) ─────
create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  early_access_code text,
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email)
);

create index if not exists waitlist_created_at_idx
  on public.waitlist (created_at desc);

-- ─── Orders (pending hold → PayPlus → paid) ──────────────────────────
-- Brief contract: id, email, total_amount, status, created_at
-- Table name `orders` on greenfield. If account ledger `public.orders` already
-- exists (schema.sql), we use `launch_orders` with the same columns and expose
-- a compatible view name for docs.
create table if not exists public.launch_orders (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'cancelled', 'refunded', 'sold_out')),
  sku text not null default 'nexa-pro-3d',
  color_id text,
  created_at timestamptz not null default now()
);

create index if not exists launch_orders_status_created_idx
  on public.launch_orders (status, created_at desc);

create index if not exists launch_orders_email_idx
  on public.launch_orders (email);

-- Greenfield alias: only created when `orders` does not already exist
do $$
begin
  if to_regclass('public.orders') is null then
    execute $c$
      create table public.orders (
        id uuid primary key default gen_random_uuid(),
        email text not null,
        total_amount numeric(12, 2) not null check (total_amount >= 0),
        status text not null default 'pending'
          check (status in ('pending', 'paid', 'cancelled', 'refunded', 'sold_out')),
        sku text not null default 'nexa-pro-3d',
        color_id text,
        created_at timestamptz not null default now()
      )
    $c$;
  end if;
end $$;

-- ─── RLS ─────────────────────────────────────────────────────────────
alter table public.inventory enable row level security;
alter table public.waitlist enable row level security;
alter table public.launch_orders enable row level security;

-- Public read of stock count only (no write via anon)
drop policy if exists "inventory_public_read" on public.inventory;
create policy "inventory_public_read" on public.inventory
  for select to anon, authenticated
  using (true);

-- Waitlist / orders / inventory writes: service role only (no public policies)

-- ─── CRITICAL: atomic stock decrement (prevents unit #301) ────────────
create or replace function public.decrement_stock(
  p_product_name text default 'Nexa Pro 3D',
  p_qty integer default 1
)
returns table (
  success boolean,
  remaining integer,
  inventory_id uuid,
  error_code text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_stock integer;
begin
  if p_qty is null or p_qty < 1 then
    return query select false, 0, null::uuid, 'invalid_qty'::text;
    return;
  end if;

  -- Row-level lock: serializes concurrent checkouts on this SKU
  select i.id, i.stock_count
    into v_id, v_stock
  from public.inventory i
  where i.product_name = p_product_name
  for update;

  if v_id is null then
    return query select false, 0, null::uuid, 'not_found'::text;
    return;
  end if;

  if v_stock < p_qty then
    return query select false, v_stock, v_id, 'sold_out'::text;
    return;
  end if;

  update public.inventory
  set
    stock_count = stock_count - p_qty,
    updated_at = now()
  where id = v_id
  returning stock_count into v_stock;

  return query select true, v_stock, v_id, null::text;
end;
$$;

revoke all on function public.decrement_stock(text, integer) from public;
grant execute on function public.decrement_stock(text, integer) to service_role;

-- Optional: release a hold if checkout abandoned (PayPlus timeout)
create or replace function public.release_stock(
  p_product_name text default 'Nexa Pro 3D',
  p_qty integer default 1
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.inventory
  set
    stock_count = stock_count + greatest(p_qty, 0),
    updated_at = now()
  where product_name = p_product_name;
  return found;
end;
$$;

revoke all on function public.release_stock(text, integer) from public;
grant execute on function public.release_stock(text, integer) to service_role;
