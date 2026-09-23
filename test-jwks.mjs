async function run() {
  const clerkPubKey = process.env.VITE_CLERK_PUBLISHABLE_KEY || '';
  const parts = clerkPubKey.split('_');
  const decodedApiUrl = atob(parts[2]).replace('$', '');
  const jwksUrl = new URL(`https://${decodedApiUrl}/.well-known/jwks.json`);
  console.log(jwksUrl.href);

  const res = await fetch(jwksUrl.href);
  const jwks = await res.json();
  console.log('JWKS:', JSON.stringify(jwks, null, 2));
}

run();
