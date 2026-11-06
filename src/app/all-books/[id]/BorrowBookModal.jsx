"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bookmark, X, ShieldCheck } from "lucide-react";

const BorrowBookModal = ({ book, user = null }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDefaultDate = () => {
    const date = new Date();

    date.setDate(date.getDate() + 14);

    return date.toISOString().split("T")[0];
  };

  const [borrowerName, setBorrowerName] = useState(
    user?.name || "Rezowan Kabir",
  );

  const [borrowerEmail, setBorrowerEmail] = useState(
    user?.email || "rezownkabir@gmail.com",
  );

  const [returnDate, setReturnDate] = useState(getDefaultDate());

  const [loading, setLoading] = useState(false);

  const handleBorrow = async (e) => {
    e.preventDefault();

    if (!book.availableCopies) {
      alert("Sorry! No copies are currently available.");
      return;
    }

    try {
      setLoading(true);

      const borrowData = {
        bookId: book._id,
        borrowerName,
        borrowerEmail,
        returnDate,
      };

      console.log("Borrow Data:", borrowData);

      // TODO: Connect your borrow API here.

      // Example:
      // const res = await fetch(
      //   `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/borrow-book`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify(borrowData),
      //   }
      // );

      // if (!res.ok) throw new Error("Borrow failed");

      alert("Borrow request submitted successfully!");

      setIsOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Borrow Button */}

      <button
        onClick={() => setIsOpen(true)}
        disabled={!book.availableCopies}
        className="flex-1 flex items-center justify-center gap-2 bg-amber-800 text-white rounded-lg px-6 py-3 text-sm font-semibold hover:bg-amber-900 transition disabled:opacity-50"
      >
        <Bookmark size={16} />
        {book.availableCopies ? "Borrow This Book" : "Currently Unavailable"}
      </button>

      {/* Modal */}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}

          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}

          <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl p-5 sm:p-6">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="flex items-center gap-2 font-serif font-bold text-lg text-gray-900">
                <Bookmark size={19} className="text-amber-800" />
                Borrow This Book
              </h2>

              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            {/* Book Information */}

            <div className="mt-4 flex items-center gap-3 border border-amber-100 bg-[#FFFEFA] rounded-xl p-3">
              <div className="relative w-10 h-14 rounded overflow-hidden shrink-0">
                <Image
                  src={book.imageUrl}
                  alt={book.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <h3 className="font-serif font-semibold text-sm">
                  {book.title}
                </h3>

                <p className="text-xs text-gray-500">By {book.author}</p>

                <p className="text-xs text-amber-800 mt-1">
                  Available Copies: {book.availableCopies} of {book.totalCopies}
                </p>
              </div>
            </div>

            {/* Borrow Form */}

            <form onSubmit={handleBorrow} className="mt-4 space-y-4">
              {/* Borrower Name */}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                  Borrower Name
                </label>

                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  readOnly={!!user}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 outline-none focus:border-amber-700 read-only:cursor-not-allowed"
                />
              </div>

              {/* Borrower Email */}

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                  Borrower Email
                </label>

                <input
                  type="email"
                  value={borrowerEmail}
                  onChange={(e) => setBorrowerEmail(e.target.value)}
                  readOnly={!!user}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 outline-none focus:border-amber-700 read-only:cursor-not-allowed"
                />
              </div>

              {/* Return Date */}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Return Due Date
                  </label>

                  <span className="text-xs text-gray-400">
                    (standard 14 days)
                  </span>
                </div>

                <input
                  type="date"
                  value={returnDate}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-amber-700"
                />
              </div>

           {/* Information */}

              <div className="bg-gray-50 rounded-lg p-3 flex items-start gap-2">
                <ShieldCheck
                  size={15}
                  className="text-emerald-600 mt-0.5 shrink-0"
                />

                <p className="text-[11px] leading-5 text-gray-500">
                  By confirming, 1 copy will be deducted from library inventory.
                  You can return it at any time in "My Borrows".
                </p>
              </div>

              {/* Actions */}

              <div className="flex justify-end items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-900 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Confirm Borrow"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BorrowBookModal;
