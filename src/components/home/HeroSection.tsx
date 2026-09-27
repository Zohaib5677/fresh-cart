import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Product } from '@/stores/cartStore';

interface HeroSectionProps {
  products: Product[];
}

const HeroSection = ({ products }: HeroSectionProps) => {
  const editorialProducts = products.filter((product) => product.imageUrl).slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (editorialProducts.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % editorialProducts.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [editorialProducts.length]);

  const activeProduct = editorialProducts[activeIndex];
  const showNext = () => setActiveIndex((activeIndex + 1) % editorialProducts.length);
  const showPrevious = () => setActiveIndex((activeIndex - 1 + editorialProducts.length) % editorialProducts.length);

  return (
    <section className="hero-editorial pt-40 md:pt-36">
      <div className="mx-auto w-full">
        {/* <div className="flex min-h-[340px] flex-col justify-center bg-[#d8c5ee] p-7 md:min-h-[430px] md:p-10">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#72577e]">✣ Vertexo trends</p>
          <h1 className="max-w-[260px] font-serif text-5xl leading-[0.92] text-[#201b22] md:text-6xl">New energy.<br /><em>New you.</em></h1>
          <p className="mt-5 max-w-[220px] text-xs leading-relaxed text-[#584c60]">Curated looks for every version of you.</p>
          <Link to="/products" className="mt-7 inline-flex w-fit bg-[#252126] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-0.5">Shop the edit <span className="ml-3">→</span></Link>
        </div> */}
        {activeProduct ? (
          <div className="relative h-[28vh] min-h-[200px] w-full overflow-hidden bg-[#d9e7e3] md:h-[36vh] md:min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, scale: 1.04, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute inset-0"
              >
                <Link to={`/product/${activeProduct.id}`} className="group block h-full">
                  <img src={activeProduct.imageUrl} alt={activeProduct.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 pt-24 text-white md:p-10 md:pt-32">
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/70">{activeIndex === 0 ? 'Trend alert' : activeIndex === 1 ? 'The edit' : 'Just dropped'}</p>
                    <h2 className="mt-1 font-serif text-3xl md:text-5xl">{activeProduct.category}</h2>
                    <p className="mt-1 text-xs text-white/75 md:text-sm">{activeProduct.name}</p>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {editorialProducts.length > 1 && (
              <>
                <button type="button" onClick={showPrevious} aria-label="Previous banner" className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#242024] shadow-lg transition-transform hover:scale-105 md:left-8"><ArrowLeft className="h-4 w-4" /></button>
                <button type="button" onClick={showNext} aria-label="Next banner" className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#242024] shadow-lg transition-transform hover:scale-105 md:right-8"><ArrowRight className="h-4 w-4" /></button>
                <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm md:bottom-8">
                  {editorialProducts.map((product, index) => (
                    <button key={product.id} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show banner ${index + 1}`} className={`h-2.5 w-2.5 rounded-full border border-white transition-all ${index === activeIndex ? 'scale-125 bg-white' : 'bg-transparent'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex h-[38vh] min-h-[260px] items-center justify-center bg-[#b9d6d4] p-8 text-center md:h-[50vh] md:min-h-[420px]"><p className="font-serif text-3xl text-[#214341]">Your next everyday edit starts here.</p></div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
