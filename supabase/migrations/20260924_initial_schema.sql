-- Run this in Supabase Dashboard → SQL Editor for project befqnlkhdamxtequivwf.
-- A file in this repo does not create tables until you execute it.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.order_status as enum (
    'pending_verification',
    'pending',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null,
  price numeric not null,
  original_price numeric,
  discount_percentage numeric,
  delivery_fee numeric,
  image_url text,
  is_active boolean default true,
  is_exclusive boolean default false,
  is_promotional boolean default false,
  is_top_selling boolean default false,
  rating numeric,
  review_count integer,
  stock_quantity integer not null default 0,
  unit text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null unique,
  full_name text,
  phone text,
  address text,
  city text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  profile_id uuid references public.profiles(id) on delete set null,
  customer_name text not null,
  phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  total_amount numeric not null,
  status public.order_status not null default 'pending',
  notes text,
  admin_note text,
  payment_screenshot_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  product_price numeric not null,
  quantity integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete set null,
  user_id text not null,
  rating integer not null,
  comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.wishlist (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, product_id)
);

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_type text not null,
  discount_value numeric not null,
  min_order_amount numeric,
  max_uses integer,
  used_count integer default 0,
  is_active boolean default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_user_id text,
  subject text,
  status text not null default 'open',
  last_message_at timestamptz default now(),
  last_message_preview text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_type text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create or replace function public.has_role(_user_id text, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

insert into public.site_settings (key, value)
values ('flat_discount', '0'::jsonb)
on conflict (key) do nothing;

-- Open policies so the cloned store can read/write while you set up Clerk + admin.
-- Tighten these before a real production launch.
alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist enable row level security;
alter table public.coupons enable row level security;
alter table public.subscribers enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_messages enable row level security;

drop policy if exists "dev_all_products" on public.products;
create policy "dev_all_products" on public.products for all using (true) with check (true);

drop policy if exists "dev_all_site_settings" on public.site_settings;
create policy "dev_all_site_settings" on public.site_settings for all using (true) with check (true);

drop policy if exists "dev_all_profiles" on public.profiles;
create policy "dev_all_profiles" on public.profiles for all using (true) with check (true);

drop policy if exists "dev_all_user_roles" on public.user_roles;
create policy "dev_all_user_roles" on public.user_roles for all using (true) with check (true);

drop policy if exists "dev_all_orders" on public.orders;
create policy "dev_all_orders" on public.orders for all using (true) with check (true);

drop policy if exists "dev_all_order_items" on public.order_items;
create policy "dev_all_order_items" on public.order_items for all using (true) with check (true);

drop policy if exists "dev_all_reviews" on public.reviews;
create policy "dev_all_reviews" on public.reviews for all using (true) with check (true);

drop policy if exists "dev_all_wishlist" on public.wishlist;
create policy "dev_all_wishlist" on public.wishlist for all using (true) with check (true);

drop policy if exists "dev_all_coupons" on public.coupons;
create policy "dev_all_coupons" on public.coupons for all using (true) with check (true);

drop policy if exists "dev_all_subscribers" on public.subscribers;
create policy "dev_all_subscribers" on public.subscribers for all using (true) with check (true);

drop policy if exists "dev_all_conversations" on public.conversations;
create policy "dev_all_conversations" on public.conversations for all using (true) with check (true);

drop policy if exists "dev_all_conversation_messages" on public.conversation_messages;
create policy "dev_all_conversation_messages" on public.conversation_messages for all using (true) with check (true);
