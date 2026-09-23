import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useProducts } from '@/hooks/useProducts';
import { categories } from '@/data/products'; // Keep categories static for now or fetch later
import { Loader2 } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { formatPrice } from '@/lib/currency';
// @ts-ignore
import { LineSidebar, PillNav, Masonry } from '@/components/ui/react-bits';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'best-selling';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading } = useProducts();
  const { wishlistItems } = useWishlist();

  const [explorerCategory, setExplorerCategory] = useState(categories[0]?.id || 'dairy');

  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');
  const queryParam = searchParams.get('search');

  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );

  // Sync state with URL parameter changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryParam]);

  const [priceRange, setPriceRange] = useState([0, 30000]);
  const [showDiscounted, setShowDiscounted] = useState(false);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (queryParam) {
      const q = queryParam.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    // Special filters
    if (filterParam === 'top-selling') {
      filtered = filtered.filter((p) => p.isTopSelling);
    } else if (filterParam === 'exclusive') {
      filtered = filtered.filter((p) => p.isExclusive);
    } else if (filterParam === 'promotional') {
      filtered = filtered.filter((p) => p.isPromotional);
    } else if (filterParam === 'wishlist') {
      filtered = filtered.filter((p) => wishlistItems.includes(p.id));
    }

    // Price filter
    filtered = filtered.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Discounted filter
    if (showDiscounted) {
      filtered = filtered.filter((p) => p.discountPercentage);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'best-selling':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }

    return filtered;
  }, [selectedCategories, priceRange, showDiscounted, sortBy, filterParam, queryParam, products, wishlistItems]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 30000]);
    setShowDiscounted(false);
    setSearchParams({});
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
              />
              <span className="text-sm">
                {category.icon} {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold text-ink uppercase tracking-wider mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={30000}
          step={500}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-ink-muted">
          <span>₨{priceRange[0]}</span>
          <span>₨{priceRange[1]}</span>
        </div>
      </div>

      {/* Discounted */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <Checkbox
            checked={showDiscounted}
            onCheckedChange={(checked) => setShowDiscounted(checked as boolean)}
          />
          <span className="text-sm">Only discounted items</span>
        </label>
      </div>

      {/* Clear filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full rounded-pill border-hairline text-ink-muted hover:text-ink hover:border-ink">
        Clear All Filters
      </Button>
    </div>
  );

  const isExploringCategories = !categoryParam && !queryParam && !filterParam;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 pt-32">
        {isExploringCategories ? (
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 bg-foreground/[0.02] rounded-3xl border border-foreground/[0.08] overflow-hidden min-h-[70vh]">
            {/* Line Sidebar for desktop / Pill Nav for mobile */}
            <div className="hidden md:block">
              <LineSidebar
                items={categories.map(c => ({ id: c.id, name: `${c.icon} ${c.name}`, count: products.filter(p => p.category === c.id).length }))}
                activeItem={explorerCategory}
                onItemSelect={(id: string) => setExplorerCategory(id)}
              />
            </div>

            <div className="md:hidden p-4 overflow-x-auto">
              <PillNav
                items={categories.map(c => ({ id: c.id, label: `${c.icon} ${c.name}` }))}
                active={explorerCategory}
                onSelect={(id: string) => setExplorerCategory(id)}
              />
            </div>
            
            {/* Right Pane (Products Grid) */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="font-display text-xl text-foreground">{categories.find(c => c.id === explorerCategory)?.name}</h2>
                 <Button onClick={() => setSearchParams({ category: explorerCategory })} className="bg-emerald-500 hover:bg-emerald-600 text-background rounded-full text-xs h-8 px-4">
                   View All
                 </Button>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {products.filter(p => p.category === explorerCategory).slice(0, 12).map(p => (
                   <Link key={p.id} to={`/product/${p.id}`} className="cursor-pointer group flex flex-col items-center gap-2 p-2.5 rounded-2xl glass hover:border-emerald-500/30 transition-all">
                     <div className="w-full aspect-square bg-foreground/[0.03] rounded-xl overflow-hidden border border-foreground/[0.06] p-2 flex items-center justify-center">
                       <img src={p.imageUrl} alt={p.name} className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                     </div>
                     <span className="text-[11px] font-medium text-center text-foreground line-clamp-2">{p.name}</span>
                     <span className="text-xs font-bold text-emerald-500">{formatPrice(p.price)}</span>
                   </Link>
                 ))}
                 
                 {products.filter(p => p.category === explorerCategory).length === 0 && (
                   <div className="col-span-full text-center py-10 text-foreground/40 text-sm">
                     No products found in this category.
                   </div>
                 )}
               </div>
            </div>
          </div>
        ) : (
          <>
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-ink mb-2">
            {filterParam === 'top-selling'
              ? 'Top Selling Products'
              : filterParam === 'exclusive'
              ? 'Exclusive Products'
              : filterParam === 'promotional'
              ? 'Special Offers'
              : categoryParam
              ? categories.find((c) => c.id === categoryParam)?.name || 'Products'
              : queryParam
              ? `Search Results for "${queryParam}"`
              : 'All Products'}
          </h1>
          <p className="text-ink-muted">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-24 bg-white rounded-xl p-6 border border-hairline shadow-card">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="h-5 w-5 text-primary" />
                <h2 className="font-semibold text-lg">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-hairline">
              {/* Active filters */}
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map((catId) => (
                  <Badge
                    key={catId}
                    className="cursor-pointer bg-primary-subtle text-primary border border-primary/20 rounded-pill text-xs px-3 py-1.5 hover:bg-primary/20"
                    onClick={() => toggleCategory(catId)}
                  >
                    {categories.find((c) => c.id === catId)?.name} ×
                  </Badge>
                ))}
                {showDiscounted && (
                  <Badge
                    className="cursor-pointer bg-primary-subtle text-primary border border-primary/20 rounded-pill text-xs px-3 py-1.5 hover:bg-primary/20"
                    onClick={() => setShowDiscounted(false)}
                  >
                    Discounted ×
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden rounded-pill border-hairline">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                {/* Sort */}
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-44 rounded-sm border-hairline h-9 text-sm">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="best-selling">Best Selling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products grid */}
            {isLoading ? (
              <div className="flex justify-center p-16 w-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <p className="text-ink-muted text-lg mb-6">
                  No products found matching your filters
                </p>
                <Button variant="outline" onClick={clearFilters} className="rounded-pill border-hairline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
        </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Products;
