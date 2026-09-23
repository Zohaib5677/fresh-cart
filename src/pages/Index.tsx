import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import ProductSection from '@/components/home/ProductSection';
import PromoBanner from '@/components/home/PromoBanner';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

const BRANDS = [
  { name: 'Haier', color: 'bg-blue-900/40 text-blue-300 border-blue-700/50' },
  { name: 'Dawlance', color: 'bg-red-900/40 text-red-300 border-red-700/50' },
  { name: 'PEL', color: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' },
  { name: 'Orient', color: 'bg-amber-900/40 text-amber-300 border-amber-700/50' },
  { name: 'Kenwood', color: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50' },
  { name: 'National', color: 'bg-green-900/40 text-green-300 border-green-700/50' },
  { name: 'Dell', color: 'bg-sky-900/40 text-sky-300 border-sky-700/50' },
  { name: 'WestPoint', color: 'bg-slate-800 text-slate-300 border-slate-700' },
];

const Index = () => {
  const { data: products = [], isLoading } = useProducts();

  const topSelling = products.filter((product) => product.isTopSelling);
  const exclusive = products.filter((product) => product.isExclusive);
  const promotional = products.filter((product) => product.isPromotional);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />

        {/* Clean Static Brand Badges */}
        <section className="py-6 bg-slate-900/40 border-y border-slate-800/60">
          <div className="container mx-auto px-4 flex flex-wrap items-center justify-center gap-3">
            {BRANDS.map((brand) => (
              <span
                key={brand.name}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase border shadow-sm ${brand.color}`}
              >
                {brand.name}
              </span>
            ))}
          </div>
        </section>

        <CategorySection />
        
        <ProductSection
          title="Top Selling"
          subtitle="Our customers' favorites"
          products={topSelling}
          viewAllLink="/products?filter=top-selling"
          badge="Popular"
        />
        
        <PromoBanner />
        
        <ProductSection
          title="Exclusive Products"
          subtitle="Premium quality you won't find elsewhere"
          products={exclusive}
          viewAllLink="/products?filter=exclusive"
          badge="Premium"
        />
        
        <ProductSection
          title="Special Offers"
          subtitle="Limited time deals you don't want to miss"
          products={promotional}
          viewAllLink="/products?filter=promotional"
          badge="Sale"
        />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
