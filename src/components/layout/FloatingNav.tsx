import { useLocation } from 'react-router-dom';

// @ts-ignore
import { BubbleMenu } from '@/components/ui/react-bits';
import { ShoppingCart } from 'lucide-react';

const FloatingNav = () => {
  const location = useLocation();

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      <BubbleMenu
        items={[
          { label: 'Cart', href: '/cart', icon: <ShoppingCart className="h-6 w-6" /> },
        ]}
      />
    </>
  );
};

export default FloatingNav;
