"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Mail,
  Phone,
  AtSign,
  GitBranch,
  Camera,
} from "lucide-react";

interface FooterProps {
  navigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate: navigateProp }) => {
  const router = useRouter();
  const navigate = navigateProp ?? ((path: string) => router.push(path));

  const exploreLinks = [
    { label: "Home & New Arrivals", path: "/" },
    { label: "All Books Collection", path: "/books" },
    { label: "Contribute a Book", path: "/add-book" },
    { label: "My Borrowed Books", path: "/my-borrows" },
  ];

  return (
    <footer className="bg-amber-50 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Image
                          src="/assets/logo.png"
                          alt="BookNook logo"
                          width={40}
                          height={40}
                          priority
                          className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
                        />
              <span className="font-serif text-2xl font-bold tracking-tight text-amber-950 dark:text-amber-100">
                BookNook
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed max-w-md">
              A serene neighborhood digital library dedicated to the love of reading.
              Add books, borrow gems for a quiet afternoon, and return them for
              others to discover.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => navigate("/")}
                className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                aria-label="Twitter"
              >
                <AtSign className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                aria-label="GitHub"
              >
                <GitBranch className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-10 h-10 rounded-full border border-stone-300 dark:border-stone-700 flex items-center justify-center text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
                aria-label="Instagram"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              Explore
            </h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-sm text-stone-600 dark:text-stone-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-stone-900 dark:text-stone-100">
              Contact & Hours
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  42 Reading Grove, Bookhaven
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  hello@booknook.dev
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-sm text-stone-600 dark:text-stone-400">
                  +1 (555) 266-5665
                </span>
              </div>
              <p className="text-sm text-stone-500 dark:text-stone-500 pt-1">
                Mon – Sat: 8:00 AM – 9:00 PM EST
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <div className="border-t border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-500 dark:text-stone-500 text-center md:text-left">
            © 2026 BookNook Library. Simple reading: Add, borrow, return.
          </p>
          <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <button
              onClick={() => navigate("/")}
              className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              Terms of Borrowing
            </button>
            <span className="text-stone-300 dark:text-stone-700">·</span>
            <button
              onClick={() => navigate("/")}
              className="hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              Lending Rules
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};