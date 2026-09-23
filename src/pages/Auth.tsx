import { useState } from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { GlassCard } from '@/components/ui/react-bits';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  
  return (
    <div className="min-h-screen bg-background relative selection:bg-emerald-500/30 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background pointer-events-none" />
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center py-24 relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 blur-3xl pointer-events-none" />
            
            {/* Tabs */}
            <div className="flex border-b border-foreground/[0.08] mb-8 relative z-10">
              <button
                className={`flex-1 pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'login' ? 'text-emerald-400' : 'text-foreground/40 hover:text-foreground'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Sign In
                {activeTab === 'login' && (
                  <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
              </button>
              <button
                className={`flex-1 pb-4 text-sm font-medium transition-colors relative ${
                  activeTab === 'signup' ? 'text-emerald-400' : 'text-foreground/40 hover:text-foreground'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Create Account
                {activeTab === 'signup' && (
                  <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                )}
              </button>
            </div>

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.div
                    key="login"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex justify-center"
                  >
                    <SignIn 
                      routing="hash" 
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "bg-transparent border-0 shadow-none p-0",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          formButtonPrimary: "glass-button-primary w-full h-12 text-base mt-2 normal-case",
                          formFieldInput: "glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:border-emerald-500/50",
                          formFieldLabel: "text-[10px] uppercase tracking-widest font-bold text-foreground/50 mb-2",
                          footerActionText: "text-foreground/50",
                          footerActionLink: "text-emerald-400 hover:text-emerald-300 font-medium",
                          dividerLine: "bg-foreground/[0.08]",
                          dividerText: "text-foreground/30 text-[10px] uppercase tracking-widest bg-transparent",
                          socialButtonsBlockButton: "glass bg-foreground/[0.02] border-foreground/[0.08] hover:bg-foreground/[0.05] text-foreground h-12",
                          socialButtonsBlockButtonText: "font-medium text-sm text-foreground/80",
                          identityPreviewText: "text-foreground",
                          identityPreviewEditButtonIcon: "text-emerald-400",
                          formFieldInputShowPasswordButton: "text-foreground/40 hover:text-foreground",
                        }
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex justify-center"
                  >
                    <SignUp 
                      routing="hash" 
                      appearance={{
                        elements: {
                          rootBox: "w-full",
                          card: "bg-transparent border-0 shadow-none p-0",
                          headerTitle: "hidden",
                          headerSubtitle: "hidden",
                          formButtonPrimary: "glass-button-primary w-full h-12 text-base mt-2 normal-case",
                          formFieldInput: "glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:border-emerald-500/50",
                          formFieldLabel: "text-[10px] uppercase tracking-widest font-bold text-foreground/50 mb-2",
                          footerActionText: "text-foreground/50",
                          footerActionLink: "text-emerald-400 hover:text-emerald-300 font-medium",
                          dividerLine: "bg-foreground/[0.08]",
                          dividerText: "text-foreground/30 text-[10px] uppercase tracking-widest bg-transparent",
                          socialButtonsBlockButton: "glass bg-foreground/[0.02] border-foreground/[0.08] hover:bg-foreground/[0.05] text-foreground h-12",
                          socialButtonsBlockButtonText: "font-medium text-sm text-foreground/80",
                          identityPreviewText: "text-foreground",
                          identityPreviewEditButtonIcon: "text-emerald-400",
                          formFieldInputShowPasswordButton: "text-foreground/40 hover:text-foreground",
                        }
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </GlassCard>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Auth;
