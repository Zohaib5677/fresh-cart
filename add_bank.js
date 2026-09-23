import fs from 'fs';

const path = 'src/pages/Checkout.tsx';
let data = fs.readFileSync(path, 'utf8');

// 1. Add Bank Icon to imports
data = data.replace(
  "Smartphone, CheckCircle, Upload, Plus } from 'lucide-react';",
  "Smartphone, CheckCircle, Upload, Plus, Building } from 'lucide-react';"
);

// 2. Add BANK_ACCOUNT constant
data = data.replace(
  "const JAZZCASH_ACCOUNT = {",
  "const BANK_ACCOUNT = {\n  bank: 'Meezan Bank',\n  title: 'Ibrahim Store',\n  number: '12345678901234',\n  iban: 'PK12MEZN0001234567890123',\n};\n\nconst JAZZCASH_ACCOUNT = {"
);

// 3. Update handlePlaceOrder
data = data.replace(
  "if (paymentMethod === 'jazzcash') {",
  "if (paymentMethod === 'jazzcash' || paymentMethod === 'bank') {"
);

// 4. Update the disabled state in Checkout Step 3
data = data.replace(
  "disabled={isProcessing || (paymentMethod === 'jazzcash' && !paymentScreenshot)}",
  "disabled={isProcessing || ((paymentMethod === 'jazzcash' || paymentMethod === 'bank') && !paymentScreenshot)}"
);

// 5. Update Review Step descriptions
data = data.replace(
  "{paymentMethod === 'jazzcash' && 'JazzCash / EasyPaisa'}",
  "{paymentMethod === 'jazzcash' && 'JazzCash / EasyPaisa'}\n                        {paymentMethod === 'bank' && 'Direct Bank Transfer'}"
);
data = data.replace(
  "{paymentMethod === 'jazzcash' && (",
  "{(paymentMethod === 'jazzcash' || paymentMethod === 'bank') && ("
);
data = data.replace(
  "{paymentMethod === 'jazzcash' ? 'JazzCash details:' : ''}",
  "{paymentMethod === 'jazzcash' ? 'JazzCash details:' : 'Bank details:'}"
);


// 6. Support copy for Bank
data = data.replace(
  "const [copied, setCopied] = useState(false);",
  "const [copied, setCopied] = useState(false);\n  const [copiedBank, setCopiedBank] = useState(false);"
);
data = data.replace(
  "const handleCopyAccount = () => {",
  "const handleCopyBankAccount = () => {\n    navigator.clipboard.writeText(BANK_ACCOUNT.iban);\n    setCopiedBank(true);\n    toast.success('IBAN copied!');\n    setTimeout(() => setCopiedBank(false), 2000);\n  };\n\n  const handleCopyAccount = () => {"
);

fs.writeFileSync(path, data);
