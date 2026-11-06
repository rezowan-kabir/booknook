import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      <div className="max-w-md space-y-4">
        {/* Subtle Error Badge */}
        <p className="font-serif text-sm italic text-amber-800/80 dark:text-amber-400/80">
          Page not found · 404
        </p>

        {/* Main Heading */}
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-stone-100">
          This shelf is bare.
        </h1>

        {/* Description */}
        <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed font-light">
          The volume or page you are looking for has been misplaced or returned
          to the archives.
        </p>

        {/* Action Link */}
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-stone-900 dark:text-stone-100 hover:text-amber-800 dark:hover:text-amber-400 transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Return to the Entrance
          </Link>
        </div>
      </div>
    </div>
  );
}
