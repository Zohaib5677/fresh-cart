-- 1. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Policy: Allow anyone to view images (SELECT)
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'product-images' );

-- 3. Policy: Allow anyone to upload images (INSERT)
CREATE POLICY "Allow public uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'product-images' );

-- 4. Policy: Allow anyone to update/delete their own uploads (optional, but good for testing)
CREATE POLICY "Allow public updates" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'product-images' );

CREATE POLICY "Allow public deletes" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'product-images' );
