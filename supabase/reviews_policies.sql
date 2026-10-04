-- Run this script in the Supabase SQL Editor for an existing hosted project.
-- The storefront reads reviews directly; review writes go through the
-- admin-data Edge Function using the service role.
alter table public.reviews enable row level security;

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews"
on public.reviews
for select
to anon, authenticated
using (true);
