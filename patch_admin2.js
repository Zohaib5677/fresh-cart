import fs from 'fs';
const path = 'supabase/functions/admin-data/index.ts';
let code = fs.readFileSync(path, 'utf-8');

const sIdx = code.indexOf('    // Admin Verification Process');
const eIdx = code.indexOf("    const action = requestData.action || 'read';");

if (sIdx !== -1 && eIdx !== -1) {
  const replacement = `    // Admin Verification Process
    let isAdmin = false;
    const adminEmailConfig = Deno.env.get('ADMIN_EMAIL');
    let userEmail = payload.email;

    if (!userEmail && adminEmailConfig && Deno.env.get('CLERK_SECRET_KEY')) {
        try {
           const clerkRes = await fetch(\`https://api.clerk.com/v1/users/\${userId}\`, {
               headers: { Authorization: \`Bearer \${Deno.env.get('CLERK_SECRET_KEY')}\` }
           });
           const clerkUser = await clerkRes.json();
           const match = clerkUser?.email_addresses?.find((e: any) => e.email_address === adminEmailConfig);
           if (match) userEmail = match.email_address;
        } catch(e) { console.error('Clerk fetch error:', e); }
    }

    if (adminEmailConfig && userEmail === adminEmailConfig) {
       isAdmin = true;
    }

`;
  code = code.substring(0, sIdx) + replacement + code.substring(eIdx);
  
  // also fix delete_review which has duplicate fallback logic
  const s2Idx = code.indexOf('       // Alternatively, check admin');
  const e2Idx = code.indexOf('       if (!isAuthor && !_isAdmin)');
  if (s2Idx !== -1 && e2Idx !== -1) {
    const r2 = `       // Alternatively, check admin
       let _isAdmin = false;
       if (adminEmailConfig && userEmail === adminEmailConfig) {
           _isAdmin = true;
       }
`;
    code = code.substring(0, s2Idx) + r2 + code.substring(e2Idx);
  }
  
  fs.writeFileSync(path, code);
  console.log('patched');
} else {
  console.log('not found');
}
