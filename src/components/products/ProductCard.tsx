import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart } from 'lucide-react';
// @ts-ignore
import { GlassCard, MagneticButton, GlareHover, ReflectiveCard } from '@/components/ui/react-bits';
import { useCartStore } from '@/stores/cartStore';
import { useWishlist } from '@/hooks/useWishlist';
import type { Database } from '@/integrations/supabase/types';
import { formatPrice } from '@/lib/currency';
import { optimizeImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`, {
      className: 'glass !bg-background/80 !border-emerald-500/30 !text-foreground',
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link
        to={`/product/${product.id}`}
        className="block group h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ReflectiveCard className="h-full flex flex-col relative overflow-hidden group-hover:bg-foreground/[0.05] group-hover:border-foreground/[0.08] group-hover:shadow-lg group-hover:shadow-emerald-500/5 transition-all duration-500">
          <GlareHover className="w-full h-full flex flex-col">
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            {product.isTopSelling && (
              <div className="glass px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground border-foreground/[0.1] bg-foreground/[0.05]">
                Top Selling
              </div>
            )}
            {product.isExclusive && (
              <div className="glass px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                Exclusive
              </div>
            )}
            {product.discountPercentage && (
              <div className="glass px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-400 border-rose-500/20 bg-rose-500/10">
                -{product.discountPercentage}% OFF
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'glass bg-foreground/[0.05] text-foreground/50 hover:text-rose-400 hover:border-rose-500/30'
            }`}
          >
            <motion.div whileTap={{ scale: 0.8 }}>
              <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </motion.div>
          </button>

          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-foreground/[0.02] p-8">
            <motion.img
              src={optimizeImageUrl(product.imageUrl, 400, 60)}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain dark:mix-blend-screen mix-blend-multiply"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
            />
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-2">
              {product.category}
            </div>
            
            <h3 className="font-semibold text-sm text-foreground mb-4 line-clamp-2 leading-snug">
              {product.name}
            </h3>
            
            <div className="mt-auto">
              <div className="flex items-end gap-2 mb-6">
                <span className="text-gradient-accent text-xl font-bold">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-foreground/30 line-through mb-0.5">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              <div onClick={(e) => e.preventDefault()}>
                <MagneticButton>
                  <button
                    onClick={handleAddToCart}
                    disabled={product.stockQuantity === 0}
                    className="w-full glass-button-primary flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                </MagneticButton>
              </div>
            </div>
            </div>
          </GlareHover>
        </ReflectiveCard>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
