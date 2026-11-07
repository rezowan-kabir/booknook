import Link from "next/link";
import { BookOpen } from "lucide-react";
import MyBorrowsList, { type BorrowRecord } from "./my-borrows-list";

const getBackendBaseUrl = () =>
  (
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    ""
  ).replace(/\/+$/, "");

async function fetchBorrows(): Promise<BorrowRecord[] | null> {
  const backendBaseUrl = getBackendBaseUrl();

  if (!backendBaseUrl) {
    console.error("Backend URL is not configured.");
    return null;
  }

  try {
    const res = await fetch(`${backendBaseUrl}/my-borrows`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch borrows: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (error) {
    // Backend unreachable or errored — degrade instead of crashing the page.
    console.error("Failed to load borrows:", error);
    return null;
  }
}

export default async function MyBorrowsPage() {
  const borrows = await fetchBorrows();

  const active = borrows?.filter((borrow) => borrow.status !== "returned") ?? [];
  const returned = borrows?.filter((borrow) => borrow.status === "returned") ?? [];

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-stone-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <BookOpen className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-widest">
                Reader Activity
              </span>
            </div>
            <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
              My Borrows
            </h1>
            <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400 sm:text-sm">
              Track books currently checked out under your account, review due
              dates, and return them when finished.
            </p>
          </div>

          <Link
            href="/all-books"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-amber-100 px-5 py-2.5 text-sm font-medium text-amber-900 transition-colors hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-900/60"
          >
            <BookOpen className="h-4 w-4" />
            Borrow More Books
          </Link>
        </div>

        {/* Divider */}
        <div className="mb-10 border-b border-stone-200 dark:border-stone-800" />

        {borrows === null ? (
          /* Backend unreachable — degrade instead of crashing the page. */
          <div className="rounded-xl border border-dashed border-stone-200 bg-white/60 px-6 py-20 text-center dark:border-stone-800 dark:bg-stone-900/20">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-stone-400" />
            <p className="mb-1 text-sm font-medium text-stone-700 dark:text-stone-300">
              Couldn&apos;t load your borrows
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              The library service is unreachable right now — please try again in
              a moment.
            </p>
            <Link
              href="/all-books"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-amber-800 px-4 py-2.5 text-xs font-medium text-stone-100 transition-colors hover:bg-amber-900"
            >
              Browse All Books
            </Link>
          </div>
        ) : (
          <MyBorrowsList active={active} returned={returned} />
        )}
      </div>
    </div>
  );
}
