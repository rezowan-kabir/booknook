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
    <div className="min-h-screen bg-[#FCFBF9] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}

        <Link
          href="/all-books"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-7"
        >
          <ArrowLeft size={16} />
          Back to Library Catalog
        </Link>

        {/* Main Card */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-[35%_65%] gap-8">
            {/* Left Section */}

            <div>
              {/* Book Cover */}

              <div className="relative bg-[#E5E5E3] rounded-xl p-7 flex justify-center shadow-inner">
                <span className="absolute top-3 right-3 bg-white text-xs px-3 py-1 rounded-md shadow-sm z-10">
                  {availableCopies} Copies Available
                </span>

                <div className="relative w-full aspect-[3/4] max-w-[215px] shadow-xl">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 70vw, 215px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Book Statistics */}

              <div className="mt-4 border border-gray-200 rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total Cataloged:</span>

                  <span className="font-medium">{totalCopies} copies</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Available to Borrow:</span>

                  <span className="font-medium text-amber-700">
                    {availableCopies} copies
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Standard Loan Period:</span>

                  <span className="font-medium">14 Days</span>
                </div>
              </div>
            </div>

            {/* Right Section */}

            <div className="flex flex-col justify-between">
              <div>
                {/* Category */}

                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide mb-4">
                  <span className="text-amber-800 font-medium">{category}</span>

                  <span className="text-gray-300">•</span>

                  <span className="text-gray-400">CATALOGED BOOK</span>
                </div>

                {/* Book Title */}

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                  {title}
                </h1>

                {/* Author */}

                <p className="mt-3 text-sm text-gray-700">
                  Written by{" "}
                  <span className="font-semibold text-gray-900">{author}</span>
                </p>

                {/* Added By */}

                <div className="mt-5 border border-amber-100 bg-[#FFFEFA] rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-800 text-white flex items-center justify-center font-semibold">
                    {addedBy?.name?.charAt(0) || "U"}
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">
                      Contributed to BookNook by
                    </p>

                    <p className="text-sm font-medium text-gray-900">
                      {addedBy?.name}
                    </p>

                    <p className="text-xs text-gray-500">{addedBy?.email}</p>
                  </div>
                </div>

                {/* Description */}

                <div className="mt-6">
                  <h3 className="font-serif font-semibold text-sm uppercase">
                    About This Volume
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}

              <div className="mt-12 pt-5 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
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
                  className="border border-gray-300 rounded-lg px-6 py-3 text-sm text-center hover:bg-gray-50 transition"
                >
                  Browse Others
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
