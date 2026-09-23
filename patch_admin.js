import fs from 'fs';

const path = 'supabase/functions/admin-data/index.ts';
let code = fs.readFileSync(path, 'utf-8');

const oldAdminCheck = `    // Admin Verification Process
    let isAdmin = false;
    const adminEmailConfig = Deno.env.get('ADMIN_EMAIL');

    if (adminEmailConfig && payload.email === adminEmailConfig) {
       isAdmin = true;
    } else if (adminEmailConfig) {
       // Fallback check against Supabase "users" or "profiles" tables if emailT
       const { data: profileCheck } = await supabase.from('users').select('emai;
       if (profileCheck?.email === adminEmailConfig) {
           isAdmin = true;
       }
    }`;

// Since the old code is truncated in my variable, I will do a regex replacement
