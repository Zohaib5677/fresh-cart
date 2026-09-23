import { useState } from 'react';
import { Star, Trash2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
  } | null;
}

interface ProductReviewsProps {
  productId: string;
}

const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false 
}: { 
  rating: number; 
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onRatingChange?.(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-colors`}
        >
          <Star
            className={`h-5 w-5 ${
              star <= (hoverRating || rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          product_id,
          user_id,
          rating,
          comment,
          created_at,
          profiles (
            full_name
          )
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });

  // Check if user already reviewed
  const userReview = reviews.find((r) => {
      if (r.user_id === user?.id) return true;
      try {
          const parsed = JSON.parse(r.comment || '{}');
          if (parsed.clerkUserId === user?.id) return true;
      } catch { return false; }
      return false;
  });

  // Submit review mutation
  const submitReview = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Must be logged in');
      
      // Get profile id
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const token = await (window as any).Clerk?.session?.getToken() || '';
      const reviewData = {
        product_id: productId,
        profile_id: profile?.id || null,
        rating: newRating,
        comment: JSON.stringify({
            text: newComment.trim() || null,
            clerkUserId: user.id
        })
      };

      const { data, error } = await supabase.functions.invoke('admin-data', {
          body: {
              action: 'create_review',
              reviewData
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      setNewComment('');
      setNewRating(5);
      toast.success('Review submitted successfully!');
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    },
  });

  // Delete review mutation
  const deleteReview = useMutation({
    mutationFn: async (reviewId: string) => {
      const token = await (window as any).Clerk?.session?.getToken() || '';
      const { data, error } = await supabase.functions.invoke('admin-data', {
          body: {
              action: 'delete_review',
              reviewId,
              userId: user?.id
          },
          headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      toast.success('Review deleted');
    },
    onError: (error) => {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitReview.mutateAsync();
    setIsSubmitting(false);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6">
      <Card className="border-hairline shadow-card rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            {reviews.length > 0 && (
              <div className="flex items-center gap-2 text-base font-normal">
                <StarRating rating={Math.round(averageRating)} readonly />
                <span className="text-ink-muted">
                  {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Review Form */}
          {user && !userReview ? (
            <form onSubmit={handleSubmit} className="space-y-4 p-5 bg-canvas-warm rounded-lg border border-hairline">
              <h4 className="font-medium">Write a Review</h4>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Your Rating</label>
                <StarRating rating={newRating} onRatingChange={setNewRating} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Your Review (optional)</label>
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience with this product..."
                  rows={3}
                  maxLength={500}
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="rounded-pill">
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </form>
          ) : !user ? (
            <div className="p-4 bg-canvas-warm rounded-lg text-center">
              <p className="text-ink-muted">
                Please <a href="/auth" className="text-primary hover:underline">sign in</a> to leave a review
              </p>
            </div>
          ) : userReview ? (
            <div className="p-4 bg-primary-subtle rounded-lg border border-primary/20 text-center">
              <p className="text-sm text-ink-muted">You've already reviewed this product</p>
            </div>
          ) : null}

          {/* Reviews List */}
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-ink-muted py-8">
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex gap-4 p-5 border border-hairline-soft rounded-lg"
                >
                  <Avatar>
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-ink">
                          {review.profiles?.full_name || 'Anonymous User'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={review.rating} readonly />
                          <span className="text-xs text-ink-muted">
                            {format(new Date(review.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      {(isAdmin || review.user_id === user?.id || (() => {
                          try {
                             const parsed = JSON.parse(review.comment || '{}');
                             return parsed.clerkUserId === user?.id;
                          } catch { return false; }
                      })()) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => deleteReview.mutate(review.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {review.comment && (() => {
                        let parsedText = review.comment;
                        try {
                           const parsed = JSON.parse(review.comment);
                           if (parsed && typeof parsed === 'object') {
                              parsedText = parsed.text;
                           }
                        } catch(e) {}
                        
                        if (!parsedText) return null;
                        
                        return (
                          <p className="mt-2 text-sm text-ink-secondary">
                            {parsedText}
                          </p>
                        )
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductReviews;
