import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
      const isFunctionRequest = urlStr.includes('/functions/v1/');
      const explicitAuthorization = headers.get('Authorization');
      const hasExplicitFunctionToken = isFunctionRequest && explicitAuthorization?.startsWith('Bearer ');

      // Storage rejects Clerk `sub` values that are not UUIDs.
      if (hasExplicitFunctionToken) {
        // Preserve caller-supplied Clerk tokens for Edge Functions.
      } else if (isStorageRequest || !clerkToken) {
        headers.set('Authorization', `Bearer ${SUPABASE_PUBLISHABLE_KEY}`);
      } else {
        // Keep the Clerk JWT so Supabase RLS can identify the customer/admin.
        headers.set('Authorization', `Bearer ${clerkToken}`);
      }

      return fetch(url, {
        ...options,
        headers,
      });
    }
  }
});
