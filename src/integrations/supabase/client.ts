import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  global: {
    fetch: async (url, options = {}) => {
      let clerkToken;
      try {
        const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
        const userEmail = window.Clerk?.user?.primaryEmailAddress?.emailAddress;
        
        if (window.Clerk && window.Clerk.session) {
          // Request the specific Supabase-formatted JWT from Clerk
          clerkToken = await window.Clerk.session.getToken({ template: 'supabase' });
        }
      } catch (e) {
        console.warn('Could not retrieve Clerk JWT', e);
      }

      const headers = new Headers(options?.headers);
      
      const authHeader = headers.get('Authorization');
      
      let urlStr = typeof url === 'string' ? url : (url instanceof URL ? url.toString() : url?.url || String(url));
      const isStorageRequest = urlStr.includes('/storage/v1/object');
      
      // If a storage request, use anon key because Supabase Storage 'owner' is strict UUID 
      // and Clerk's string 'sub' causes 400 invalid input syntax type uuid.
      if (isStorageRequest) {
        headers.set('Authorization', `Bearer ${SUPABASE_PUBLISHABLE_KEY}`);
      }
      // If there is no specific authorization or it's just the default anon key, inject Clerk token
      else if (clerkToken && (!authHeader || authHeader === `Bearer ${SUPABASE_PUBLISHABLE_KEY}`)) {
        headers.set('Authorization', `Bearer ${clerkToken}`);
      } else if (!authHeader) {
        headers.set('Authorization', `Bearer ${SUPABASE_PUBLISHABLE_KEY}`);
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      return response;
    }
  }
});
