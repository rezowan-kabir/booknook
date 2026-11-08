import Link from "next/link";
import { headers } from "next/headers";
import { BookOpen, Library, PlusCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import MyBooksList, { type Book } from "./my-books-list";
import getTokenFromServer from "@/lib/getTokenFromServer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BookNook | My Books",
};

const getBackendBaseUrl = () =>
  (
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    ""
  ).replace(/\/+$/, "");

async function fetchMyBooks(email: string): Promise<Book[] | null> {
  const backendBaseUrl = getBackendBaseUrl();

  if (!backendBaseUrl) {
    console.error("Backend URL is not configured.");
    return null;
  }
  const token = await getTokenFromServer()
  try {
    const res = await fetch(
      `${backendBaseUrl}/books/user/${encodeURIComponent(email)}`,
      {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch books: ${res.status}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : null;
  } catch (error) {

    console.error("Error fetching user books:", error);
    return null;
  }
}

export default async function MyBooksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const books = user?.email ? await fetchMyBooks(user.email) : null;

  return (
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-stone-950">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 text-amber-800 dark:text-amber-400">
              <Library className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-widest">
                Curator Shelf
              </span>
            </div>
            <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 sm:text-4xl">
              My Books
            </h1>
            <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400 sm:text-sm">
              Manage, edit, or remove the book titles you have cataloged into
              the BookNook library.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-sm bg-amber-800 px-5 py-3 text-sm font-medium text-stone-100 transition-colors hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-800"
          >
            <PlusCircle className="h-4 w-4" />
            Add Another Book
          </Link>
        </div>

       
        <div className="mb-10 border-b border-stone-200 dark:border-stone-800" />

        {!user ? (

<div className="rounded-md border border-dashed border-stone-200 bg-white/60 px-6 py-20 text-center dark:border-stone-800 dark:bg-stone-900/20">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-stone-400" />
            <p className="mb-1 text-sm font-medium text-stone-700 dark:text-stone-300">
              Sign in to see your shelf
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Your cataloged titles are tied to your BookNook account.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-sm bg-amber-800 px-4 py-2.5 text-xs font-medium text-stone-100 transition-colors hover:bg-amber-900"
            >
              Sign In
            </Link>
          </div>
        ) : books === null ? (
          <div className="rounded-md border border-dashed border-stone-200 bg-white/60 px-6 py-20 text-center dark:border-stone-800 dark:bg-stone-900/20">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-stone-400" />
            <p className="mb-1 text-sm font-medium text-stone-700 dark:text-stone-300">
              Couldn&apos;t load your books
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              The library service is unreachable right now — please try again in
              a moment.
            </p>
            <Button
              variant="outline"
              className="mt-5"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <MyBooksList initialBooks={books} />
        )}
      </div>
    </div>
  );
}
