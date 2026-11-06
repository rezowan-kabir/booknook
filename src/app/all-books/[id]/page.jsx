import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Bookmark } from "lucide-react";
import BorrowBookModal from "./BorrowBookModal";

const BookDetailsPage = async ({ params }) => {
  const { id } = await params;

  const res = await fetch(`${process.env.BACKEND_BASE_URL}/all-books/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Failed to load book details.</h2>
      </div>
    );
  }

  const data = await res.json();
  const book = data.result;

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">Book not found!</h2>
      </div>
    );
  }

  const {
    _id,
    title,
    author,
    category,
    description,
    imageUrl,
    totalCopies,
    addedBy,
  } = book;

  const availableCopies = totalCopies;

  return (
    <div className="min-h-screen bg-[#F7F5F0] px-4 py-10 text-stone-800 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Link
          href="/all-books"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Library Catalog
        </Link>

        {/* Main Card */}
        <div className="bg-white border border-stone-200/80 rounded-md shadow-sm p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-[32%_68%] gap-10">
            {/* Left Section */}
            <div>
              {/* Book Cover */}
              <div className="relative bg-stone-100 rounded-sm p-6 flex justify-center border border-stone-200">
                <span className="absolute top-3 right-3 bg-stone-900 text-stone-100 text-[11px] font-medium px-2.5 py-0.5 rounded-none z-10 tracking-wide uppercase">
                  {availableCopies} Available
                </span>

                <div className="relative w-full aspect-[3/4] max-w-[200px] shadow-md border border-stone-300">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 70vw, 200px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Book Statistics */}
              <div className="mt-4 border border-stone-200 rounded-sm p-4 text-xs space-y-2.5 bg-stone-50/50">
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Cataloged:</span>
                  <span className="font-medium text-stone-800">
                    {totalCopies} copies
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Available to Borrow:</span>
                  <span className="font-medium text-amber-800">
                    {availableCopies} copies
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-stone-500">Standard Loan Period:</span>
                  <span className="font-medium text-stone-800">14 Days</span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Category */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-widest mb-3">
                  <span className="text-amber-900 font-semibold">
                    {category}
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-400">Archived Volume</span>
                </div>

                {/* Book Title */}
                <h1 className="text-3xl md:text-4xl font-serif font-normal text-stone-900 tracking-tight leading-snug">
                  {title}
                </h1>

                {/* Author */}
                <p className="mt-2 text-sm text-stone-600 font-serif italic">
                  by{" "}
                  <span className="not-italic font-medium text-stone-900">
                    {author}
                  </span>
                </p>

                {/* Added By */}
                <div className="mt-6 border-l-2 border-amber-800 bg-stone-50 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-800 text-stone-100 flex items-center justify-center text-xs font-medium">
                    {addedBy?.name?.charAt(0) || "U"}
                  </div>

                  <div>
                    <p className="text-[11px] text-stone-500 uppercase tracking-wider">
                      Contributed by
                    </p>
                    <p className="text-xs font-medium text-stone-900">
                      {addedBy?.name}
                    </p>
                    <p className="text-[11px] text-stone-400">
                      {addedBy?.email}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="font-serif font-medium text-xs uppercase tracking-wider text-stone-700 border-b border-stone-200 pb-1 mb-2">
                    About This Volume
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-600 font-normal">
                    {description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-10 pt-4 border-t border-stone-200 flex flex-col sm:flex-row gap-3">
                <BorrowBookModal
                  book={{
                    _id,
                    title,
                    author,
                    imageUrl,
                    totalCopies,
                    availableCopies,
                  }}
                />

                <Link
                  href="/all-books"
                  className="border border-stone-300 rounded-sm px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-stone-700 text-center hover:bg-stone-50 transition-colors"
                >
                  Browse Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;
