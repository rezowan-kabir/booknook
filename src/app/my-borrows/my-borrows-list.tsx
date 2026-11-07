"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookOpen, CircleCheck, Clock, Loader2, RotateCcw } from "lucide-react";

export interface BorrowRecord {
  _id: string;
  bookId: string;
  title: string;
  imageUrl: string;
  borrowerName: string;
  borrowerEmail: string;
  returnDate: string;
  borrowedAt: string;
  status: string;
  returnedAt?: string;
  bookDetails?: {
    _id: string;
    title: string;
    author: string;
    category: string;
    description: string;
    imageUrl: string;
    totalCopies: number;
    availableCopies?: number;
  };
}

const formatDay = (value?: string) => (value ? value.slice(0, 10) : "—");
const formatLongDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-US");
};

const BookCell = ({ record }: { record: BorrowRecord }) => {
  // ব্যাকএন্ডে যদি সরাসরি title/imageUrl সেভ হয়ে থাকে অথবা bookDetails অবজেক্টে থাকে, দুইভাবেই সাপোর্ট করবে
  const bookTitle =
    record.title || record.bookDetails?.title || "Untitled Book";
  const bookImage = record.imageUrl || record.bookDetails?.imageUrl || "";

  return (
    <div className="flex min-w-0 items-center gap-3">
      {bookImage ? (
        <Image
          src={bookImage}
          alt={bookTitle}
          width={40}
          height={56}
          className="h-14 w-10 shrink-0 rounded-sm border border-stone-200 object-cover shadow-sm"
        />
      ) : (
        <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-sm border border-stone-200 bg-stone-100">
          <BookOpen className="h-4 w-4 text-stone-400" />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate font-serif text-sm font-medium text-stone-900 dark:text-stone-100">
          {bookTitle}
        </p>
        <p className="truncate text-[11px] text-stone-400 dark:text-stone-500">
          ID: {record.bookId}
        </p>
      </div>
    </div>
  );
};

const thClassName =
  "px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400";
const tdClassName = "px-6 py-4";

const MyBorrowsList = ({
  active,
  returned,
}: {
  active: BorrowRecord[];
  returned: BorrowRecord[];
}) => {
  const router = useRouter();
  const [returningId, setReturningId] = useState<string | null>(null);
  const [removedIds, setRemovedIds] = useState<string[]>([]);

  const activeRows = active.filter(
    (record) => !removedIds.includes(record._id),
  );

  const handleReturn = async (id: string) => {
    const backendBaseUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : undefined);

    if (!backendBaseUrl) {
      toast.error("Backend URL is not configured.");
      return;
    }

    try {
      setReturningId(id);
      const res = await fetch(
        `${backendBaseUrl.replace(/\/+$/, "")}/my-borrows/${id}`,
        { method: "DELETE" },
      );
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to return the book");
      }

      setRemovedIds((prev) => [...prev, id]);
      toast.success("Book returned successfully!", {
        description: "Thanks — the copy is back on the shelf.",
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong!",
        {
          description: "Couldn't return the book — please try again.",
        },
      );
    } finally {
      setReturningId(null);
    }
  };

  return (
    <>
      {/* Currently Checked Out */}
      <section>
        <div className="mb-4 flex items-center gap-2.5">
          <Clock className="h-5 w-5 shrink-0 text-amber-700 dark:text-amber-500" />
          <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 sm:text-2xl">
            Currently Checked Out ({activeRows.length})
          </h2>
        </div>
        {activeRows.length === 0 ? (
          <div className="rounded-md border border-dashed border-stone-200 bg-white/60 px-6 py-14 text-center dark:border-stone-800 dark:bg-stone-900/20">
            <p className="mb-1 text-sm font-medium text-stone-700 dark:text-stone-300">
              No books checked out
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Browse the catalog to borrow something new.
            </p>
            <Link
              href="/all-books"
              className="mt-5 inline-flex items-center gap-2 rounded-sm bg-amber-800 px-4 py-2.5 text-xs font-medium text-stone-100 transition-colors hover:bg-amber-900"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Browse All Books
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900/60">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/60 dark:border-stone-800 dark:bg-stone-900/40">
                  <th className={thClassName}>Book</th>
                  <th className={thClassName}>Borrow Date</th>
                  <th className={thClassName}>Return Due Date</th>
                  <th className={thClassName}>Status</th>
                  <th className={`${thClassName} text-right`}>Action</th>
                </tr>
              </thead>
              <tbody>
                {activeRows.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-stone-100 transition-colors last:border-0 hover:bg-stone-50/60 dark:border-stone-800 dark:hover:bg-stone-900/40"
                  >
                    <td className={tdClassName}>
                      <BookCell record={record} />
                    </td>
                    <td
                      className={`${tdClassName} font-mono text-xs text-stone-500 dark:text-stone-400`}
                    >
                      {formatDay(record.borrowedAt)}
                    </td>
                    <td
                      className={`${tdClassName} font-mono text-xs text-stone-500 dark:text-stone-400`}
                    >
                      {formatDay(record.returnDate)}
                    </td>
                    <td className={tdClassName}>
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                        In Reading
                      </span>
                    </td>
                    <td className={`${tdClassName} text-right`}>
                      <button
                        onClick={() => handleReturn(record._id)}
                        disabled={returningId === record._id}
                        className="inline-flex items-center gap-2 rounded-sm bg-amber-800 px-4 py-2.5 text-xs font-medium text-stone-100 transition-colors hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-700 dark:hover:bg-amber-600"
                      >
                        {returningId === record._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                        {returningId === record._id
                          ? "Returning…"
                          : "Return Book"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Returned Volumes Archive */}
      {returned.length > 0 && (
        <section className="mt-14">
          <div className="mb-4 flex items-center gap-2.5">
            <CircleCheck className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-500" />
            <h2 className="font-serif text-xl font-semibold text-stone-900 dark:text-stone-100 sm:text-2xl">
              Returned Volumes Archive ({returned.length})
            </h2>
          </div>
          <div className="overflow-x-auto rounded-md border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900/60">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/60 dark:border-stone-800 dark:bg-stone-900/40">
                  <th className={thClassName}>Book</th>
                  <th className={thClassName}>Borrow Date</th>
                  <th className={thClassName}>Returned On</th>
                  <th className={thClassName}>Status</th>
                </tr>
              </thead>
              <tbody>
                {returned.map((record) => (
                  <tr
                    key={record._id}
                    className="border-b border-stone-100 transition-colors last:border-0 hover:bg-stone-50/60 dark:border-stone-800 dark:hover:bg-stone-900/40"
                  >
                    <td className={tdClassName}>
                      <BookCell record={record} />
                    </td>
                    <td
                      className={`${tdClassName} font-mono text-xs text-stone-500 dark:text-stone-400`}
                    >
                      {formatDay(record.borrowedAt)}
                    </td>
                    <td
                      className={`${tdClassName} font-mono text-xs text-stone-500 dark:text-stone-400`}
                    >
                      {formatLongDate(record.returnedAt)}
                    </td>
                    <td className={tdClassName}>
                      <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Returned
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
};

export default MyBorrowsList;
