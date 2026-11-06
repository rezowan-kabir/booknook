"use client";

import React from "react";
import { Clock } from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Browse & Select",
    description:
      "Explore our diverse genres from Fiction to Science. Inspect descriptions, availability, and contributor notes.",
  },
  {
    number: "02",
    title: "One-Click Borrow",
    description:
      "Sign in and confirm your 14-day lending period. The inventory copies decrement in real time.",
  },
  {
    number: "03",
    title: "Read & Return",
    description:
      'Immerse yourself in the story. When finished, hit "Return Book" in My Borrows to restore the copy for the next member.',
  },
];

export const BorrowingSteps: React.FC = () => {
  return (
    <section className="bg-amber-50/60 dark:bg-stone-900/40 rounded-xl px-6 sm:px-10 lg:px-14 py-12 lg:py-16 border border-amber-100/60 dark:border-stone-800">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <div className="inline-flex items-center gap-2 text-amber-800 dark:text-amber-400 mb-2">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            Lending Simplified
          </span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 mb-3">
          How Borrowing Works
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Three simple steps designed to keep stories circulating freely among
          readers without friction.
        </p>
      </div>

      {/* Steps Layout - Natural Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex flex-col">
            {/* Top subtle line accent or step number indicator */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-serif text-2xl font-bold text-amber-700/80 dark:text-amber-500/80">
                {step.number}
              </span>
              <div className="h-px bg-amber-200/60 dark:bg-stone-800 flex-1" />
            </div>

            <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100 mb-2">
              {step.title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
