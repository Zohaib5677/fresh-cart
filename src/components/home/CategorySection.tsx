import { Link } from 'react-router-dom';
import type { Product } from '@/stores/cartStore';

interface CategorySectionProps {
  products: Product[];
}

const CategorySection = ({ products }: CategorySectionProps) => {
  const moods = Array.from(
    new Map(
      products
        .filter((product) => product.imageUrl)
        .map((product) => [product.category, product])
    ).values()
  ).slice(0, 8);

  return (
    <section className="bg-[#fffdfc] py-8 md:py-8">
      <div className="mx-auto max-w-[1440px] px-2 md:px-4">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a35d70]">Shop by mood</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <h2 className="font-serif text-3xl text-[#242024] md:text-4xl">Find your <em className="text-[#a35d70]">everyday</em></h2>
          <Link to="/products" className="hidden text-[10px] uppercase tracking-[0.12em] text-[#5f595d] md:block">View all →</Link>
        </div>
        {moods.length > 0 ? (
          <div className="mt-8 flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
            {moods.map((product) => (
              <Link key={product.category} to={`/products?category=${encodeURIComponent(product.category)}`} className="group min-w-[74px] text-center md:min-w-[112px]">
                <div className="mx-auto aspect-square w-[74px] overflow-hidden rounded-full bg-[#eee9eb] md:w-[112px]"><img src={product.imageUrl} alt={product.category} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" /></div>
                <span className="mt-3 block text-[10px] capitalize text-[#484147]">{product.category}</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-[#777077]">New collections are arriving soon.</p>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
