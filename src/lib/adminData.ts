import { supabase } from '@/integrations/supabase/client';

type AdminBody = Record<string, any>;

/**
 * Edge function admin-data is not deployed on this project (CORS 404).
 * Same actions run against PostgREST instead.
 */
export async function callAdminData(body: AdminBody) {
  const action = body.action || 'read';
  const table = body.table || 'profiles';

  if (table === 'user_orders') {
    const userId = body.userId as string | undefined;
    const userName = (body.userName || '').toLowerCase().trim();
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return { data: null, error };
    const myOrders = (orders || []).filter((o: any) => {
      if (userId && o.user_id === userId) return true;
      if (o.notes && userId && o.notes.includes(`[clerk:${userId}]`)) return true;
      const dbName = (o.customer_name || '').toLowerCase().trim();
      if (dbName && userName && (dbName === userName || dbName.includes(userName))) return true;
      return false;
    });
    return { data: myOrders, error: null };
  }

  if (action === 'create_review') {
    const { data, error } = await supabase.from('reviews').insert(body.reviewData).select().single();
    return { data, error };
  }

  if (action === 'delete_review') {
    const { data, error } = await supabase.from('reviews').delete().eq('id', body.reviewId).select();
    return { data, error };
  }

  if (action === 'update_order') {
    const { data, error } = await supabase.from('orders').update(body.updateData).eq('id', body.orderId).select();
    return { data, error };
  }

  if (action === 'create_product') {
    const { data, error } = await supabase.from('products').insert(body.productData).select();
    return { data, error };
  }

  if (action === 'update_product') {
    const { data, error } = await supabase.from('products').update(body.productData).eq('id', body.productId).select();
    return { data, error };
  }

  if (action === 'update_settings') {
    const { data, error } = await supabase
      .from('site_settings')
      .upsert({ key: body.key, value: body.value }, { onConflict: 'key' });
    return { data, error };
  }

  if (action === 'delete_product') {
    const { data, error } = await supabase.from('products').delete().eq('id', body.productId).select();
    return { data, error };
  }

  if (action === 'delete_all_products') {
    const { data, error } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    return { data, error };
  }

  if (table === 'profiles') {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  }

  if (table === 'orders') {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    return { data: data || [], error };
  }

  return { data: null, error: new Error('Invalid table/action request') };
}
