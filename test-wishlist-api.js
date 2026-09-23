import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').filter(Boolean).forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    let value = parts.slice(1).join('=').trim();
    if(value.startsWith('"')) value = value.slice(1, -1);
    if(value.startsWith("'")) value = value.slice(1, -1);
    env[key] = value;
  }
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const userId = 'user_3CACDyqS7zQKhsKIoomYOiZSczR';
  console.log('Fetching wishlist for:', userId);
  
  // Try using the JS client exactly as the code does
  const { data, error } = await supabase
    .from('wishlist')
    .select('product_id')
    .eq('user_id', userId);
    
  console.log('Result Data:', data);
  console.log('Result Error:', error);
}

run();
