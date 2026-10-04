DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT
TO anon, authenticated
USING ( bucket_id = 'payment-screenshots' );

DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads" 
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK ( bucket_id = 'payment-screenshots' );

-- Product reviews are read directly by the storefront.
-- Review writes and deletes are handled by the admin-data Edge Function.
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read reviews" ON public.reviews;
CREATE POLICY "Public can read reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (true);
