"use client";

import { BookOpen } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-amber-50 dark:bg-stone-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Image
                      src="/assets/logo.png"
                      alt="BookNook logo"
                      width={40}
                      height={40}
                      priority
                      className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
                    />
          <div className="absolute -inset-2 rounded-lg border-2 border-amber-300 dark:border-amber-700 animate-spin" />
        </div>
        <p className="font-serif text-lg font-semibold text-amber-950 dark:text-amber-100">
          BookNook
        </p>
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}