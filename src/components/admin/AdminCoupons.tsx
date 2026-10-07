import { useState } from 'react';
import { Plus, Trash2, Edit, Tag, Percent, Search, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: string;
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  used_count: number | null;
  is_active: boolean | null;
  expires_at: string | null;
  created_at: string;
}

const AdminCoupons = () => {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: 0,
    max_uses: '',
    is_active: true,
    expires_at: '',
  });

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Coupon[];
    },
  });

  const saveCoupon = useMutation({
    mutationFn: async () => {
      const payload = {
        code: formData.code.toUpperCase().trim(),
        description: formData.description || null,
        discount_type: formData.discount_type,
        discount_value: formData.discount_value,
        min_order_amount: formData.min_order_amount || null,
        max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
        is_active: formData.is_active,
        expires_at: formData.expires_at || null,
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(payload)
          .eq('id', editingCoupon.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('coupons').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success(editingCoupon ? 'Coupon updated successfully' : 'Coupon created successfully');
      resetForm();
    },
    onError: (error) => {
      console.error('Error saving coupon:', error);
      toast.error('Failed to save coupon');
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      toast.success('Coupon deleted');
    },
    onError: () => {
      toast.error('Failed to delete coupon');
    },
  });

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: 0,
      max_uses: '',
      is_active: true,
      expires_at: '',
    });
    setEditingCoupon(null);
    setIsDialogOpen(false);
  };

  const openEditDialog = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order_amount: coupon.min_order_amount || 0,
      max_uses: coupon.max_uses?.toString() || '',
      is_active: coupon.is_active ?? true,
      expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
    });
    setIsDialogOpen(true);
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (coupon.description && coupon.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top bar with title, search, and action button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-normal text-[#242024]">Coupon Codes</h2>
          <p className="text-xs text-[#716b70] mt-0.5">Manage promotional discount codes and special offers</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9298]" />
            <Input
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-60 rounded-xl border-[#d8cfd3] bg-white text-sm text-[#3f393e] placeholder:text-[#b1a8ad] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()} className="h-10 rounded-xl bg-[#242024] hover:bg-[#383238] text-white px-4 font-medium shadow-sm transition-colors">
                <Plus className="h-4 w-4 mr-2" />
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl border-[#e8e3e5] bg-[#fffdfc] p-0 text-[#3f393e] shadow-2xl">
              <DialogHeader className="border-b border-[#e8e3e5] bg-[#f4f0ed] px-6 py-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a35d70]">
                  {editingCoupon ? 'Coupon Management' : 'Promotion & Discounts'}
                </p>
                <DialogTitle className="mt-1 font-serif text-2xl font-normal text-[#242024]">
                  {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </DialogTitle>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveCoupon.mutate();
                }}
                className="space-y-5 px-6 py-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                      Coupon Code *
                    </Label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SAVE20"
                      className="h-11 rounded-xl border-[#d8cfd3] bg-white font-mono font-bold tracking-wider text-[#242024] placeholder:text-[#b1a8ad] placeholder:font-normal focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                      Discount Type *
                    </Label>
                    <Select
                      value={formData.discount_type}
                      onValueChange={(v) => setFormData({ ...formData, discount_type: v })}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-[#d8cfd3] bg-white text-[#3f393e] focus:ring-[#a35d70]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-[#e8e3e5] bg-[#fffdfc] text-[#3f393e]">
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (₨)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                    Description
                  </Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g. Get 20% off on your order"
                    className="h-11 rounded-xl border-[#d8cfd3] bg-white text-[#3f393e] placeholder:text-[#b1a8ad] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                      Discount Value {formData.discount_type === 'percentage' ? '(%)' : '(₨)'} *
                    </Label>
                    <Input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                      className="h-11 rounded-xl border-[#d8cfd3] bg-white text-[#3f393e] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
                      required
                      min={0}
                      max={formData.discount_type === 'percentage' ? 100 : undefined}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                      Min Order Amount (₨)
                    </Label>
                    <Input
                      type="number"
                      value={formData.min_order_amount}
                      onChange={(e) => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) || 0 })}
                      className="h-11 rounded-xl border-[#d8cfd3] bg-white text-[#3f393e] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
                      min={0}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                      Max Uses (optional)
                    </Label>
                    <Input
                      type="number"
                      value={formData.max_uses}
                      onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                      placeholder="Unlimited"
                      className="h-11 rounded-xl border-[#d8cfd3] bg-white text-[#3f393e] placeholder:text-[#b1a8ad] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
                      min={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                      Expires At
                    </Label>
                    <Input
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                      className="h-11 rounded-xl border-[#d8cfd3] bg-white text-[#3f393e] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-[#e8e3e5] bg-[#f9f7f6] p-4">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium text-[#242024]">Active Status</Label>
                    <p className="text-xs text-[#716b70]">Allow customers to apply this coupon code</p>
                  </div>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <Button
                    type="submit"
                    disabled={saveCoupon.isPending}
                    className="h-11 flex-1 rounded-xl bg-[#242024] font-medium text-white hover:bg-[#383238] transition-colors shadow-sm"
                  >
                    {saveCoupon.isPending
                      ? 'Saving...'
                      : editingCoupon
                      ? 'Update Coupon'
                      : 'Create Coupon'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="h-11 rounded-xl border-[#d8cfd3] text-[#3f393e] hover:bg-[#f4f0ed]"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Coupons Table Card */}
      <Card className="rounded-2xl border border-[#e8e3e5] bg-[#fffdfc] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a35d70]"></div>
            </div>
          ) : filteredCoupons.length === 0 ? (
            <div className="text-center py-12 text-[#716b70]">
              <Tag className="h-10 w-10 mx-auto text-[#b1a8ad] mb-3" />
              <p className="font-medium text-[#3f393e]">No coupons found</p>
              <p className="text-xs text-[#9a9298] mt-1">
                {searchQuery ? 'Try matching a different coupon code' : 'Click "Add Coupon" to create your first promotion code.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f8f5f3] border-b border-[#e8e3e5]">
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Code</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Discount</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Min Order</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Usage</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Expiry</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Status</TableHead>
                  <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => {
                  const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date();
                  return (
                    <TableRow key={coupon.id} className="border-b border-[#e8e3e5]/70 hover:bg-[#faf7f5]/70 transition-colors">
                      <TableCell className="px-4 py-3.5">
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider text-[#242024] bg-[#f4f0ed] px-2.5 py-1 rounded-lg border border-[#e3dadd]">
                            <Tag className="h-3.5 w-3.5 text-[#a35d70]" />
                            {coupon.code}
                          </span>
                          {coupon.description && (
                            <p className="text-xs text-[#716b70] max-w-xs truncate">{coupon.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-medium text-[#242024]">
                          {coupon.discount_type === 'percentage' ? (
                            <>
                              <Percent className="h-4 w-4 text-[#a35d70]" />
                              <span>{coupon.discount_value}% OFF</span>
                            </>
                          ) : (
                            <>
                              <span className="font-semibold text-[#a35d70]">₨</span>
                              <span>{coupon.discount_value} OFF</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-sm text-[#5f595d]">
                        {coupon.min_order_amount ? `₨${coupon.min_order_amount.toLocaleString()}` : 'No minimum'}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-sm text-[#5f595d]">
                        <span className="font-medium text-[#242024]">{coupon.used_count || 0}</span>
                        {coupon.max_uses ? (
                          <span className="text-xs text-[#9a9298]"> / {coupon.max_uses}</span>
                        ) : (
                          <span className="text-xs text-[#9a9298]"> (unlimited)</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-[#5f595d]">
                        {coupon.expires_at ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-[#9a9298]" />
                            <span>{format(new Date(coupon.expires_at), 'MMM d, yyyy')}</span>
                          </div>
                        ) : (
                          <span className="text-[#9a9298]">Never</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3.5">
                        {isExpired ? (
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
                            Expired
                          </Badge>
                        ) : coupon.is_active ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-[#f4f0ed] text-[#716b70] border-[#e3dadd] rounded-full px-2.5 py-0.5 text-xs font-medium">
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-[#5f595d] hover:text-[#242024] hover:bg-[#f4f0ed]"
                            onClick={() => openEditDialog(coupon)}
                            title="Edit Coupon"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete coupon "${coupon.code}"?`)) {
                                deleteCoupon.mutate(coupon.id);
                              }
                            }}
                            title="Delete Coupon"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCoupons;

