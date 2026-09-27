import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCartStore, type Product } from '@/stores/cartStore';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/currency';
import { optimizeImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className="group relative min-w-0">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[0.78] overflow-hidden bg-[#eee9eb]">
          {product.discountPercentage ? (
            <span className="absolute left-2 top-2 z-10 bg-[#c97685] px-2 py-1 text-[9px] font-semibold text-white">-{product.discountPercentage}%</span>
          ) : null}
          <button
            type="button"
            onClick={handleWishlist}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            className={`absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 transition-colors ${isWishlisted ? 'text-[#c97685]' : 'text-[#716b70] hover:text-[#c97685]'}`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <img
            src={optimizeImageUrl(product.imageUrl, 600, 75)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            aria-label={product.stockQuantity > 0 ? `Add ${product.name} to cart` : `${product.name} is out of stock`}
            className="absolute bottom-2 left-2 right-2 flex h-9 items-center justify-center gap-2 bg-white/95 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#242024] opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60 max-sm:opacity-100"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            {product.stockQuantity > 0 ? 'Add to bag' : 'Out of stock'}
          </button>
        </div>
        <div className="pt-3">
          <p className="text-[9px] uppercase tracking-[0.14em] text-[#9a9298]">{product.category}</p>
          <h3 className="mt-1 line-clamp-2 min-h-[2.5rem] text-xs font-medium leading-5 text-[#3f393e]">{product.name}</h3>
          <div className="mt-1 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#c05f70]">{formatPrice(product.price)}</span>
              {product.originalPrice ? <span className="text-[10px] text-[#9a9298] line-through">{formatPrice(product.originalPrice)}</span> : null}
            </div>
            <span className="flex items-center gap-1 text-[10px] text-[#777077]"><Star className="h-3 w-3 fill-[#c99446] text-[#c99446]" /> {product.rating.toFixed(1)} ({product.reviewCount})</span>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
