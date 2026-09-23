import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data, error } = await supabase.from('site_settings').upsert({ key: 'flat_discount', value: { test: 1 } });
  console.log('Result:', data, error);
}
run();
