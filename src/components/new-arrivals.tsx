import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Sprout } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies?: number;
  imageUrl?: string;
  description: string;
  addedBy?: {
    name: string;
    email: string;
  };
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const NewArrivals = async () => {
  const apiUrl = process.env.BACKEND_NEW_ARRIVEL_URL;

  if (!apiUrl) {
    throw new Error("BACKEND_NEW_ARRIVEL_URL is not configured.");
  }

  let books: Book[] | null = null;

  try {
    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch new arrivals: ${res.status} ${res.statusText}`,
      );
    }

    books = await res.json();
  } catch (error) {
    // Backend unreachable or errored — degrade instead of crashing the homepage.
    console.error("Failed to load new arrivals:", error);
  }

  return (
    <section>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
            <Sprout className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Fresh on the shelves
            </span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100 sm:text-3xl">
            New Arrivals
          </h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
            Discover the latest additions to our community of bibliophiles.
          </p>
        </div>
        <Link
          href="/all-books"
          className="group flex items-center gap-1.5 self-start text-xs font-medium text-amber-700 transition-colors hover:text-amber-900 dark:self-auto dark:text-amber-400 dark:hover:text-amber-300"
        >
          Explore All Books
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mb-8 border-b border-stone-200 dark:border-stone-800" />

      {books === null ? (
        <div className="rounded-xl border border-dashed border-stone-300 py-12 text-center dark:border-stone-700">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-stone-300 dark:text-stone-600" />
          <p className="text-sm font-medium text-stone-600 dark:text-stone-300">
            New arrivals are temporarily unavailable.
          </p>
          <p className="mt-1 text-xs text-stone-400 dark:text-stone-500">
            Please check back soon.
          </p>
        </div>
      ) : books.length === 0 ? (
        <p className="py-12 text-center text-sm text-stone-500 dark:text-stone-400">
          No new arrivals yet.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => {
              const available = book.availableCopies ?? book.totalCopies;
              const inStock = available > 0;

              return (
                <Link
                  key={book._id}
                  href={`/all-books/${book._id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-stone-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-stone-800 dark:bg-stone-900/60"
                >
                  <article className="flex h-full flex-col">
                  {/* Cover */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800">
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl}
                        alt={book.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen className="h-10 w-10 text-stone-300 dark:text-stone-600" />
                      </div>
                    )}

                    {/* Availability badge */}
                    <span
                      className={`absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium shadow-sm dark:bg-stone-900/90 ${
                        inStock
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          inStock ? "bg-emerald-500" : "bg-red-500"
                        }`}
                      />
                      {inStock ? `${available} Left` : "Not Available"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {book.category}
                    </p>
                    <h3 className="mt-1.5 line-clamp-1 font-serif text-base font-semibold text-stone-900 dark:text-stone-100">
                      {book.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-stone-500 dark:text-stone-400">
                      {book.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-100 pt-4 dark:border-stone-800">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-semibold text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">
                          {getInitials(book.author)}
                        </span>
                        <span className="truncate text-xs text-stone-600 dark:text-stone-300">
                          {book.author}
                        </span>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-stone-200 bg-white px-3 py-1.5 text-[11px] font-medium text-amber-800 transition-colors group-hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-amber-400 dark:group-hover:bg-stone-800">
                        <BookOpen className="h-3 w-3" />
                        View Details
                      </span>
                    </div>
                  </div>
                  </article>
                </Link>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/all-books"
              className="inline-flex items-center gap-2 rounded-md bg-amber-800 px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-colors hover:bg-amber-900"
            >
              <Image
                src="/assets/logo.png"
                alt="BookNook"
                width={20}
                height={20}
                className="h-5 w-5 object-contain"
              />
              See All Books in Library
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default NewArrivals;
