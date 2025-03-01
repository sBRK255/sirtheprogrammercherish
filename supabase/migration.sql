-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create stickers table
CREATE TABLE IF NOT EXISTS stickers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by TEXT NOT NULL,
    category TEXT DEFAULT 'custom' CHECK (category IN ('custom', 'public'))
);

-- Enable RLS
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;

-- Create policies for stickers table
CREATE POLICY "View all stickers" ON stickers
    FOR SELECT USING (true);

CREATE POLICY "Insert own stickers" ON stickers
    FOR INSERT WITH CHECK (created_by = auth.uid()::text);

CREATE POLICY "Update own stickers" ON stickers
    FOR UPDATE USING (created_by = auth.uid()::text);

CREATE POLICY "Delete own stickers" ON stickers
    FOR DELETE USING (created_by = auth.uid()::text);

-- Storage bucket policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'stickers');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'stickers'
    AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'stickers'
    AND owner = auth.uid()::text
);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'stickers'
    AND owner = auth.uid()::text
);
