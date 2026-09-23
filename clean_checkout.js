import fs from 'fs';
const file = 'src/pages/Checkout.tsx';
let data = fs.readFileSync(file, 'utf8');

// 1. Remove UI for SafePay & Stripe
const uiRegex = /<div\s+className="flex items-center justify-between space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-slate-800 transition-colors"\s+onClick=\{\(\) => setPaymentMethod\('stripe'\)\}>[\s\S]*?<\/div>\s*<\/div>/g;
data = data.replace(uiRegex, '');

const uiRegex2 = /<div\s+className="flex items-center justify-between space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-slate-800 transition-colors"\s+onClick=\{\(\) => setPaymentMethod\('safepay'\)\}>[\s\S]*?<\/div>\s*<\/div>/g;
data = data.replace(uiRegex2, '');

// 2. Remove the Review texts
data = data.replace(/\{paymentMethod === 'safepay' && 'Online Payment \(SafePay\)'\}/g, '');
data = data.replace(/\{paymentMethod === 'stripe' && 'Pay with Stripe'\}/g, '');

// 3. Remove Backend logic Safepay
const beSafepay = /\} else if \(paymentMethod === 'safepay'\) \{[\s\S]*?\} else if \(paymentMethod === 'stripe'\) \{/g;
data = data.replace(beSafepay, "} else if (paymentMethod === 'stripe') {");

// 4. Remove Backend logic Stripe
const beStripe = /\} else if \(paymentMethod === 'stripe'\) \{[\s\S]*?\} else \{\n\s*\/\/ Cash on Delivery/g;
data = data.replace(beStripe, "} else {\n      // Cash on Delivery");

// 5. Clean up duplicate checkout processing code
// Sometimes we might have redundant pending checkout logic that is stripe/safepay specific
const pendingLogic = /const finalizeOnlineOrder = useCallback\(async[\s\S]*?\}, \[searchParams, finalizeOnlineOrder, clearPendingOnlineOrder\]\);/g;
data = data.replace(pendingLogic, '');


fs.writeFileSync(file, data);
console.log('Success');
