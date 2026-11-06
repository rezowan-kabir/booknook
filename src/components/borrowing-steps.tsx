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
    <section className="bg-amber-50 dark:bg-stone-900/50 rounded-3xl px-6 sm:px-10 lg:px-16 py-12 lg:py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-3">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-widest uppercase">
            Lending Simplified
          </span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          How Borrowing Works
        </h2>
        <p className="text-base text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
          Three simple steps designed to keep stories circulating freely among readers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {steps.map((step) => (
          <div
            key={step.number}
            className="bg-white dark:bg-stone-800/80 rounded-2xl p-8 text-center border border-stone-200/50 dark:border-stone-700/50 shadow-sm"
          >
            <div className="w-14 h-14 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6">
              <span className="font-serif text-xl font-bold text-amber-700 dark:text-amber-400">
                {step.number}
              </span>
            </div>
            <h3 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 mb-3">
              {step.title}
            </h3>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};