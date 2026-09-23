import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Clock, CheckCircle, Truck, MapPin, Calendar, AlertCircle, MessageSquare } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/currency';
import { format, addBusinessDays } from 'date-fns';
import { parseAdminNote } from '@/lib/utils';

type OrderStatus = 'pending_verification' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  customer_name: string;
  phone: string;
  shipping_address: string;
  shipping_city: string;
  total_amount: number;
  status: OrderStatus;
  notes: string | null;
  admin_note: string | null;
  created_at: string;
}

interface OrderItem {
  id: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

const statusConfig: Record<OrderStatus, { 
  label: string; 
  color: string; 
  icon: React.ComponentType<{ className?: string }>;
  message: string;
}> = {
  pending_verification: {
    label: 'Payment Verification',
    color: 'bg-orange-500',
    icon: Clock,
    message: 'Your payment is being verified. This usually takes 1-2 hours during business hours.',
  },
  pending: {
    label: 'Pending',
    color: 'bg-yellow-500',
    icon: Clock,
    message: 'Your order is pending confirmation.',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-blue-500',
    icon: CheckCircle,
    message: 'Payment successful! Your order is confirmed and being prepared.',
  },
  shipped: {
    label: 'Shipped',
    color: 'bg-purple-500',
    icon: Truck,
    message: 'Your order is on its way!',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-500',
    icon: CheckCircle,
    message: 'Your order has been delivered. Enjoy!',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-500',
    icon: AlertCircle,
    message: 'This order has been cancelled.',
  },
};

const OrderDetails = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError) throw orderError;
      setOrder(orderData);

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;
      setOrderItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedDelivery = () => {
    if (!order) return null;
    const orderDate = new Date(order.created_at);
    const minDelivery = addBusinessDays(orderDate, 3);
    const maxDelivery = addBusinessDays(orderDate, 5);
    return `${format(minDelivery, 'MMM d')} - ${format(maxDelivery, 'MMM d, yyyy')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-ink mb-4">Order not found</h1>
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen flex flex-col bg-canvas-warm">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <Link to="/">
          <Button variant="ghost" className="mb-6 text-ink-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          {/* Status Banner */}
          <Card className={`mb-6 border border-hairline shadow-card rounded-xl overflow-hidden`}>
            <div className={`${statusInfo.color} p-6 text-foreground`}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-foreground/20 rounded-full">
                  <StatusIcon className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{statusInfo.label}</h1>
                  <p className="opacity-90">{statusInfo.message}</p>
                </div>
              </div>
            </div>
            
            {/* Show delivery date for confirmed/shipped orders */}
            {(order.status === 'confirmed' || order.status === 'shipped') && (
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold text-green-600">{getEstimatedDelivery()}</p>
                  </div>
                </div>
              </CardContent>
            )}

            {/* Pending verification message */}
            {order.status === 'pending_verification' && (
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 animate-pulse" />
                  <div>
                    <p className="font-semibold text-orange-600">Payment is being verified</p>
                    <p className="text-sm text-muted-foreground">
                      We're reviewing your payment screenshot. You'll receive a confirmation soon.
                    </p>
                  </div>
                </div>
              </CardContent>
            )}

            {/* Admin Note for cancelled orders */}
            {order.status === 'cancelled' && order.admin_note && (
              <CardContent className="pt-4">
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-red-600">Reason for Cancellation</p>
                    <p className="text-sm text-muted-foreground mt-1">{order.admin_note}</p>
                  </div>
                </div>
              </CardContent>
            )}

            {/* Admin Note for confirmed orders */}
            {order.status === 'confirmed' && order.admin_note && (
              <CardContent className="pt-0">
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-600">Note from Admin</p>
                    <p className="text-sm text-muted-foreground mt-1">{order.admin_note}</p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Order Details */}
          <Card className="border border-hairline shadow-card rounded-xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-ink">
                <Package className="h-5 w-5 text-primary" />
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-ink-muted">Order ID</p>
                  <p className="font-mono text-sm text-ink">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-ink-muted">Order Date</p>
                  <p className="text-ink">{format(new Date(order.created_at), 'MMM d, yyyy HH:mm')}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-ink-muted mt-0.5" />
                <div>
                  <p className="text-sm text-ink-muted">Shipping Address</p>
                  <p className="font-medium text-ink">{order.customer_name}</p>
                  <p className="text-sm text-ink-secondary">{order.shipping_address}</p>
                  <p className="text-sm text-ink-secondary">{order.shipping_city}</p>
                  <p className="text-sm text-ink-secondary">{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border border-hairline shadow-card rounded-xl">
            <CardHeader>
              <CardTitle className="text-ink">Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-canvas-warm rounded-lg border border-hairline">
                  <div>
                    <p className="font-medium text-ink">{item.product_name}</p>
                    <p className="text-sm text-ink-muted">
                      Qty: {item.quantity} × {formatPrice(item.product_price)}
                    </p>
                  </div>
                  <p className="font-semibold text-ink">{formatPrice(item.product_price * item.quantity)}</p>
                </div>
              ))}

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-ink">Total</span>
                <span className="text-2xl font-bold text-ink">{formatPrice(order.total_amount)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-ink-muted">
              Need help with your order? Contact us at{' '}
              <a href="tel:03705715285" className="text-primary hover:underline">
                0300-1234567
              </a>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetails;