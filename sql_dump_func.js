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
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function run() {
  const res = await supabase.rpc('get_function_def', {});
  console.log(res);
}
// since rpc might not exist, let's just write a script to use pg_proc to find has_role
