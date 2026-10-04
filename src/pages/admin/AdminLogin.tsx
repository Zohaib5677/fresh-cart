import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, signIn, loading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        // User is logged in but not admin - show message
        toast.error('You do not have admin access');
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
    } catch (err) {
      if (err instanceof z.ZodError) {
        toast.error(err.errors[0].message);
        setIsLoading(false);
        return;
      }
    }

    const { error } = await signIn(email, password);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password');
      } else {
        toast.error(error.message);
      }
      setIsLoading(false);
      return;
    }

    // The useEffect will handle the admin check and redirect
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="admin-shell min-h-screen bg-[#fffdfc] flex flex-col">
      {/* Header */}
      <div className="p-4">
        <Link to="/" className="inline-flex items-center gap-2 text-[#716b70] hover:text-[#a35d70] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="admin-login-card backdrop-blur">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="font-serif text-3xl text-[#242024]">Admin Portal</CardTitle>
              <CardDescription className="text-[#9a9298]">Sign in to access the admin dashboard</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#4e484d]">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9298]" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-[#f4f0ed] border-[#d8cfd3] text-[#3f393e] placeholder:text-[#9a9298] focus-visible:ring-[#a35d70]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#4e484d]">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9298]" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-[#f4f0ed] border-[#d8cfd3] text-[#3f393e] placeholder:text-[#9a9298] focus-visible:ring-[#a35d70]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9298] hover:text-[#a35d70]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/auth" className="text-sm text-[#9a9298] hover:text-[#a35d70] transition-colors">
                  ← Customer Login
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
