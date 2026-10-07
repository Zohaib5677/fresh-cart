import { useLocation } from 'react-router-dom';

// @ts-ignore
import { BubbleMenu } from '@/components/ui/react-bits';
import { Package } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const FloatingNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <div className="hidden md:block">
      <BubbleMenu
        items={[
          { label: 'Orders', href: user ? '/orders' : '/auth', icon: <Package className="h-6 w-6" /> },
        ]}
      />
    </div>
  );
};

export default FloatingNav;
