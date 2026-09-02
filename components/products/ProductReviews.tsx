"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, ThumbsUp, MessageSquarePlus, X } from "lucide-react";
import { ProductReview } from "@/types";
import { useStoreData } from "@/lib/store/useStoreData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: string;
  productName: string;
  rating: number;
  reviewsCount: number;
}

export function ProductReviews({
  productId,
  productName,
  rating,
  reviewsCount,
}: ProductReviewsProps) {
  const { reviews, addReview } = useStoreData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [userName, setUserName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});

  const productReviews = reviews.filter(
    (r) => r.productId === productId && r.status === "approved"
  );

  const totalReviews = productReviews.length || reviewsCount || 1;
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = productReviews.filter((r) => r.rating === stars).length;
    const percentage = Math.round((count / Math.max(productReviews.length, 1)) * 100);
    return { stars, count, percentage };
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !title.trim() || !comment.trim()) {
      toast.error("Please fill in all review fields");
      return;
    }

    const reviewObj: ProductReview = {
      id: `rev-${Date.now()}`,
      productId,
      userName: userName.trim(),
      rating: newRating,
      title: title.trim(),
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
      verifiedPurchase: true,
      helpfulCount: 0,
      status: "approved",
    };

    addReview(reviewObj);
    toast.success("Thank you! Your verified review has been published.");
    setIsModalOpen(false);
    setUserName("");
    setTitle("");
    setComment("");
  };

  const handleHelpful = (reviewId: string) => {
    if (helpfulVoted[reviewId]) return;
    setHelpfulVoted((prev) => ({ ...prev, [reviewId]: true }));
    toast.success("Thank you for your feedback!");
  };

  return (
    <div className="space-y-8">
      {/* Top Rating Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-border">
        {/* Overall Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border">
          <span className="font-serif text-5xl font-black text-foreground">
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-2 text-gold-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-gold-500 text-gold-500"
                    : "text-zinc-300 dark:text-zinc-700"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500">
            Based on {totalReviews} Verified Client Reviews
          </span>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-2 py-2 md:px-4">
          {ratingDistribution.map((item) => (
            <div key={item.stars} className="flex items-center gap-3 text-xs">
              <span className="w-8 text-right font-medium text-zinc-500">
                {item.stars} ★
              </span>
              <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage || (item.stars === 5 ? 80 : 10)}%` }}
                />
              </div>
              <span className="w-8 text-zinc-400 text-right">
                {item.count || (item.stars === 5 ? 8 : 1)}
              </span>
            </div>
          ))}
        </div>

        {/* Write a review trigger */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-t md:border-t-0 md:border-l border-border">
          <p className="font-serif text-sm font-bold text-foreground">
            Own this piece?
          </p>
          <p className="text-xs text-zinc-500 mt-1 mb-4">
            Share your experience with the GLAMSTEP community.
          </p>
          <Button
            variant="gold"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2"
          >
            <MessageSquarePlus className="h-4 w-4" />
            <span>Write a Review</span>
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4 divide-y divide-border/60">
        {productReviews.length > 0 ? (
          productReviews.map((review) => (
            <div key={review.id} className="pt-4 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 font-bold text-xs flex items-center justify-center">
                    {review.userName[0]}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-foreground">
                      {review.userName}
                    </h5>
                    {review.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-zinc-400">{review.date}</span>
              </div>

              <div className="flex items-center gap-1 text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < review.rating
                        ? "fill-gold-500 text-gold-500"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
              </div>

              <h6 className="text-xs font-bold text-foreground">{review.title}</h6>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {review.comment}
              </p>

              <div className="flex items-center gap-4 pt-1">
                <button
                  onClick={() => handleHelpful(review.id)}
                  disabled={helpfulVoted[review.id]}
                  className={`text-[11px] flex items-center gap-1 text-zinc-400 hover:text-gold-500 transition-colors ${
                    helpfulVoted[review.id] ? "text-gold-500 font-bold" : ""
                  }`}
                >
                  <ThumbsUp className="h-3 w-3" />
                  <span>
                    Helpful ({review.helpfulCount + (helpfulVoted[review.id] ? 1 : 0)})
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-zinc-500 text-xs">
            No customer reviews yet. Be the first to review this product!
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Write a Verified Review
                </h3>
                <p className="text-xs text-zinc-500">{productName}</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-zinc-400 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Star Rating Picker */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                  Your Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-gold-500 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= newRating
                            ? "fill-gold-500 text-gold-500"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-foreground ml-2">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              <Input
                label="Your Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Vikramaditya Roy"
                required
              />

              <Input
                label="Review Headline / Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Exceptional craftsmanship and fit"
                required
              />

              <Textarea
                label="Your Detailed Review"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like the most about this item? Materials, fit, daily experience..."
                rows={4}
                required
              />

              <div className="pt-2 flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="gold" className="flex-1">
                  Submit Review
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
