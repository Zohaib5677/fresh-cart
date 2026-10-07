import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface FlatDiscount {
  enabled: boolean;
  percentage: number;
  banner_text: string;
}

const DEFAULT: FlatDiscount = { enabled: false, percentage: 0, banner_text: '' };

export const useFlatDiscount = () => {
  const { data } = useQuery<FlatDiscount>({
    queryKey: ['flat-discount'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', 'flat_discount')
        .maybeSingle();
      if (error || !data?.value) return DEFAULT;
      return data.value as unknown as FlatDiscount;
    },
    staleTime: 1000 * 60 * 5, // cache 5 min
  });

  const discount = data ?? DEFAULT;

  /** Apply flat discount to a price and return { displayPrice, originalPrice, badge } */
  const applyDiscount = (price: number, existingOriginal?: number | null) => {
    if (!discount.enabled || discount.percentage <= 0) {
      return { displayPrice: price, originalPrice: existingOriginal ?? null, flatBadge: null };
    }
    const discounted = Math.round(price * (1 - discount.percentage / 100));
    return {
      displayPrice: discounted,
      originalPrice: existingOriginal ?? price,
      flatBadge: `${discount.percentage}% OFF`,
    };
  };

  return { discount, applyDiscount };
};
