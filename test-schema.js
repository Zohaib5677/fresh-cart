import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
const envText = fs.readFileSync('.env', 'utf-8');
const env = {};
envText.split('\n').filter(l => l.includes('=')).forEach(line => {
  const [key, ...rest] = line.split('=');
  env[key.trim()] = rest.join('=').trim().replace(/^"|"$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY);
(async () => {
    const { data, error } = await supabase.functions.invoke('admin-data', {
        body: { table: 'orders' }
    });
    if (data && data.length > 0) console.log(Object.keys(data[0]));
})();
