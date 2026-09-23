import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Minus, Plus, ShoppingCart, Heart, Share2, Truck, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { GlassCard, TiltEffect, AnimatedTabs, MagneticButton } from '@/components/ui/react-bits';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductReviews from '@/components/products/ProductReviews';

import { useProducts, useProduct } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { useWishlist } from '@/hooks/useWishlist';
import { toast } from 'sonner';
import { formatPrice } from '@/lib/currency';
import { optimizeImageUrl } from '@/lib/utils';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading: productLoading } = useProduct(id);
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  
  const addItem = useCartStore((state) => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (productLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-display text-foreground mb-6">Product Not Found</h1>
          <MagneticButton>
            <Link to="/products" className="glass-button-primary inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Link>
          </MagneticButton>
        </main>
        <Footer />
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success(`${product.name} added to cart`, {
      className: 'glass !bg-background/80 !border-emerald-500/30 !text-foreground',
    });
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-emerald-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background pointer-events-none" />
      <Header />

      <main className="flex-1 pt-24 relative z-10">
        <div className="container mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] text-foreground/40 uppercase tracking-widest font-bold mb-12">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-foreground transition-colors">Gallery</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} className="hover:text-foreground transition-colors">
              {product.category}
            </Link>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <TiltEffect>
                <div className="aspect-square glass bg-foreground/[0.02] rounded-3xl flex items-center justify-center p-12 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <img
                    src={optimizeImageUrl(product.imageUrl, 600, 65)}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow-2xl dark:mix-blend-screen mix-blend-multiply relative z-10"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                    {product.isExclusive && (
                      <span className="glass px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border-emerald-500/20 bg-emerald-500/10">
                        Exclusive
                      </span>
                    )}
                  </div>
                </div>
              </TiltEffect>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col pt-4"
            >
              <div className="glass inline-flex px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50 mb-6 border-foreground/[0.1] self-start">
                {product.category}
              </div>

              <h1 className="font-display text-4xl lg:text-5xl text-foreground leading-[1.1] mb-6">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-amber-500 text-amber-500'
                          : 'fill-white/10 text-foreground/10'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">{product.rating}</span>
                <span className="text-sm text-foreground/40">({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-bold text-gradient-accent">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-foreground/30 line-through mb-1">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <GlassCard className="p-6 mb-8 bg-foreground/[0.02]">
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-foreground/[0.06]">
                  <span className="text-sm text-foreground/60">Quantity</span>
                  <div className="flex items-center glass rounded-full h-10 w-32 justify-between px-2">
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/[0.1] text-foreground transition-colors"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-medium text-foreground">{quantity}</span>
                    <button
                      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-foreground/[0.1] text-foreground transition-colors"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <MagneticButton className="flex-1">
                    <button
                      className="w-full glass-button-primary h-12 flex justify-center items-center gap-2"
                      onClick={handleAddToCart}
                      disabled={product.stockQuantity === 0}
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Add to Cart
                    </button>
                  </MagneticButton>
                  <MagneticButton>
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${
                        isWishlisted ? 'glass bg-rose-500/20 text-rose-400 border-rose-500/30' : 'glass hover:bg-foreground/[0.1] text-foreground/70 hover:text-rose-400'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                  </MagneticButton>
                </div>
              </GlassCard>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 flex items-center gap-4">
                  <Truck className="h-5 w-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-foreground mb-0.5">Free Delivery</div>
                    <div className="text-[10px] text-foreground/50">On orders above Rs.500</div>
                  </div>
                </div>
                <div className="glass p-4 flex items-center gap-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-foreground mb-0.5">Secure Checkout</div>
                    <div className="text-[10px] text-foreground/50">100% Protected</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="max-w-4xl mx-auto mb-32">
            <div className="flex border-b border-foreground/[0.08] mb-8">
              <button
                className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
                  activeTab === 'description' ? 'text-emerald-400' : 'text-foreground/40 hover:text-foreground'
                }`}
                onClick={() => setActiveTab('description')}
              >
                Description
                {activeTab === 'description' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
              </button>
              <button
                className={`pb-4 px-6 text-sm font-medium transition-colors relative ${
                  activeTab === 'reviews' ? 'text-emerald-400' : 'text-foreground/40 hover:text-foreground'
                }`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviewCount})
                {activeTab === 'reviews' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'description' ? (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-foreground/70 leading-relaxed"
                >
                  <p className="mb-8">{product.description}</p>
                  
                  <h3 className="font-display text-2xl text-foreground mb-6">Specifications</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <GlassCard className="p-4 flex justify-between">
                      <span className="text-foreground/40 text-sm">Weight/Quantity</span>
                      <span className="font-medium text-foreground text-sm">{product.unit}</span>
                    </GlassCard>
                    <GlassCard className="p-4 flex justify-between">
                      <span className="text-foreground/40 text-sm">Category</span>
                      <span className="font-medium text-foreground text-sm capitalize">{product.category}</span>
                    </GlassCard>
                    <GlassCard className="p-4 flex justify-between">
                      <span className="text-foreground/40 text-sm">Stock Available</span>
                      <span className="font-medium text-foreground text-sm">{product.stockQuantity} units</span>
                    </GlassCard>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <ProductReviews productId={product.id} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="pt-20 border-t border-foreground/[0.08]">
              <h2 className="font-display text-4xl text-foreground mb-10 text-center">
                More from this collection
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Floating Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 z-40 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 pb-safe">
        <MagneticButton>
          <button
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
            className="w-full glass-button-primary h-14 text-lg"
          >
            Add to Cart - {formatPrice(product.price)}
          </button>
        </MagneticButton>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
