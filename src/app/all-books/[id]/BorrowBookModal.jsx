"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bookmark, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import getTokenFromClient from "@/lib/getTokenFromClient";

const BorrowBookModal = ({ book, user = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const getDefaultDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().split("T")[0];
  };

  const [borrowerName, setBorrowerName] = useState(user?.name || "");
  const [borrowerEmail, setBorrowerEmail] = useState(user?.email || "");
  const [returnDate, setReturnDate] = useState(getDefaultDate());
  const [loading, setLoading] = useState(false);

  const availableCopies = book.availableCopies ?? book.totalCopies;

  const handleBorrow = async (e) => {
    e.preventDefault();

    if (availableCopies <= 0) {
      toast.error("Sorry! No copies are currently available.");
      return;
    }

    try {
      setLoading(true);

      const borrowData = {
        bookId: book._id,
        bookDetails: {
          _id: book._id,
          title: book.title,
          author: book.author,
          category: book.category,
          description: book.description,
          imageUrl: book.imageUrl,
          totalCopies: book.totalCopies,
          availableCopies: availableCopies,
          addedBy: book.addedBy,
        },
        borrowerName,
        borrowerEmail,
        returnDate,
      };
      const token = await getTokenFromClient()
      const backendBaseUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL?.replace(/\/+$/, "");

      if (!backendBaseUrl) {
        throw new Error("Backend URL is not configured.");
      }

      const res = await fetch(
        `${backendBaseUrl}/borrows`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            
                    authorization: `Bearer ${token}`
                  
          },
          body: JSON.stringify(borrowData),
        },
      );

      const responseData = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(responseData?.message || "Borrow failed");
      }

      toast.success("Borrow request submitted successfully!", {
        description: `Due date: ${returnDate}`,
      });

      setIsOpen(false);

      
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Borrow Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={availableCopies <= 0}
        className="flex-1 flex items-center justify-center gap-2 bg-stone-900 text-stone-100 rounded-sm px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        <Bookmark size={14} />
        {availableCopies > 0 ? "Borrow This Book" : "Not Available"}
      </button>

     
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px]"
          />

          
          <div className="relative bg-white w-full max-w-md rounded-sm shadow-xl border border-stone-200 p-6 sm:p-7">
            
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <h2 className="flex items-center gap-2 font-serif font-medium text-base text-stone-900">
                <Bookmark size={17} className="text-amber-800" />
                Borrow This Volume
              </h2>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-stone-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3.5 border border-stone-200 bg-stone-50/60 rounded-sm p-3">
              <div className="relative w-10 h-14 rounded-none overflow-hidden shrink-0 border border-stone-300 shadow-sm">
                <Image
                  src={book.imageUrl || "/placeholder-book.png"}
                  alt={book.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <h3 className="font-serif font-medium text-xs text-stone-900 truncate">
                  {book.title}
                </h3>

                <p className="text-[11px] text-stone-500 font-serif italic">
                  by {book.author}
                </p>

                <p className="text-[11px] text-amber-800 mt-1 font-medium">
                  Available Copies: {availableCopies} of {book.totalCopies}
                </p>
              </div>
            </div>

            {/* Borrow Form */}
            <form onSubmit={handleBorrow} className="mt-5 space-y-4">
              
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Borrower Name
                </label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  readOnly={!!user?.name}
                  required
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-xs bg-stone-50/50 text-stone-800 outline-none focus:border-stone-800 read-only:cursor-not-allowed"
                />
              </div>

              
              <div>
                <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Borrower Email
                </label>
                <input
                  type="email"
                  value={borrowerEmail}
                  onChange={(e) => setBorrowerEmail(e.target.value)}
                  readOnly={!!user?.email}
                  required
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-xs bg-stone-50/50 text-stone-800 outline-none focus:border-stone-800 read-only:cursor-not-allowed"
                />
              </div>

              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                    Return Due Date
                  </label>
                  <span className="text-[11px] text-stone-400 font-serif italic">
                    (standard 14 days)
                  </span>
                </div>
                <input
                  type="date"
                  value={returnDate}
                  min={new Date().toLocaleDateString("en-CA")}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full border border-stone-300 rounded-sm px-3 py-2 text-xs text-stone-800 outline-none focus:border-stone-800 bg-white"
                />
              </div>

              
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-sm p-3 flex items-start gap-2.5">
                <ShieldCheck
                  size={15}
                  className="text-amber-800 mt-0.5 shrink-0"
                />
                <p className="text-[11px] leading-relaxed text-stone-600">
                  By confirming, 1 copy will be deducted from library inventory.
                  You can return it at any time in &quot;My Borrows&quot;.
                </p>
              </div>

              
              <div className="flex justify-end items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 px-3 py-2 transition-colors font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-amber-800 text-stone-100 text-xs uppercase tracking-wider font-medium px-5 py-2.5 rounded-sm hover:bg-amber-900 transition-colors disabled:opacity-50"
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