import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Package, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
// @ts-ignore
import { GlassCard, MagneticButton } from '@/components/ui/react-bits';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { formatPrice } from '@/lib/currency';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];

const statusColors: Record<string, string> = {
  pending_verification: 'text-amber-400 border-amber-400/20 bg-amber-400/10',
  pending: 'text-amber-400 border-amber-400/20 bg-amber-400/10',
  confirmed: 'text-blue-400 border-blue-400/20 bg-blue-400/10',
  shipped: 'text-purple-400 border-purple-400/20 bg-purple-400/10',
  delivered: 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10',
  cancelled: 'text-rose-400 border-rose-400/20 bg-rose-400/10',
};

const statusLabels: Record<string, string> = {
  pending_verification: 'Verification',
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('admin-data', {
        body: {
          table: 'user_orders',
          userId: user.id,
          userName: user.user_metadata?.full_name || ''
        }
      });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    };

    if (user) {
      fetchOrders();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background pointer-events-none" />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-emerald-500/30 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background pointer-events-none" />
      <Header />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-12 h-12 rounded-full glass bg-foreground/[0.02] flex items-center justify-center text-emerald-400">
              <Package className="h-6 w-6" />
            </div>
            <h1 className="font-display text-4xl text-foreground">Order History</h1>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-400" />
            </div>
          ) : orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-20 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 mb-8 glass rounded-full bg-foreground/[0.02] flex items-center justify-center text-foreground/20">
                <ShoppingBag className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-display text-foreground mb-4">No orders yet</h2>
              <p className="text-foreground/50 mb-8 max-w-md">
                You haven't placed any orders. Start shopping to discover our premium collection.
              </p>
              <MagneticButton>
                <Link to="/products" className="glass-button-primary">
                  Start Shopping
                </Link>
              </MagneticButton>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/orders/${order.id}`} className="block group">
                    <GlassCard className="p-6 transition-colors hover:bg-foreground/[0.05]">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-1">
                            Order Number
                          </div>
                          <div className="font-mono text-foreground text-lg">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </div>
                        </div>
                        <div className={`glass px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] inline-flex items-center justify-center ${statusColors[order.status] || 'text-foreground/50 border-foreground/10 bg-foreground/5'}`}>
                          {statusLabels[order.status] || order.status}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-foreground/[0.06] mb-6">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-1">Date</div>
                          <div className="text-foreground text-sm">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-1">Total Amount</div>
                          <div className="text-gradient-accent font-bold text-lg">
                            {formatPrice(Number(order.total_amount))}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/40 mb-1">Shipping To</div>
                          <div className="text-foreground/70 text-sm line-clamp-1">
                            {order.shipping_city}, {order.shipping_address}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end items-center text-sm font-medium text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;
