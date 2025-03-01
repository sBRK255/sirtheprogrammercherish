-- Policy 1: Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'stickers');

-- Policy 2: Allow authenticated uploads
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'stickers'
    AND auth.role() = 'authenticated'
);

-- Policy 3: Allow users to update own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'stickers'
    AND owner = auth.uid()::text
);

-- Policy 4: Allow users to delete own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'stickers'
    AND owner = auth.uid()::text
);
