import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCartStore, type Product } from '@/stores/cartStore';
import { formatPrice } from '@/lib/currency';
import { optimizeImageUrl } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <article className="group relative min-w-0">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[0.9] overflow-hidden bg-[#eee9eb]">
          {product.discountPercentage ? (
            <span className="absolute left-2 top-2 z-10 bg-[#c97685] px-2 py-1 text-[9px] font-semibold text-white">-{product.discountPercentage}%</span>
          ) : null}
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
        <div className="pt-1">
          {/* <p className="text-[9px] uppercase tracking-[0.14em] text-[#9a9298]">{product.category}</p> */}
          <h3 className="line-clamp-1 text-[11px] font-medium leading-4 text-[#3f393e]">{product.name}</h3>
          <div className="mt-0.5 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="text-xs font-semibold text-[#c0394f]">{formatPrice(product.price)}</span>
              {product.originalPrice ? <span className="text-[9px] text-[#9a9298] line-through">{formatPrice(product.originalPrice)}</span> : null}
            </div>
            <div className="flex shrink-0 items-center gap-1 text-[9px] text-[#9a9298]" aria-label={`${product.rating.toFixed(1)} out of 5 stars, ${product.reviewCount} reviews`}>
              <Star className="h-2.5 w-2.5 fill-[#d69a3a] text-[#d69a3a]" />
              <span className="font-medium text-[#6f666c]">{product.rating.toFixed(1)}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default ProductCard;
