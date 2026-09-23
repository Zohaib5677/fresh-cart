import 'dotenv/config';
const res = await fetch(process.env.VITE_SUPABASE_URL + '/functions/v1/admin-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  },
  body: JSON.stringify({ action: 'update_settings' })
});
console.log(res.status, await res.text());
