import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCartStore } from '@/stores/cartStore';

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const cartItemsCount = useCartStore((state) => state.items.length);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Shop', path: '/products' },
    { icon: Heart, label: 'Saved', path: '/products?filter=wishlist' },
    { icon: ShoppingBag, label: 'Orders', path: user ? '/orders' : '/auth' },
    { icon: User, label: 'Account', path: user ? '/account' : '/auth' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#e8e3e5] bg-[#fffdfc]/95 pb-safe pt-2 backdrop-blur-md md:hidden">
      <div className="flex h-14 items-center justify-around px-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
                className={`flex h-full w-16 flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-[#a35d70]' : 'text-[#8f878d] hover:text-[#4e484d]'
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? 'fill-[#a35d70]/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
