import { useState } from 'react';
import { Tag, X, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
}

interface CouponInputProps {
  subtotal: number;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
}

const CouponInput = ({ subtotal, appliedCoupon, onApplyCoupon }: CouponInputProps) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    
    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase().trim())
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast.error('Invalid coupon code');
        return;
      }

      // Check expiry
      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast.error('This coupon has expired');
        return;
      }

      // Check usage limit
      if (data.max_uses && data.used_count >= data.max_uses) {
        toast.error('This coupon has reached its usage limit');
        return;
      }

      // Check minimum order amount
      if (data.min_order_amount && subtotal < data.min_order_amount) {
        toast.error(`Minimum order amount is ₨${data.min_order_amount}`);
        return;
      }

      onApplyCoupon(data as Coupon);
      toast.success('Coupon applied successfully!');
      setCode('');
    } catch (error) {
      console.error('Error validating coupon:', error);
      toast.error('Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    onApplyCoupon(null);
    toast.success('Coupon removed');
  };

  const calculateDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return Math.round(subtotal * (coupon.discount_value / 100));
    }
    return coupon.discount_value;
  };

  if (appliedCoupon) {
    return (
      <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/20">
              <Check className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="font-medium text-foreground">{appliedCoupon.code}</p>
              <p className="text-sm text-muted-foreground">
                {appliedCoupon.discount_type === 'percentage' 
                  ? `${appliedCoupon.discount_value}% off`
                  : `₨${appliedCoupon.discount_value} off`}
                {' - '}You save ₨{calculateDiscount(appliedCoupon)}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Tag className="h-4 w-4" />
        Have a coupon code?
      </label>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <Button 
          onClick={handleApply} 
          disabled={isValidating || !code.trim()}
          variant="outline"
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </Button>
      </div>
    </div>
  );
};

export default CouponInput;
