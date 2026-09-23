import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
// @ts-ignore
import { MagneticButton, TextPressure } from '@/components/ui/react-bits';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background relative selection:bg-emerald-500/30 flex flex-col overflow-hidden">
      {/* Particle background effect simulated with blur spheres */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-20 relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="text-center"
        >
            <TextPressure 
              text="404" 
              className="text-[150px] md:text-[200px] font-display font-black leading-none text-foreground/20 select-none relative"
            />
          
          <div className="-mt-16 md:-mt-24 relative z-10">
            <h2 className="text-3xl md:text-5xl font-display text-foreground mb-6">Lost in Space</h2>
            <p className="text-foreground/50 text-lg mb-10 max-w-md mx-auto">
              The page you are looking for has drifted into the void. Let's get you back to our collection.
            </p>
            
            <div className="flex justify-center">
              <MagneticButton>
                <Link to="/" className="glass-button-primary h-14 px-8 text-base inline-flex items-center">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Return Home
                </Link>
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
