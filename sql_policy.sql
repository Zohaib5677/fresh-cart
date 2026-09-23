CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'payment-screenshots' );

CREATE POLICY "Allow public uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'payment-screenshots' );
