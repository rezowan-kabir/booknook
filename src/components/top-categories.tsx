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
  ArrowUpRight,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  volumeCount: number;
  description: string;
  bgClass: string;
  iconBgClass: string;
  titleClass: string;
  textClass: string;
  linkClass: string;
}

const categories: Category[] = [
  {
    id: "fiction",
    name: "Fiction",
    icon: <Feather className="w-5 h-5" />,
    volumeCount: 2,
    description: "Immersive literary novels, coastal mysteries, character-driven dramas,…",
    bgClass: "bg-amber-50/80 dark:bg-amber-950/20",
    iconBgClass: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    titleClass: "text-amber-950 dark:text-amber-100",
    textClass: "text-stone-600 dark:text-stone-400",
    linkClass: "text-amber-700 dark:text-amber-400",
  },
  {
    id: "science",
    name: "Science",
    icon: <Atom className="w-5 h-5" />,
    volumeCount: 2,
    description: "Quantum physics, cosmology, astrophysics, robotics, biomimicry,…",
    bgClass: "bg-blue-50/80 dark:bg-blue-950/20",
    iconBgClass: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    titleClass: "text-blue-950 dark:text-blue-100",
    textClass: "text-stone-600 dark:text-stone-400",
    linkClass: "text-blue-700 dark:text-blue-400",
  },
  {
    id: "history",
    name: "History",
    icon: <Landmark className="w-5 h-5" />,
    volumeCount: 1,
    description: "Ancient civilizations, maritime empires, classic diplomacy,…",
    bgClass: "bg-stone-100/80 dark:bg-stone-800/40",
    iconBgClass: "bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300",
    titleClass: "text-stone-900 dark:text-stone-100",
    textClass: "text-stone-600 dark:text-stone-400",
    linkClass: "text-stone-700 dark:text-stone-300",
  },
  {
    id: "kids",
    name: "Kids",
    icon: <Smile className="w-5 h-5" />,
    volumeCount: 2,
    description: "Colorful picture books, early readers, and magical adventures…",
    bgClass: "bg-emerald-50/80 dark:bg-emerald-950/20",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    titleClass: "text-emerald-950 dark:text-emerald-100",
    textClass: "text-stone-600 dark:text-stone-400",
    linkClass: "text-emerald-700 dark:text-emerald-400",
  },
  {
    id: "other",
    name: "Other",
    icon: <Layers className="w-5 h-5" />,
    volumeCount: 1,
    description: "Art, philosophy, travel essays, poetry, and rare finds…",
    bgClass: "bg-purple-50/80 dark:bg-purple-950/20",
    iconBgClass: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
    titleClass: "text-purple-950 dark:text-purple-100",
    textClass: "text-stone-600 dark:text-stone-400",
    linkClass: "text-purple-700 dark:text-purple-400",
  },
  {
    id: "all",
    name: "All Collections",
    icon: <BookOpen className="w-5 h-5" />,
    volumeCount: 0,
    description: "Browse every title across all shelves in one unified view…",
    bgClass: "bg-amber-800 dark:bg-amber-900/60",
    iconBgClass: "bg-amber-700 dark:bg-amber-600 text-white",
    titleClass: "text-white",
    textClass: "text-amber-100/80",
    linkClass: "text-white",
  },
];

interface TopCategoriesProps {
  onBrowse?: (category: string) => void;
}

export const TopCategories: React.FC<TopCategoriesProps> = ({ onBrowse }) => {
  return (
    <section>
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-3">
          <Compass className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-widest uppercase">
            Explore Curated Genres
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              Top Categories
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Dive into our main library collections. Click any category to
              browse cataloged books immediately.
            </p>
          </div>
          <button
            onClick={() => onBrowse?.("all")}
            className="text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 transition-colors shrink-0 flex items-center gap-1"
          >
            View All Shelves
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-b border-stone-200 dark:border-stone-800 mb-8" />

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onBrowse?.(category.id)}
            className={`${category.bgClass} rounded-2xl p-6 text-left border border-stone-200/50 dark:border-stone-700/50 hover:shadow-md transition-all group`}
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.iconBgClass}`}
              >
                {category.icon}
              </div>
              {category.volumeCount > 0 && (
                <span className={`text-sm ${category.textClass}`}>
                  {category.volumeCount} Volume{category.volumeCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h3
              className={`font-serif text-xl font-semibold ${category.titleClass} mb-2`}
            >
              {category.name}
            </h3>
            <p className={`text-sm ${category.textClass} leading-relaxed mb-5 line-clamp-2`}>
              {category.description}
            </p>
            <div
              className={`inline-flex items-center gap-1 text-sm font-medium ${category.linkClass} group-hover:gap-2 transition-all`}
            >
              Browse {category.name}
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};