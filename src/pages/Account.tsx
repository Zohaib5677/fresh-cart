import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { UserProfile } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

// @ts-ignore
import { ProfileCard } from '@/components/ui/react-bits';
import { useAuth } from '@/hooks/useAuth';

const Account = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-24 flex flex-col items-center gap-8">
        <ProfileCard 
          name={user?.email?.split('@')[0] || 'Member Account'} 
          email={user?.email || 'user@example.com'} 
          role="Verified Buyer"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl flex justify-center"
        >
          <UserProfile path="/account" routing="path" />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
