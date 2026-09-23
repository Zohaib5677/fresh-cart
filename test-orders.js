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
    if (error) console.error(error);
    else {
        const recents = data.map(o => ({ id: o.id, notes: o.notes, user_id: o.user_id })).slice(0, 8);
        console.log(recents);
    }
})();
