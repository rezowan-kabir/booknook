"use client";

import React from "react";
import {
  Compass,
  Feather,
  Atom,
  Landmark,
  Smile,
  Layers,
  BookOpen,
  ArrowRight,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  volumeCount: number;
  description: string;
}

const categories: Category[] = [
  {
    id: "fiction",
    name: "Fiction",
    icon: <Feather className="w-4 h-4 text-stone-600 dark:text-stone-400" />,
    volumeCount: 2,
    description:
      "Immersive literary novels, coastal mysteries, and character-driven dramas.",
  },
  {
    id: "science",
    name: "Science",
    icon: <Atom className="w-4 h-4 text-stone-600 dark:text-stone-400" />,
    volumeCount: 2,
    description:
      "Quantum physics, cosmology, astrophysics, robotics, and biomimicry.",
  },
  {
    id: "history",
    name: "History",
    icon: <Landmark className="w-4 h-4 text-stone-600 dark:text-stone-400" />,
    volumeCount: 1,
    description:
      "Ancient civilizations, maritime empires, and classic diplomacy.",
  },
  {
    id: "kids",
    name: "Kids",
    icon: <Smile className="w-4 h-4 text-stone-600 dark:text-stone-400" />,
    volumeCount: 2,
    description:
      "Colorful picture books, early readers, and magical adventures.",
  },
  {
    id: "other",
    name: "Other",
    icon: <Layers className="w-4 h-4 text-stone-600 dark:text-stone-400" />,
    volumeCount: 1,
    description: "Art, philosophy, travel essays, poetry, and rare finds.",
  },
  {
    id: "all",
    name: "All Collections",
    icon: <BookOpen className="w-4 h-4 text-amber-800 dark:text-amber-400" />,
    volumeCount: 0,
    description: "Browse every title across all shelves in one unified view.",
  },
];

interface TopCategoriesProps {
  onBrowse?: (category: string) => void;
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ onBrowse }) => {
  return (
    <section className="py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 mb-2">
            <Compass className="w-4 h-4" />
            <span className="text-xs font-medium tracking-wider uppercase">
              Explore Curated Genres
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100">
            Top Categories
          </h2>
        </div>
        <button
          onClick={() => onBrowse?.("all")}
          className="text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors flex items-center gap-1.5 self-start md:self-auto group"
        >
          View All Shelves
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const isAll = category.id === "all";

          return (
            <button
              key={category.id}
              onClick={() => onBrowse?.(category.id)}
              className={`group relative p-5 text-left rounded-sm transition-all duration-200 ${
                isAll
                  ? "bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-800"
                  : "bg-stone-50/50 dark:bg-stone-900/50 hover:bg-white dark:hover:bg-stone-900 border border-stone-200/80 dark:border-stone-800 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                    isAll
                      ? "bg-amber-100/80 dark:bg-amber-900/40"
                      : "bg-stone-200/60 dark:bg-stone-800"
                  }`}
                >
                  {category.icon}
                </div>
                {category.volumeCount > 0 && (
                  <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                    {category.volumeCount}{" "}
                    {category.volumeCount > 1 ? "Volumes" : "Volume"}
                  </span>
                )}
              </div>

              <h3
                className={`font-serif text-lg font-medium mb-1 transition-colors ${
                  isAll
                    ? "text-amber-950 dark:text-amber-200 group-hover:text-amber-900 dark:group-hover:text-amber-100"
                    : "text-stone-900 dark:text-stone-100 group-hover:text-amber-700 dark:group-hover:text-amber-400"
                }`}
              >
                {category.name}
              </h3>

              <p
                className={`text-xs leading-relaxed line-clamp-2 ${
                  isAll
                    ? "text-amber-900/70 dark:text-amber-300/80"
                    : "text-stone-500 dark:text-stone-400"
                }`}
              >
                {category.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
};
