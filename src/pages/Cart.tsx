import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { GlassCard, MagneticButton, AnimatedCounter, GlassSurface } from '@/components/ui/react-bits';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/currency';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? (subtotal >= 1000 ? 0 : 150) : 0;
  const total = subtotal + shipping;
  const progressToFreeShipping = Math.min((subtotal / 1000) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col bg-background relative selection:bg-emerald-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background pointer-events-none" />
      <Header />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-10"
          >
            <h1 className="font-display text-4xl text-foreground">Your Cart</h1>
            <span className="glass px-3 py-1 text-sm font-medium text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </motion.div>

          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto"
            >
              <div className="w-24 h-24 mb-8 glass rounded-full bg-foreground/[0.02] flex items-center justify-center text-foreground/20">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-display text-foreground mb-4">Your cart is empty</h2>
              <p className="text-foreground/50 mb-8">
                Looks like you haven't added anything to your cart yet. Discover our premium collection.
              </p>
              <MagneticButton>
                <Link to="/products" className="glass-button-primary">
                  Explore Products
                </Link>
              </MagneticButton>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_400px] gap-12">
              <div className="space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <GlassCard className="p-4 flex gap-6 group hover:bg-foreground/[0.05] transition-colors">
                        <Link to={`/product/${item.product.id}`} className="relative h-24 w-24 rounded-2xl glass bg-foreground/[0.02] overflow-hidden flex-shrink-0 p-2">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-full h-full object-contain mix-blend-screen group-hover:scale-110 transition-transform duration-500"
                          />
                        </Link>
                        
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div className="flex justify-between gap-4">
                            <div>
                              <Link to={`/product/${item.product.id}`} className="font-medium text-foreground hover:text-emerald-400 transition-colors line-clamp-1">
                                {item.product.name}
                              </Link>
                              <div className="text-xs font-bold text-foreground/30 uppercase tracking-widest mt-1">
                                {item.product.category}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gradient-accent">
                                {formatPrice(item.product.price)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center glass rounded-full h-9 w-28 justify-between px-1">
                              <button
                                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-foreground/[0.1] text-foreground transition-colors disabled:opacity-50"
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="font-medium text-foreground text-sm">{item.quantity}</span>
                              <button
                                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-foreground/[0.1] text-foreground transition-colors"
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="w-9 h-9 rounded-full flex items-center justify-center text-foreground/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </GlassCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link to="/products" className="inline-flex items-center text-sm font-medium text-foreground/50 hover:text-emerald-400 transition-colors mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>

              {/* Order Summary */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:sticky lg:top-32 h-fit"
              >
                <GlassSurface className="p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
                  
                  <h3 className="font-display text-2xl text-foreground mb-6">Order Summary</h3>

                  {/* Free Shipping Progress */}
                  <div className="mb-8 p-4 glass bg-foreground/[0.02] border-foreground/[0.05]">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="text-foreground/70 font-medium">Free Shipping Progress</span>
                      <span className="text-emerald-400 font-bold">{Math.round(progressToFreeShipping)}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-foreground/[0.05] rounded-full overflow-hidden mb-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressToFreeShipping}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                      />
                    </div>
                    {subtotal >= 1000 ? (
                      <p className="text-xs text-emerald-400">You've unlocked free shipping!</p>
                    ) : (
                      <p className="text-xs text-foreground/40">
                        Add <span className="text-foreground">Rs. {1000 - subtotal}</span> more for free shipping
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 mb-6 text-sm text-foreground/70">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-foreground">
                        <AnimatedCounter from={0} to={subtotal} format={(val) => `Rs. ${val.toFixed(2)}`} />
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium text-foreground">
                        {shipping === 0 ? <span className="text-emerald-400">Free</span> : `Rs. ${shipping.toFixed(2)}`}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-foreground/[0.08] pt-6 mb-8">
                    <div className="flex justify-between items-end">
                      <span className="text-foreground font-medium">Total</span>
                      <span className="font-display text-3xl font-bold text-gradient-accent">
                        <AnimatedCounter from={0} to={total} format={(val) => `Rs. ${val.toFixed(2)}`} />
                      </span>
                    </div>
                    <p className="text-[10px] text-foreground/40 uppercase tracking-widest mt-2 text-right">
                      Including all taxes
                    </p>
                  </div>

                  <MagneticButton>
                    <Link to="/checkout" className="w-full glass-button-primary flex justify-center items-center h-14 text-base">
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </MagneticButton>
                </GlassSurface>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
