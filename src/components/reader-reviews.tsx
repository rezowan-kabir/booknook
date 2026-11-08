"use client";

import React from "react";
import { Quote, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  quote: string;
  initials: string;
  name: string;
  role: string;
}

const reviews: Review[] = [
  {
    id: "1",
    rating: 5,
    quote:
      "BookNook brought back the quiet magic of my hometown reading room. I borrowed 'The Silent Horizon' and couldn't put it down!",
    initials: "CH",
    name: "Clara Higgins",
    role: "Fiction Enthusiast · 14 Borrows",
  },
  {
    id: "2",
    rating: 5,
    quote:
      "Adding my personal engineering and physics books was so easy. Seeing other members borrow them makes sharing knowledge deeply rewarding.",
    initials: "MK",
    name: "Marcus Kim",
    role: "Science Contributor · 8 Books Added",
  },
  {
    id: "3",
    rating: 5,
    quote:
      "The copy inventory tracking and one-click returns are seamless. The clean layout makes finding new historical reads an absolute pleasure.",
    initials: "EN",
    name: "Elena Novak",
    role: "History Reader · 22 Borrows",
  },
];

export const ReaderReviews: React.FC = () => {
  return (
    <section className="py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-2">
            <Quote className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wider uppercase">
              Community Stories
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100">
            Reader Reviews
          </h2>
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-stone-50/50 dark:bg-stone-900/50 p-6 border border-stone-200/80 dark:border-stone-800 rounded-sm flex flex-col justify-between transition-all duration-200 hover:border-stone-300 dark:hover:border-stone-700"
          >
            <div>
              
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-700 text-amber-700 dark:fill-amber-400 dark:text-amber-400"
                  />
                ))}
              </div>

             
              <p className="font-serif text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-6">
                &ldquo;{review.quote}&rdquo;
              </p>
            </div>

            
            <div className="flex items-center gap-3 pt-4 border-t border-stone-200/60 dark:border-stone-800">
              <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center text-stone-700 dark:text-stone-300 text-xs font-medium shrink-0">
                {review.initials}
              </div>
              <div>
                <p className="text-xs font-medium text-stone-900 dark:text-stone-100">
                  {review.name}
                </p>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  {review.role}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
