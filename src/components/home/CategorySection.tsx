import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// @ts-ignore
import { TiltedCard, ReflectiveCard, ShinyText } from '@/components/ui/react-bits';
import { Coffee, Sofa, UtensilsCrossed, Shirt, Sparkles, Smartphone } from 'lucide-react';

const categories = [
  { id: 'kitchen', name: 'Kitchen', icon: Coffee, desc: 'Cookware & Gadgets', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
  { id: 'home', name: 'Home', icon: Sofa, desc: 'Decor & Furniture', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
  { id: 'dining', name: 'Dining', icon: UtensilsCrossed, desc: 'Tableware & Cutlery', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
  { id: 'style', name: 'Style', icon: Shirt, desc: 'Fashion Essentials', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { id: 'beauty', name: 'Beauty', icon: Sparkles, desc: 'Personal Care', color: 'from-rose-500/20 to-red-500/20', border: 'border-rose-500/30' },
  { id: 'tech', name: 'Tech', icon: Smartphone, desc: 'Smart Accessories', color: 'from-indigo-500/20 to-violet-500/20', border: 'border-indigo-500/30' },
];

const CategorySection = () => {
  return (
    <section className="py-16 relative z-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 border border-emerald-500/20 mb-3"
          >
            Explore Collections
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display text-3xl md:text-4xl text-foreground font-bold"
          >
            <ShinyText text="Shop by Category" />
          </motion.h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat, idx) => {
            const IconComp = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link to={`/products?category=${cat.id}`} className="block group">
                  <TiltedCard>
                    <ReflectiveCard className={`p-6 flex flex-col items-center text-center justify-center gap-3 bg-gradient-to-b ${cat.color} backdrop-blur-xl border ${cat.border} rounded-2xl group-hover:scale-105 transition-all duration-300 shadow-xl`}>
                      <div className="p-3.5 rounded-2xl bg-background/80 text-emerald-400 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-colors shadow-md">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm group-hover:text-emerald-400 transition-colors">{cat.name}</h3>
                        <p className="text-[11px] text-foreground/50 mt-0.5">{cat.desc}</p>
                      </div>
                    </ReflectiveCard>
                  </TiltedCard>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
