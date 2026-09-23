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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass rounded-none border-b-0 border-x-0 border-t border-foreground/[0.06] bg-background/80 pb-safe pt-2">
      <div className="flex justify-around items-center px-2 h-14">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors ${
                active ? 'text-emerald-400' : 'text-foreground/50 hover:text-foreground/80'
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? 'fill-emerald-400/20' : ''}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
