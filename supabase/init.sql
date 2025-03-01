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

-- Create RLS (Row Level Security) policies
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;

-- Allow users to view all stickers
CREATE POLICY "View all stickers" ON stickers
    FOR SELECT USING (true);

-- Allow users to insert their own stickers
CREATE POLICY "Insert own stickers" ON stickers
    FOR INSERT WITH CHECK (created_by = auth.uid()::text);

-- Allow users to update their own stickers
CREATE POLICY "Update own stickers" ON stickers
    FOR UPDATE USING (created_by = auth.uid()::text);

-- Allow users to delete their own stickers
CREATE POLICY "Delete own stickers" ON stickers
    FOR DELETE USING (created_by = auth.uid()::text);

-- Create storage policies
DO $$
BEGIN
    -- Allow public read access to all files
    EXECUTE format('
        CREATE POLICY "Public Access"
        ON storage.objects FOR SELECT
        USING (bucket_id = %L)', 'stickers'
    );

    -- Allow authenticated users to upload files
    EXECUTE format('
        CREATE POLICY "Authenticated users can upload"
        ON storage.objects FOR INSERT
        WITH CHECK (
            bucket_id = %L
            AND auth.role() = ''authenticated''
        )', 'stickers'
    );

    -- Allow users to update their own files
    EXECUTE format('
        CREATE POLICY "Users can update own files"
        ON storage.objects FOR UPDATE
        USING (
            bucket_id = %L
            AND owner = auth.uid()::text
        )', 'stickers'
    );

    -- Allow users to delete their own files
    EXECUTE format('
        CREATE POLICY "Users can delete own files"
        ON storage.objects FOR DELETE
        USING (
            bucket_id = %L
            AND owner = auth.uid()::text
        )', 'stickers'
    );
EXCEPTION
    WHEN duplicate_object THEN
        NULL;
END $$;

-- Insert some default public stickers
INSERT INTO stickers (url, created_by, category) VALUES
    ('https://qqarphupqtvujtfgwiaz.supabase.co/storage/v1/object/public/stickers/default/happy.png', 'system', 'public'),
    ('https://qqarphupqtvujtfgwiaz.supabase.co/storage/v1/object/public/stickers/default/love.png', 'system', 'public'),
    ('https://qqarphupqtvujtfgwiaz.supabase.co/storage/v1/object/public/stickers/default/sad.png', 'system', 'public'),
    ('https://qqarphupqtvujtfgwiaz.supabase.co/storage/v1/object/public/stickers/default/laugh.png', 'system', 'public')
ON CONFLICT DO NOTHING;
