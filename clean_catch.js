import fs from 'fs';
const file = 'src/pages/Checkout.tsx';
let data = fs.readFileSync(file, 'utf8');
const badBlockStart = data.indexOf("    } else {\n          clearPendingOnlineOrder();");
const nextElseStart = data.indexOf("    } else {\n      // Cash on Delivery");

if (badBlockStart !== -1 && nextElseStart !== -1) {
    data = data.substring(0, badBlockStart) + data.substring(nextElseStart);
}
fs.writeFileSync(file, data);
