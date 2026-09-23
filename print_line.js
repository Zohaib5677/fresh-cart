const fs = require('fs');
const lines = fs.readFileSync('supabase/functions/admin-data/index.ts', 'utf8').split('\n');
console.log(lines[171]);
