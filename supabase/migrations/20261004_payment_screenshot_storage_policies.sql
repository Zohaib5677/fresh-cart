-- Allow checkout uploads and admin reads for payment proof.
-- Apply this migration to the Supabase project that serves VITE_SUPABASE_URL.
drop policy if exists "Public payment screenshot access" on storage.objects;
create policy "Public payment screenshot access"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'payment-screenshots');

drop policy if exists "Allow payment screenshot uploads" on storage.objects;
create policy "Allow payment screenshot uploads"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'payment-screenshots');
