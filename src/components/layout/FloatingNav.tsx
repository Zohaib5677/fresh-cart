import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

// @ts-ignore
import { BubbleMenu } from '@/components/ui/react-bits';
import { ShoppingCart, Heart, PhoneCall } from 'lucide-react';

const FloatingNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      <BubbleMenu
        items={[
          { label: 'Cart', href: '/cart', icon: <ShoppingCart className="h-5 w-5" /> },
          { label: 'Wishlist', href: '/products?filter=wishlist', icon: <Heart className="h-5 w-5" /> },
          { label: 'Support', href: '/contact', icon: <PhoneCall className="h-5 w-5" /> },
        ]}
      />
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-6 z-40 flex gap-3 pointer-events-auto"
        >
          {!isHome && (
            <>
              <Button
                onClick={() => navigate(-1)}
                size="icon"
                variant="secondary"
                className="rounded-full shadow-lg h-12 w-12 glass bg-background/80 text-foreground border border-foreground/10 hover:bg-emerald-500 hover:text-white transition-all hover:scale-110"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => navigate('/')}
                size="icon"
                className="rounded-full shadow-lg h-12 w-12 bg-emerald-500 text-white hover:bg-emerald-600 transition-all hover:scale-110"
              >
                <Home className="h-5 w-5" />
              </Button>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default FloatingNav;
