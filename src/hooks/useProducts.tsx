import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/stores/cartStore';

// Helper to format Supabase snake_case data to frontend camelCase data
const formatProduct = (data: any, flatDiscount?: any): Product => {
  let price = data.price;
  let originalPrice = data.original_price;
  let discountPercentage = data.discount_percentage;

  // Always compute price from originalPrice if a discount is explicitly defined, to ensure consistency
  if (discountPercentage > 0) {
      originalPrice = originalPrice || price;
      price = originalPrice - (originalPrice * (discountPercentage / 100));
  }

  // Apply flat discount if enabled and higher than product's own discount
  if (flatDiscount?.enabled && flatDiscount?.percentage > 0) {
    if (!discountPercentage || flatDiscount.percentage > discountPercentage) {
      discountPercentage = flatDiscount.percentage;
      originalPrice = originalPrice || price;
      price = originalPrice - (originalPrice * (discountPercentage / 100));
    }
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    price,
    originalPrice,
    discountPercentage,
    deliveryFee: data.delivery_fee || 0,
    category: data.category,
    imageUrl: data.image_url || 'https://images.unsplash.com/photo-1594224457860-c3d3a033f6dc?q=80&w=200&auto=format&fit=crop',
    stockQuantity: data.stock_quantity || 0,
    isTopSelling: data.is_top_selling,
    isExclusive: data.is_exclusive,
    isPromotional: data.is_promotional,
    rating: data.rating || 4.5,
    reviewCount: data.review_count || 0,
    unit: data.unit || '1 piece',
  };
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'flat_discount')
        .maybeSingle();
      const flatDiscount = settingsData?.value;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(p => formatProduct(p, flatDiscount));
    },
  });
};

export const useProduct = (id: string | undefined) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: async () => {
      if (!id) return null;
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'flat_discount')
        .maybeSingle();
      const flatDiscount = settingsData?.value;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return formatProduct(data, flatDiscount);
    },
    enabled: !!id,
  });
};
