-- Nexa Audio — account / orders schema (Supabase)
-- Run in SQL editor after project create. RLS enabled everywhere.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  label text,
  city text not null,
  street text not null,
  house_number text,
  zip text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  guest_email text,
  status text not null default 'paid'
    check (status in ('pending','paid','shipped','delivered','cancelled','refunded')),
  currency text not null default 'ILS',
  subtotal_agorot int not null,
  shipping_agorot int not null default 0,
  discount_agorot int not null default 0,
  total_agorot int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  sku text not null,
  color_id text,
  qty int not null check (qty > 0 and qty <= 2),
  unit_price_agorot int not null
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  carrier text,
  tracking_code text,
  status text not null default 'preparing',
  updated_at timestamptz not null default now()
);

create table if not exists public.warranties (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  sku text not null,
  starts_on date not null,
  ends_on date not null,
  status text not null default 'active'
);

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.shipments enable row level security;
alter table public.warranties enable row level security;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "addresses_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "orders_own_select" on public.orders
  for select using (auth.uid() = user_id);

create policy "order_items_own_select" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "shipments_own_select" on public.shipments
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "warranties_own_select" on public.warranties
  for select using (auth.uid() = user_id);

-- Auto profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
