import { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FlatDiscountBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="w-full bg-emerald-500/10 backdrop-blur-md border-b border-emerald-500/20 relative z-50 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 animate-pulse" />
        
        <div className="container mx-auto px-4 py-3 relative">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <p className="text-xs sm:text-sm font-medium text-emerald-100 uppercase tracking-widest text-center">
              <span className="font-bold text-emerald-400">FLAT 30% OFF</span> ON ALL PRODUCTS! USE CODE: <span className="font-bold text-emerald-400">FRESH30</span>
            </p>
          </div>
          
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-200/50 hover:text-emerald-200 transition-colors p-1"
            aria-label="Close banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FlatDiscountBanner;
