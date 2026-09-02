"use client";

import React from "react";
import { Star, ShieldCheck, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { useStoreData } from "@/lib/store/useStoreData";
import { toast } from "sonner";

export default function AdminReviewsPage() {
  const { reviews, updateReviewStatus, deleteReview } = useStoreData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
            Client Feedback Moderation
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight mt-1">
            Customer Reviews ({reviews.length})
          </h1>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <strong className="text-white text-sm">{rev.userName}</strong>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {rev.date}
                </span>
                <span
                  className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    rev.status === "approved"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : "bg-rose-500/15 text-rose-400"
                  }`}
                >
                  {rev.status}
                </span>
              </div>

              <div className="flex items-center gap-1 text-gold-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < rev.rating
                        ? "fill-gold-400 text-gold-400"
                        : "text-zinc-700"
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-white ml-1">
                  &ldquo;{rev.title}&rdquo;
                </span>
              </div>

              <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                {rev.comment}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {rev.status !== "approved" && (
                <button
                  onClick={() => {
                    updateReviewStatus(rev.id, "approved");
                    toast.success("Approved review for public display");
                  }}
                  className="px-3 py-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-zinc-950 font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Approve</span>
                </button>
              )}

              {rev.status !== "rejected" && (
                <button
                  onClick={() => {
                    updateReviewStatus(rev.id, "rejected");
                    toast.info("Rejected review");
                  }}
                  className="px-3 py-1.5 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white font-bold text-xs flex items-center gap-1 transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  <span>Reject</span>
                </button>
              )}

              <button
                onClick={() => {
                  deleteReview(rev.id);
                  toast.info("Deleted review");
                }}
                className="p-2 rounded bg-zinc-800 hover:bg-rose-500 text-zinc-400 hover:text-white transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
