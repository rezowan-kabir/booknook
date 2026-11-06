import Link from "next/link";
import { BookOpen, Compass, Home } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 space-y-6">
      <Image
                                src="/assets/logo1.png"
                                alt="BookNook logo"
                                width={40}
                                height={40}
                                priority
                                className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
                              />

      <div className="space-y-2 max-w-md">
        <p className="text-xs uppercase font-semibold tracking-widest text-amber-800 dark:text-amber-400">
          Error 404 · Shelf Not Found
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          This Volume Has Wandered Off
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          The page or library catalog entry you are looking for doesn&apos;t
          exist or has been relocated to another reading room.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 shadow-sm transition-all focus-visible:outline-none"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <Link
          href="/books"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors focus-visible:outline-none"
        >
          <Compass className="w-4 h-4" />
          <span>Browse Catalog</span>
        </Link>
      </div>
    </div>
  );
}
