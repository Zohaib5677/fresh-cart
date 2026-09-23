import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
// @ts-ignore
import { GlassCard, MagneticButton, FuzzyText } from '@/components/ui/react-bits';

const PromoBanner = () => {
  return (
    <section className="py-20 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Promo 1 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GlassCard className="relative overflow-hidden p-10 flex items-center justify-between gap-8 h-full">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
                  KITCHEN ESSENTIALS
                </span>
                <h3 className="font-display text-3xl text-foreground mb-2 leading-tight">
                  <FuzzyText text="Up to 30% Off" />
                </h3>
                <p className="text-foreground/60 text-sm mb-8 max-w-[200px]">
                  Premium cookware
                </p>
                <MagneticButton>
                  <Link to="/products?category=kitchen" className="glass-button-primary inline-flex items-center">
                    Shop Kitchen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </MagneticButton>
              </div>
                <img 
                  src="https://images.unsplash.com/photo-1584285422892-74c26a67f08b?w=200&h=200&fit=crop" 
                  alt="Kitchen Promo" 
                  className="w-40 h-40 object-contain relative z-10 hidden sm:block drop-shadow-2xl dark:mix-blend-screen mix-blend-multiply opacity-80" 
                />
              </GlassCard>
          </motion.div>

          {/* Promo 2 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GlassCard className="relative overflow-hidden p-10 flex items-center justify-between gap-8 h-full">
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-3">
                  NEW ARRIVALS
                </span>
                <h3 className="font-display text-3xl text-foreground mb-2 leading-tight">
                  <FuzzyText text="Home Decor" />
                </h3>
                <p className="text-foreground/60 text-sm mb-8 max-w-[200px]">
                  Elevate your space
                </p>
                <MagneticButton>
                  <Link to="/products?category=general" className="glass-button-primary inline-flex items-center">
                    Shop Home
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </MagneticButton>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=200&h=200&fit=crop" 
                alt="Home Promo" 
                className="w-40 h-40 object-contain relative z-10 hidden sm:block drop-shadow-2xl dark:mix-blend-screen mix-blend-multiply opacity-80" 
              />
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
