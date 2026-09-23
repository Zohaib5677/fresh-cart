import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
// @ts-ignore
import { GradualBlur } from '@/components/ui/react-bits';

const banners = [
  {
    id: 1,
    title: "Independence Day Sale",
    subtitle: "Flat 70% Off Today",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=60&w=600&auto=format&fit=crop",
    link: "/products?filter=promotional",
    color: "from-blue-600/80 to-purple-600/80"
  },
  {
    id: 2,
    title: "Exclusive Kitchen Setup",
    subtitle: "Premium cookware collection",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=60&w=600&auto=format&fit=crop",
    link: "/products?category=kitchen",
    color: "from-emerald-600/80 to-teal-600/80"
  },
  {
    id: 3,
    title: "Fresh Dairy Daily",
    subtitle: "Straight from the farm",
    image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?q=60&w=600&auto=format&fit=crop",
    link: "/products?category=dairy",
    color: "from-orange-500/80 to-red-500/80"
  }
];

const HeroSection = () => {
  return (
    <section className="pt-24 pb-8 w-full overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {banners.map((banner) => (
            <Link 
              key={banner.id} 
              to={banner.link}
              className="relative shrink-0 w-[85vw] md:w-[600px] h-[200px] md:h-[300px] snap-center rounded-3xl overflow-hidden group"
            >
              <img 
                src={banner.image} 
                alt={banner.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.color} mix-blend-multiply opacity-60`} />
              
              {/* Replacing gradient with GradualBlur for a premium text backdrop */}
              <div className="absolute bottom-0 left-0 right-0 h-32">
                <GradualBlur className="w-full h-full" />
              </div>
              
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex flex-row justify-between items-end z-20">
                <div>
                  <h3 className="text-white/80 font-medium tracking-wider uppercase text-xs md:text-sm mb-2">
                    {banner.subtitle}
                  </h3>
                  <h2 className="text-white font-display text-2xl md:text-4xl font-bold">
                    {banner.title}
                  </h2>
                </div>
                <div className="glass bg-white/10 border-white/20 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md whitespace-nowrap hidden sm:block">
                  Shop Now
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;