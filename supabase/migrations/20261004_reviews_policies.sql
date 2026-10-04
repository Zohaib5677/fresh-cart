-- Reviews are read by the storefront and written through the admin-data
-- Edge Function, which uses the service role for the insert/delete operation.
alter table public.reviews enable row level security;

drop policy if exists "Public can read reviews" on public.reviews;
create policy "Public can read reviews"
on public.reviews
for select
to anon, authenticated
using (true);
