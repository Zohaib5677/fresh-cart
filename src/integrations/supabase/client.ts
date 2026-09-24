import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** True only if Clerk returned a JWT this Supabase project can verify. */
function isSupabaseAccessToken(token: string | null | undefined): token is string {
  if (!token || token.split('.').length !== 3) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    const iss = String(payload.iss || '');
    return Boolean(SUPABASE_URL) && iss.startsWith(SUPABASE_URL);
  } catch {
    return false;
  }
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  global: {
    fetch: async (url, options = {}) => {
      let clerkToken: string | null = null;
      try {
        if (window.Clerk?.session) {
          clerkToken = await window.Clerk.session.getToken({ template: 'supabase' });
        }
      } catch {
        clerkToken = null;
      }

      const headers = new Headers(options?.headers);
      const urlStr = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : url?.url || String(url));
      const isStorageRequest = urlStr.includes('/storage/v1/object');

      // Storage rejects Clerk `sub` values that are not UUIDs.
      if (isStorageRequest || !isSupabaseAccessToken(clerkToken)) {
        headers.set('Authorization', `Bearer ${SUPABASE_PUBLISHABLE_KEY}`);
      } else {
        headers.set('Authorization', `Bearer ${clerkToken}`);
      }

      return fetch(url, {
        ...options,
        headers,
      });
    }
  }
});
