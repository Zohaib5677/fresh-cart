import fs from 'fs';
const file = 'src/pages/Checkout.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /\} else if \(paymentMethod === 'stripe'\) \{[\s\S]*?\} else \{/g;
data = data.replace(regex, '} else {');
fs.writeFileSync(file, data);
