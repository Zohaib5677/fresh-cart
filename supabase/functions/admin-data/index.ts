import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-secret',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
}

// Safely decode JWT payload without verifying signature (fallback)
function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '=='.slice((base64.length + 2) % 4 === 0 ? 2 : (base64.length + 2) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Use service role to bypass RLS entirely
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const requestData = await req.json();

    // --- Authentication ---
    let userId: string | null = null;
    let userEmail: string | null = null;
    let isAdmin = false;

    const adminEmailConfig = Deno.env.get('ADMIN_EMAIL') ?? '';
    const adminSecret = Deno.env.get('ADMIN_SECRET') ?? '';

    // Option 1: Simple admin secret bypass (most reliable)
    const adminSecretHeader = req.headers.get('x-admin-secret') || requestData.adminSecret;
    if (adminSecret && adminSecretHeader && adminSecretHeader === adminSecret) {
      isAdmin = true;
      userId = 'admin';
      userEmail = adminEmailConfig;
    }

    // Option 2: JWT decoding (unverified, relies on ADMIN_EMAIL check)
    if (!isAdmin) {
      const authHeader = req.headers.get('Authorization') ?? '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

      if (token) {
        const payload = decodeJwtPayload(token);
        if (payload) {
          userId = payload.sub ?? null;
          // Clerk puts email in different places depending on template
          userEmail =
            payload.email ??
            payload.primary_email_address ??
            payload['https://clerk.dev/email'] ??
            payload.email_addresses?.[0]?.email_address ??
            null;
        }

        // If email not in JWT, try fetching from Clerk API
        if (!userEmail && userId && adminEmailConfig && Deno.env.get('CLERK_SECRET_KEY')) {
          try {
            const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
              headers: { Authorization: `Bearer ${Deno.env.get('CLERK_SECRET_KEY')}` }
            });
            if (clerkRes.ok) {
              const clerkUser = await clerkRes.json();
              const match = clerkUser?.email_addresses?.find((e: any) => e.email_address === adminEmailConfig);
              if (match) userEmail = match.email_address;
            }
          } catch (e) {
            console.error('Clerk fetch error:', e);
          }
        }

        if (adminEmailConfig && userEmail === adminEmailConfig) {
          isAdmin = true;
        }

        // Also check: if userId matches admin userId stored in env
        const adminUserId = Deno.env.get('ADMIN_USER_ID') ?? '';
        if (adminUserId && userId === adminUserId) {
          isAdmin = true;
        }
        
        // Option 3: Check database for user role
        if (!isAdmin && userId) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle();
          if (roleData) {
            isAdmin = true;
          }
        }
      }
    }

    if (!userId && !isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized: No valid auth' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const action = requestData.action || 'read';
    const table = requestData.table || 'profiles';

    // --- User Orders (no admin required) ---
    if (table === 'user_orders') {
      const { userName } = requestData;
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const myOrders = orders?.filter((o: any) => {
        if (userId && o.user_id === userId) return true;
        if (o.notes && userId && o.notes.includes(`[clerk:${userId}]`)) return true;
        const dbName = (o.customer_name || '').toLowerCase().trim();
        const reqName = (userName || '').toLowerCase().trim();
        if (dbName && reqName && (dbName === reqName || dbName.includes(reqName))) return true;
        return false;
      }) || [];

      return new Response(JSON.stringify(myOrders), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // --- Review Actions (no admin required) ---
    if (action === 'create_review') {
      const { reviewData } = requestData;
      const { data, error } = await supabase.from('reviews').insert(reviewData).select().single();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'delete_review') {
      const { reviewId } = requestData;
      const { data: review } = await supabase.from('reviews').select('*').eq('id', reviewId).maybeSingle();
      if (!review) throw new Error("Review not found");

      let isAuthor = false;
      try {
        const parsed = JSON.parse(review.comment || '{}');
        if (parsed.clerkUserId === userId) isAuthor = true;
      } catch (_e) {}

      if (!isAuthor && !isAdmin) throw new Error("Unauthorized to delete this review");

      const { data, error } = await supabase.from('reviews').delete().eq('id', reviewId).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // --- ALL OTHER ACTIONS REQUIRE ADMIN ---
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin access required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 403,
      });
    }

    if (action === 'update_order') {
      const { orderId, updateData } = requestData;
      const { data, error } = await supabase.from('orders').update(updateData).eq('id', orderId).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    if (action === 'create_product') {
      const { productData } = requestData;
      const { data, error } = await supabase.from('products').insert(productData).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    if (action === 'update_product') {
      const { productId, productData } = requestData;
      const { data, error } = await supabase.from('products').update(productData).eq('id', productId).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    if (action === 'update_settings') {
      const { key, value } = requestData;
      const { data, error } = await supabase.from('site_settings').upsert({ key, value }, { onConflict: 'key' });
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (action === 'delete_product') {
      const { productId } = requestData;
      const { data, error } = await supabase.from('products').delete().eq('id', productId).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    if (action === 'delete_all_products') {
      const { data, error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    if (table === 'profiles') {
      const { data: profiles, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(profiles || []), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    if (table === 'orders') {
      const { data: orders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify(orders), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid table/action request' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });

  } catch (error: any) {
    console.error('admin-data error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
})
// force deploy comment
