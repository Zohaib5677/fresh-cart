import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import ProductSection from '@/components/home/ProductSection';
import PromoBanner from '@/components/home/PromoBanner';
import { useProducts } from '@/hooks/useProducts';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { data: products = [], isLoading } = useProducts();

  const topSelling = products.filter((product) => product.isTopSelling);
  const exclusive = products.filter((product) => product.isExclusive);
  const promotional = products.filter((product) => product.isPromotional);
  const trending = topSelling.length > 0 ? topSelling : products;

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
        <HeroSection products={products} />

        <CategorySection products={products} />
        
        <ProductSection
          title="Trending right now"
          subtitle="The pieces everyone is adding to their edit"
          products={trending.slice(0, 12)}
          viewAllLink={topSelling.length > 0 ? '/products?filter=top-selling' : '/products'}
          badge="The Vertexo edit"
        />
        
        <PromoBanner products={products} />
        
        {exclusive.length > 0 && (
          <ProductSection
            title="Exclusive edit"
            subtitle="Premium pieces selected for your wardrobe"
            products={exclusive.slice(0, 8)}
            viewAllLink="/products?filter=exclusive"
            badge="Only at Vertexo"
          />
        )}

        {promotional.length > 0 && (
          <ProductSection
            title="Special offers"
            subtitle="Limited-time prices on selected pieces"
            products={promotional.slice(0, 8)}
            viewAllLink="/products?filter=promotional"
            badge="Sale"
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
