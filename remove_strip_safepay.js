import fs from 'fs';

const path = 'src/pages/Checkout.tsx';
let data = fs.readFileSync(path, 'utf8');

// remove safepay logic
let startIdx = data.indexOf("} else if (paymentMethod === 'safepay') {");
if (startIdx !== -1) {
    let nextIfIdx = data.indexOf("} else if (paymentMethod === 'stripe') {", startIdx);
    if (nextIfIdx !== -1) {
        data = data.substring(0, startIdx) + data.substring(nextIfIdx);
    }
}

// remove stripe logic
startIdx = data.indexOf("} else if (paymentMethod === 'stripe') {");
if (startIdx !== -1) {
    let nextIfIdx = data.indexOf("  } else {\n      // Regular COD Flow", startIdx);
    if (nextIfIdx !== -1) {
        data = data.substring(0, startIdx) + "  " + data.substring(nextIfIdx);
    }
}

fs.writeFileSync(path, data);
console.log('Backend logic removed');
