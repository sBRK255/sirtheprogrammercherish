-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if it exists
DROP TABLE IF EXISTS stickers;

-- Create stickers table
CREATE TABLE stickers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by TEXT NOT NULL,
    category TEXT DEFAULT 'custom' CHECK (category IN ('custom', 'public'))
);

-- Enable RLS
ALTER TABLE stickers ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "View all stickers" ON stickers;
CREATE POLICY "View all stickers" ON stickers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Insert own stickers" ON stickers;
CREATE POLICY "Insert own stickers" ON stickers
    FOR INSERT WITH CHECK (created_by = auth.uid()::text);

DROP POLICY IF EXISTS "Update own stickers" ON stickers;
CREATE POLICY "Update own stickers" ON stickers
    FOR UPDATE USING (created_by = auth.uid()::text);

DROP POLICY IF EXISTS "Delete own stickers" ON stickers;
CREATE POLICY "Delete own stickers" ON stickers
    FOR DELETE USING (created_by = auth.uid()::text);

-- Insert default stickers
INSERT INTO stickers (url, created_by, category) VALUES
    ('https://qqarphupqtvujtfgwiaz.supabase.co/storage/v1/object/public/stickers/default/happy.png', 'system', 'public'),
    ('https://qqarphupqtvujtfgwiaz.supabase.co/storage/v1/object/public/stickers/default/love.png', 'system', 'public'),
    ('https://qqarphupqtvujtfgwiaz.supabase.co/storage/v1/object/public/stickers/default/sad.png', 'system', 'public'),
    ('https://qqarphupqtvujtfgwiaz.supabase.co/storage/v1/object/public/stickers/default/laugh.png', 'system', 'public')
ON CONFLICT DO NOTHING;
