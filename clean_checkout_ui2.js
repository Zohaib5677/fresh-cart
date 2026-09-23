import fs from 'fs';
const file = 'src/pages/Checkout.tsx';
let data = fs.readFileSync(file, 'utf8');

// Remove UI matching `onClick={() => setPaymentMethod('stripe')}`
const regexStripe = /<div[^<]*onClick=\{\(\) => setPaymentMethod\('stripe'\)\}[^>]*>[\s\S]*?<\/div>\s*<\/div>/;
data = data.replace(regexStripe, '');

const regexSafepay = /<div[^<]*onClick=\{\(\) => setPaymentMethod\('safepay'\)\}[^>]*>[\s\S]*?<\/div>\s*<\/div>/;
data = data.replace(regexSafepay, '');

fs.writeFileSync(file, data);
