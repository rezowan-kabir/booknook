"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, BookOpen, ArrowUpRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  imageUrl: string;
  totalCopies: number;
  availableCopies?: number; // Optional if handled dynamically
  addedBy: {
    name: string;
    email: string;
  };
}

const categories = [
  "All Shelves",
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Other",
];

const sortOptions = [
  { value: "newest", label: "Newest Cataloged" },
  { value: "title", label: "Title A–Z" },
  { value: "author", label: "Author A–Z" },
  { value: "available", label: "Most Copies" },
];

function AllBooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() =>
    categoryParam && categories.includes(categoryParam)
      ? categoryParam
      : "All Shelves",
  );
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  // Fetch books from backend API on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const backendBaseUrl =
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
          (process.env.NODE_ENV === "development"
            ? "http://localhost:8000"
            : undefined);

        if (!backendBaseUrl) {
          throw new Error("NEXT_PUBLIC_BACKEND_BASE_URL is not configured.");
        }

        const res = await fetch(
          `${backendBaseUrl.replace(/\/+$/, "")}/all-books`,
        );

        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching books:", error);
        toast.error("Failed to load library catalog.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Filter and sort books
  const filteredBooks = books
    .filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All Shelves" ||
        book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "author":
          return a.author.localeCompare(b.author);
        case "available":
          return b.totalCopies - a.totalCopies;
        default:
          return 0; // newest first (handled by backend _id sort)
      }
    });

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Fiction":
        return "text-amber-700 dark:text-amber-400";
      case "Science":
        return "text-blue-700 dark:text-blue-400";
      case "History":
        return "text-stone-700 dark:text-stone-400";
      case "Kids":
        return "text-emerald-700 dark:text-emerald-400";
      case "Other":
        return "text-purple-700 dark:text-purple-400";
      default:
        return "text-stone-700 dark:text-stone-400";
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <div className="inline-flex items-center gap-2 text-amber-800 dark:text-amber-400 mb-2">
          <BookOpen className="w-4 h-4" />
          <span className="text-[11px] font-semibold tracking-widest uppercase">
            Library Catalog
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900 dark:text-stone-100 tracking-tight mb-2">
          All Books
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          Browse our complete shelves. Borrow an available volume with your
          member pass, or check back when loaned copies return.
        </p>
      </div>

      {/* Divider */}
      <div className="border-b border-stone-200 dark:border-stone-800 mb-8" />

      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by book title, author, or keyword…"
            className="pl-10 h-10 bg-white dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-xs rounded-md shadow-sm"
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
            Sort by:
          </span>
          <Select
            value={sortBy}
            onValueChange={(value) => {
              if (value !== null) setSortBy(value);
            }}
          >
            <SelectTrigger className="w-[170px] h-10 bg-white dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 text-xs rounded-md shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-10">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
              selectedCategory === category
                ? "bg-amber-800 dark:bg-amber-700 text-white shadow-sm"
                : "bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-stone-100 dark:bg-stone-800/50 rounded-xl h-[420px] animate-pulse border border-stone-200 dark:border-stone-800"
            />
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-stone-50/50 dark:bg-stone-900/20 rounded-xl border border-dashed border-stone-200 dark:border-stone-800">
          <BookOpen className="w-10 h-10 mx-auto text-stone-400 mb-3" />
          <p className="text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">
            No books found
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBooks.map((book) => (
            <Card
              key={book._id}
              className="group overflow-hidden bg-white dark:bg-stone-900/60 border-stone-200/80 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer rounded-xl flex flex-col"
              onClick={() => router.push(`/all-books/${book._id}`)}
            >
              {/* Book Cover Container (Editorial Aspect Ratio) */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
                {book.imageUrl ? (
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-stone-300 dark:text-stone-600" />
                  </div>
                )}

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent opacity-60" />

                {/* Copies Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-medium bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm text-emerald-700 dark:text-emerald-300 rounded-full flex items-center gap-1.5 shadow-sm border border-stone-200/50 dark:border-stone-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {book.totalCopies} Copies
                </div>

                {/* Category Badge on Image */}
                <div className="absolute bottom-3 left-3">
                  <span
                    className={`inline-block px-2.5 py-0.5 text-[11px] font-medium rounded bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm shadow-sm ${getCategoryBadgeColor(
                      book.category,
                    )}`}
                  >
                    {book.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <CardContent className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Author Name */}
                  <p className="text-[11px] font-medium tracking-wide uppercase text-stone-500 dark:text-stone-400 mb-1">
                    {book.author}
                  </p>

                  {/* Title */}
                  <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 mb-2 line-clamp-1 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors">
                    {book.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-2 mb-4">
                    {book.description}
                  </p>
                </div>

                {/* Footer / Contributor info */}
                <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800/80">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-300">
                        {book.addedBy?.name
                          ? book.addedBy.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "RK"}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400 truncate max-w-[130px]">
                      {book.addedBy?.name || "Library Member"}
                    </span>
                  </div>

                  <button
                    className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/all-books/${book._id}`);
                    }}
                  >
                    <span>Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AllBooksPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-stone-100 dark:bg-stone-800/50 rounded-xl h-[420px] animate-pulse border border-stone-200 dark:border-stone-800"
              />
            ))}
          </div>
        </div>
      }
    >
      <AllBooksContent />
    </Suspense>
  );
}
