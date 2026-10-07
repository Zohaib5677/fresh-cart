import { useState, useEffect } from 'react';
import { Pencil, Trash2, Search, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  product?: { name: string };
  profiles?: { full_name: string | null; email?: string };
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [formData, setFormData] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, product_id, user_id, rating, comment, created_at,
          profiles:profile_id(full_name),
          product:products(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data as any[] || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (review: Review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      comment: review.comment || '',
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingReview) return;
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          rating: formData.rating,
          comment: formData.comment || null,
        })
        .eq('id', editingReview.id);

      if (error) throw error;
      toast.success('Review updated successfully');
      setIsDialogOpen(false);
      fetchReviews();
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Review deleted successfully');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(r => 
    r.comment?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.profiles?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-normal text-[#242024]">Product Reviews</h2>
          <p className="text-xs text-[#716b70] mt-0.5">Manage customer feedback, star ratings, and comments</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9a9298]" />
            <Input
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 w-64 rounded-xl border-[#d8cfd3] bg-white text-sm text-[#3f393e] placeholder:text-[#b1a8ad] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
            />
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-[#e8e3e5] bg-[#fffdfc] p-0 text-[#3f393e] shadow-2xl overflow-hidden">
          <DialogHeader className="border-b border-[#e8e3e5] bg-[#f4f0ed] px-6 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a35d70]">
              Review Moderation
            </p>
            <DialogTitle className="mt-1 font-serif text-2xl font-normal text-[#242024]">
              Edit Review
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 px-6 py-6">
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                Rating (1 to 5 Stars)
              </Label>
              <Input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="h-11 rounded-xl border-[#d8cfd3] bg-white text-[#3f393e] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70]">
                Comment Text
              </Label>
              <Textarea
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="rounded-xl border-[#d8cfd3] bg-white text-[#3f393e] focus-visible:border-[#a35d70] focus-visible:ring-[#a35d70]/20"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="h-11 rounded-xl border-[#d8cfd3] text-[#3f393e] hover:bg-[#f4f0ed]"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="h-11 rounded-xl bg-[#242024] font-medium text-white hover:bg-[#383238] transition-colors shadow-sm px-6"
              >
                Update Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="rounded-2xl border border-[#e8e3e5] bg-[#fffdfc] shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f8f5f3] border-b border-[#e8e3e5]">
                <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Product</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Customer</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Rating</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Comment</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4">Date</TableHead>
                <TableHead className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#716b70] h-12 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.map((review) => (
                <TableRow key={review.id} className="border-b border-[#e8e3e5]/70 hover:bg-[#faf7f5]/70 transition-colors">
                  <TableCell className="px-4 py-3.5 font-medium text-[#242024] max-w-[200px] truncate">
                    {review.product?.name || 'Unknown Product'}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-sm text-[#5f595d]">
                    {review.profiles?.full_name || 'Anonymous User'}
                  </TableCell>
                  <TableCell className="px-4 py-3.5">
                    <div className="flex items-center gap-1 text-amber-500 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 w-fit">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{review.rating}.0</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-xs text-[#3f393e] max-w-[300px] truncate">
                    {review.comment || <span className="text-[#9a9298] italic">No comment text</span>}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-xs text-[#716b70]">
                    {format(new Date(review.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="px-4 py-3.5 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(review)}
                        className="h-8 w-8 rounded-lg text-[#5f595d] hover:text-[#242024] hover:bg-[#f4f0ed]"
                        title="Edit Review"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        className="h-8 w-8 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        title="Delete Review"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredReviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-[#716b70] py-12">
                    No reviews found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReviews;
