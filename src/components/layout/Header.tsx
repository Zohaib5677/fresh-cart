import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
// @ts-ignore
import { MagneticButton, ShuffleText } from '@/components/ui/react-bits';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/stores/cartStore';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const cartItemsCount = useCartStore((state) => state.items.length);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'backdrop-blur-xl bg-background/80 border-b border-foreground/[0.06] py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              className="font-display text-2xl font-bold tracking-tight text-gradient"
            >
              <ShuffleText text="SnapCart" />
            </motion.div>
          </Link>

          {/* Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-foreground/40 group-focus-within:text-foreground/80 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search premium products..."
              className="w-full glass bg-foreground/[0.03] border-foreground/[0.08] rounded-full h-10 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:bg-foreground/[0.06] focus:border-foreground/[0.15] transition-all"
            />
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <MagneticButton>
              <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/[0.08] transition-all">
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </MagneticButton>

            <MagneticButton>
              <Link to="/products" className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/[0.08] transition-all">
                <Search className="h-5 w-5 " />
              </Link>
            </MagneticButton>
            
            <MagneticButton>
              <Link to="/products?filter=wishlist" className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/[0.08] transition-all">
                <Heart className="h-5 w-5" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link to={user ? '/account' : '/auth'} className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/[0.08] transition-all">
                <User className="h-5 w-5" />
              </Link>
            </MagneticButton>

            <MagneticButton>
              <Link to={user ? '/cart' : '/auth'} className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/[0.08] transition-all relative">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-500 text-[10px] font-bold text-foreground flex items-center justify-center shadow-lg shadow-emerald-500/50"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </MagneticButton>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center text-foreground/80"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            
            <Link to="/cart" className="w-10 h-10 flex items-center justify-center relative text-foreground/80">
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-500 text-[10px] font-bold text-foreground flex items-center justify-center shadow-lg shadow-emerald-500/50"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-foreground/80"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm glass bg-foreground/[0.02] border-l border-foreground/[0.06] rounded-none rounded-l-3xl p-6 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-display text-xl font-bold text-gradient">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full glass bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.1]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  { icon: Search, label: 'Search', path: '/products' },
                  { icon: Heart, label: 'Wishlist', path: '/products?filter=wishlist' },
                  { icon: User, label: user ? 'My Account' : 'Sign In', path: user ? '/orders' : '/auth' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 glass bg-foreground/[0.03] p-4 rounded-xl hover:bg-foreground/[0.08] transition-colors"
                    >
                      <item.icon className="h-5 w-5 text-emerald-400" />
                      <span className="text-foreground font-medium">{item.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
