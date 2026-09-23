import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useWishlist } from '@/hooks/useWishlist';
import { useProducts } from '@/hooks/useProducts';

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistItems, isLoading: wishlistLoading } = useWishlist();
  const { data: products = [], isLoading: productsLoading } = useProducts();

  const isLoading = wishlistLoading || productsLoading;
  const wishlistProducts = products.filter((p) => wishlistItems.includes(p.id));

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <Heart className="h-16 w-16 mx-auto text-ink-muted mb-4" />
          <h1 className="text-2xl font-bold text-ink mb-4">Sign in to view your wishlist</h1>
          <p className="text-ink-muted mb-6">
            Save your favorite items and access them anytime
          </p>
          <Link to="/auth">
            <Button className="rounded-pill">Sign In</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-8 w-8 text-primary" />
          <h1 className="font-display text-3xl font-bold text-ink">My Wishlist</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-ink-muted mb-4" />
            <h2 className="text-xl font-semibold text-ink mb-2">Your wishlist is empty</h2>
            <p className="text-ink-muted mb-6">
              Start adding items you love to your wishlist
            </p>
            <Link to="/products">
              <Button className="rounded-pill">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-ink-muted mb-6">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
