import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupStorage() {
  try {
    console.log('Setting up Supabase storage...');

    // Create storage bucket
    console.log('Creating stickers bucket...');
    const { error: bucketError } = await supabase.storage.createBucket('stickers', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'],
      fileSizeLimit: 1024 * 1024 * 2 // 2MB
    });
    if (bucketError && !bucketError.message.includes('already exists')) {
      throw bucketError;
    }

    // Upload default stickers
    console.log('Uploading default stickers...');
    const defaultStickers = [
      { name: 'happy.png', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=happy' },
      { name: 'love.png', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=love' },
      { name: 'sad.png', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=sad' },
      { name: 'laugh.png', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=laugh' }
    ];

    for (const sticker of defaultStickers) {
      const response = await fetch(sticker.url);
      const buffer = await response.arrayBuffer();
      const file = new Uint8Array(buffer);

      const { error: uploadError } = await supabase.storage
        .from('stickers')
        .upload(`default/${sticker.name}`, file, {
          contentType: 'image/svg+xml',
          upsert: true
        });

      if (uploadError) {
        console.error(`Error uploading ${sticker.name}:`, uploadError);
      } else {
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('stickers')
          .getPublicUrl(`default/${sticker.name}`);

        // Insert sticker record
        const { error: insertError } = await supabase
          .from('stickers')
          .upsert({
            url: publicUrl,
            created_by: 'system',
            category: 'public'
          });

        if (insertError) {
          console.error(`Error inserting sticker record for ${sticker.name}:`, insertError);
        }
      }
    }

    console.log('Supabase setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    process.exit(1);
  }
}

setupStorage();
