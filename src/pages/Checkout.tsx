import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Check, Copy, Upload, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// @ts-ignore
import { GlassCard, MagneticButton } from '@/components/ui/react-bits';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/currency';

const steps = [
  { id: 1, name: 'Shipping' },
  { id: 2, name: 'Payment' },
  { id: 3, name: 'Review' },
];

const JAZZCASH_ACCOUNT = {
  number: '03705715285',
  name: 'Muhammad Saad',
};

const EASYPAISA_ACCOUNT = {
  number: '03429302636',
  name: 'Muhammad Saad',
};

const SADAPAY_ACCOUNT = {
  number: '03705715285',
  name: 'Muhammad Saad',
};

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa' | 'sadapay'>('cod');
  const [tid, setTid] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, navigate, isSubmitting]);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 0 ? (subtotal >= 1000 ? 0 : 150) : 0;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setPaymentScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.phone || !formData.address || !formData.city) {
        toast.error('Please fill in all required shipping fields', { className: 'glass !bg-background/80 !border-rose-500/30 !text-foreground' });
        return;
      }
    }
    if (currentStep === 2) {
      if (paymentMethod !== 'cod') {
        if (!tid && !paymentScreenshot) {
          toast.error('Please provide a Transaction ID (TID) or upload payment screenshot proof', { className: 'glass !bg-background/80 !border-rose-500/30 !text-foreground' });
          return;
        }
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!', { className: 'glass !bg-background/80 !border-emerald-500/30 !text-foreground' });
  };

  const placeOrder = async () => {
    if (items.length === 0) return;
    setIsSubmitting(true);

    try {
      let paymentScreenshotUrl: string | null = null;

      // 1. Upload payment screenshot if attached
      if (paymentScreenshot) {
        const fileExt = paymentScreenshot.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(fileName, paymentScreenshot);

        if (uploadError) {
          console.warn('Screenshot upload warning:', uploadError);
        } else if (uploadData) {
          paymentScreenshotUrl = fileName;
        }
      }

      // 2. Prepare Order DB Payload according to schema
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();
      const fullAddress = `${formData.address}${formData.zipCode ? `, Zip: ${formData.zipCode}` : ''}`;
      const verifiedUserId = user?.id || null;

      const orderPayload = {
        customer_name: fullName,
        phone: formData.phone,
        shipping_address: fullAddress,
        shipping_city: formData.city,
        total_amount: total,
        status: paymentMethod === 'cod' ? 'pending' : 'pending_verification',
        payment_screenshot_url: paymentScreenshotUrl,
        user_id: isUuid(verifiedUserId || '') ? verifiedUserId : null,
        notes: `Email: ${formData.email || 'N/A'} | Payment: ${paymentMethod.toUpperCase()}${tid ? ` | TID: ${tid}` : ''}${verifiedUserId ? ` [clerk:${verifiedUserId}]` : ''}`
      };

      let order: { id: string } | null = null;

      // 3. Insert into `orders` table
      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select('id')
        .single();

      if (orderError) {
        // Fallback for RLS/Clerk UUID error: retry with user_id: null
        const { data: fallbackOrder, error: fallbackError } = await supabase
          .from('orders')
          .insert({
            ...orderPayload,
            user_id: null
          })
          .select('id')
          .single();

        if (fallbackError) throw fallbackError;
        order = fallbackOrder;
      } else {
        order = createdOrder;
      }

      if (!order?.id) {
        throw new Error('Order creation failed. Please try again.');
      }

      // 4. Insert into `order_items` table
      const orderItemsToInsert = items.map((item) => ({
        order_id: order!.id,
        product_id: isUuid(item.product.id) ? item.product.id : null,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert);

      if (itemsError) {
        // Delete orphaned order if items fail
        await supabase.from('orders').delete().eq('id', order.id);
        throw itemsError;
      }

      // 5. Best-effort order notification invocation
      try {
        await supabase.functions.invoke('send-order-notification', {
          body: { orderId: order.id, type: 'new_order' }
        });
      } catch (e) {
        console.log('Notification trigger non-blocking error:', e);
      }

      // 6. Complete Order
      clearCart();
      toast.success('Order placed successfully!', { className: 'glass !bg-background/80 !border-emerald-500/30 !text-foreground' });
      navigate(`/orders/${order.id}`, { replace: true });
    } catch (error: any) {
      console.error('Order placement error:', error);
      toast.error(error.message || 'Failed to place order. Please try again.', { className: 'glass !bg-background/80 !border-rose-500/30 !text-foreground' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-emerald-500/30 flex flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-background to-background pointer-events-none" />

      <header className="relative z-10 glass rounded-none border-b border-foreground/[0.06] bg-background/60 py-4">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-gradient">
            SnapCart
          </Link>
          <div className="flex items-center gap-2 text-foreground/50 text-sm font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            Secure Checkout
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10 py-12 lg:py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          
          <div className="mb-12 max-w-2xl mx-auto">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-foreground/[0.08] -translate-y-1/2 z-0" />
              <div className="absolute top-1/2 left-0 h-[2px] bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)] -translate-y-1/2 z-0 transition-all duration-500" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
              
              {steps.map((step) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= step.id ? 'bg-emerald-500 text-foreground shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'glass bg-background text-foreground/40'}`}>
                    {currentStep > step.id ? <Check className="h-5 w-5" /> : <span className="font-bold text-sm">{step.id}</span>}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold ${currentStep >= step.id ? 'text-emerald-400' : 'text-foreground/40'}`}>{step.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_400px] gap-12">
            
            {/* Main Form Area */}
            <div className="space-y-6">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <GlassCard className="p-8">
                      <h2 className="text-2xl font-display text-foreground mb-8">Shipping Information</h2>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">First Name *</label>
                          <input name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Last Name *</label>
                          <input name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Email Address *</label>
                          <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Phone Number *</label>
                          <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Street Address *</label>
                          <input name="address" value={formData.address} onChange={handleInputChange} className="w-full glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">City *</label>
                          <input name="city" value={formData.city} onChange={handleInputChange} className="w-full glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:outline-none focus:border-emerald-500/50" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Zip Code</label>
                          <input name="zipCode" value={formData.zipCode} onChange={handleInputChange} className="w-full glass bg-foreground/[0.02] border-foreground/[0.08] rounded-xl h-12 px-4 text-foreground focus:outline-none focus:border-emerald-500/50" />
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <GlassCard className="p-8">
                      <h2 className="text-2xl font-display text-foreground mb-8">Payment Method</h2>
                      <div className="grid gap-4 mb-8">
                        {[
                          { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when you receive' },
                          { id: 'jazzcash', name: 'JazzCash', desc: 'Instant mobile transfer' },
                          { id: 'easypaisa', name: 'EasyPaisa', desc: 'Instant mobile transfer' },
                          { id: 'sadapay', name: 'SadaPay', desc: 'Bank transfer' }
                        ].map((method) => (
                          <div 
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as any)}
                            className={`glass p-4 cursor-pointer transition-all ${paymentMethod === method.id ? 'bg-emerald-500/10 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'hover:bg-foreground/[0.05]'}`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-emerald-400' : 'border-foreground/30'}`}>
                                {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full" />}
                              </div>
                              <div>
                                <div className="font-bold text-foreground text-sm">{method.name}</div>
                                <div className="text-[10px] text-foreground/50 uppercase tracking-widest">{method.desc}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <AnimatePresence>
                        {paymentMethod !== 'cod' && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="glass bg-foreground/[0.02] p-6 mb-6 border-emerald-500/20 relative rounded-2xl">
                              <h3 className="text-emerald-400 font-bold mb-4 text-sm uppercase tracking-wider">Transfer Details</h3>
                              
                              <div className="space-y-4 mb-6">
                                {paymentMethod === 'jazzcash' && (
                                  <>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-foreground/50">Account Title:</span>
                                      <span className="text-foreground font-medium">{JAZZCASH_ACCOUNT.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-foreground/50">JazzCash Number:</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-emerald-400 font-bold text-lg">{JAZZCASH_ACCOUNT.number}</span>
                                        <button onClick={() => copyToClipboard(JAZZCASH_ACCOUNT.number)} className="p-1 hover:bg-foreground/10 rounded"><Copy className="h-4 w-4 text-foreground/50" /></button>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {paymentMethod === 'easypaisa' && (
                                  <>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-foreground/50">Account Title:</span>
                                      <span className="text-foreground font-medium">{EASYPAISA_ACCOUNT.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-foreground/50">EasyPaisa Number:</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-emerald-400 font-bold text-lg">{EASYPAISA_ACCOUNT.number}</span>
                                        <button onClick={() => copyToClipboard(EASYPAISA_ACCOUNT.number)} className="p-1 hover:bg-foreground/10 rounded"><Copy className="h-4 w-4 text-foreground/50" /></button>
                                      </div>
                                    </div>
                                  </>
                                )}
                                {paymentMethod === 'sadapay' && (
                                  <>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-foreground/50">Account Title:</span>
                                      <span className="text-foreground font-medium">{SADAPAY_ACCOUNT.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-foreground/50">SadaPay IBAN / Phone:</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-emerald-400 font-bold text-lg">{SADAPAY_ACCOUNT.number}</span>
                                        <button onClick={() => copyToClipboard(SADAPAY_ACCOUNT.number)} className="p-1 hover:bg-foreground/10 rounded"><Copy className="h-4 w-4 text-foreground/50" /></button>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Transaction ID (TID)</label>
                                  <input value={tid} onChange={(e) => setTid(e.target.value)} placeholder="e.g. 0123456789" className="w-full glass bg-background/40 border-emerald-500/30 rounded-xl h-12 px-4 text-foreground focus:outline-none focus:border-emerald-400" />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/50">Upload Payment Proof (Screenshot)</label>
                                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                  <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-400/60 p-4 rounded-xl text-center cursor-pointer glass hover:bg-foreground/[0.04] transition-all flex flex-col items-center justify-center gap-2"
                                  >
                                    {previewUrl ? (
                                      <div className="flex items-center gap-3">
                                        <img src={previewUrl} alt="Screenshot proof" className="w-16 h-16 object-cover rounded-lg border border-emerald-400" />
                                        <div className="text-left">
                                          <div className="text-xs font-bold text-emerald-400">Screenshot Uploaded</div>
                                          <div className="text-[10px] text-foreground/50">Click to replace</div>
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <Upload className="h-6 w-6 text-emerald-400" />
                                        <div className="text-xs text-foreground/80 font-medium">Click to select screenshot image</div>
                                        <div className="text-[10px] text-foreground/40">PNG, JPG up to 5MB</div>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <GlassCard className="p-8">
                      <h2 className="text-2xl font-display text-foreground mb-8">Review Order</h2>
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Shipping Details</h3>
                          <div className="glass bg-foreground/[0.02] p-4 text-sm text-foreground/70 leading-relaxed rounded-xl">
                            <span className="font-medium text-foreground">{formData.firstName} {formData.lastName}</span><br />
                            {formData.address}, {formData.city} {formData.zipCode}<br />
                            {formData.phone}<br />
                            {formData.email}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Payment Method</h3>
                          <div className="glass bg-foreground/[0.02] p-4 text-sm text-foreground/70 rounded-xl">
                            <span className="font-medium text-foreground uppercase">{paymentMethod}</span>
                            {paymentMethod !== 'cod' && (
                              <div className="mt-1 flex flex-col gap-1">
                                {tid && <div>TID: <span className="text-emerald-400 font-mono">{tid}</span></div>}
                                {paymentScreenshot && <div className="text-xs text-emerald-400 flex items-center gap-1"><ImageIcon className="h-3 w-3" /> Screenshot proof attached</div>}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-4">Items ({items.length})</h3>
                          <div className="space-y-3">
                            {items.map((item) => (
                              <div key={item.product.id} className="flex gap-4 items-center glass p-3 rounded-xl">
                                <div className="h-14 w-14 glass bg-foreground/[0.02] rounded-lg overflow-hidden p-1 flex items-center justify-center">
                                  <img src={item.product.imageUrl} alt={item.product.name} className="max-h-full max-w-full object-contain" />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</div>
                                  <div className="text-xs text-foreground/40">Qty: {item.quantity} × {formatPrice(item.product.price)}</div>
                                </div>
                                <div className="text-sm font-bold text-foreground">
                                  {formatPrice(item.product.price * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:sticky lg:top-24 h-fit">
              <GlassCard className="p-8">
                <h3 className="font-display text-xl text-foreground mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6 text-sm text-foreground/70">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-medium text-foreground">
                      {shipping === 0 ? <span className="text-emerald-400">Free</span> : formatPrice(shipping)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-foreground/[0.08] pt-6 mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-foreground font-medium">Total</span>
                    <span className="font-display text-3xl font-bold text-gradient-accent">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {currentStep > 1 && (
                    <button
                      onClick={handleBack}
                      disabled={isSubmitting}
                      className="h-14 px-6 glass rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/[0.1] transition-colors disabled:opacity-50"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                  )}
                  
                  <MagneticButton className="flex-1">
                    <button
                      onClick={currentStep === steps.length ? placeOrder : handleNext}
                      disabled={isSubmitting}
                      className="w-full h-14 glass-button-primary flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-foreground/30 border-t-white rounded-full animate-spin" />
                      ) : currentStep === steps.length ? (
                        <>Place Order <Check className="ml-1 h-5 w-5" /></>
                      ) : (
                        <>Continue <ArrowRight className="ml-1 h-5 w-5" /></>
                      )}
                    </button>
                  </MagneticButton>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;