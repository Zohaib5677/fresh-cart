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
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const { data, error } = await supabase.from('orders').select('*').eq('id', 'e81d11f1-80ef-4f26-b9dc-b34176c8c748');
  console.dir(data, { depth: null });
  console.log(error);
}
run();
