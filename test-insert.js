import fs from 'fs';
const SUPABASE_URL = "https://srxtgawllgfmppxdcmuv.supabase.co";
let key = "";
const env = fs.readFileSync('.env', 'utf8');
const pubMatch = env.match(/VITE_SUPABASE_PUBLISHABLE_KEY="(.*?)"/);
if (pubMatch) key = pubMatch[1];
const testSave = async () => {
  const req = await fetch(`${SUPABASE_URL}/rest/v1/products?limit=1`, {
    method: "POST",
    headers: {
      "apikey": key,
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
      "Prefer": "return=representation"
    },
    body: JSON.stringify({
        name: "Premium Dubai Pistachio Kunafa Chocolat test",
        description: "description... [META:delivery_fee:400]",
        price: 17500,
        original_price: 17500,
        discount_percentage: 51,
        category: "Dairy & Milk",
        image_url: null,
        stock_quantity: 100,
        unit: "100g",
        is_top_selling: false,
        is_exclusive: true,
        is_promotional: true,
        is_active: true,
    })
  });
  console.log(req.status, await req.text());
}
testSave();
