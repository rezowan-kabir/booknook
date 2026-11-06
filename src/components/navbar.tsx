"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  PlusCircle,
  BookMarked,
  Library,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { authClient } from "@/lib/auth-client";

export const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Better auth useSession hook
  const { data: session, isPending, error, refetch } = authClient.useSession();
  const user = session?.user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setDropdownOpen(false);
            router.push("/login");
          },
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // নেভবার লিংকস: ইউজার লগইন থাকলে নিচের পেজগুলো দেখাবে, না থাকলে শুধু Home ও All Books দেখাবে
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "All Books", path: "/all-books" },
    ...(user
      ? [
          { label: "Add Book", path: "/add-book" },
          { label: "My Books", path: "/my-books" },
          { label: "My Borrows", path: "/my-borrows" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-amber-50/90 dark:bg-stone-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100 group shrink-0"
        >
          <Image
            src="/assets/logo.png"
            alt="BookNook logo"
            width={40}
            height={40}
            priority
            className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
          />
          <span className="font-serif text-2xl font-bold tracking-tight text-amber-950 dark:text-amber-100 whitespace-nowrap">
            BookNook
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium tracking-normal transition-colors whitespace-nowrap py-1 relative ${
                  isActive
                    ? "text-amber-900 dark:text-amber-300 font-semibold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-700 dark:bg-amber-400 rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Theme Toggle & Auth */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            title="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Loading state handling */}
          {isPending ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
            </div>
          ) : user ? (
            /* Logged In User Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 hover:opacity-80 transition-all focus:outline-none"
              >
                <Image
                  src={
                    user.image ||
                    "https://i.ibb.co.com/4gW5wX0/default-avatar.png"
                  }
                  alt={user.name || "User"}
                  width={36}
                  height={36}
                  unoptimized
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-700"
                />
                <span className="hidden lg:inline text-sm font-medium text-stone-700 dark:text-stone-300 max-w-[140px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl py-2 z-50 text-stone-800 dark:text-stone-200">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-stone-500" />
                    My Profile
                  </Link>

                  <Link
                    href="/my-books"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors"
                  >
                    <Library className="w-4 h-4 text-stone-500" />
                    My Added Books
                  </Link>

                  <Link
                    href="/my-borrows"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors"
                  >
                    <BookMarked className="w-4 h-4 text-stone-500" />
                    My Borrowed Books
                  </Link>

                  <div className="my-1 border-t border-stone-100 dark:border-stone-800" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-sm hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-sm shadow-sm transition-colors whitespace-nowrap"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-lg"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 text-center text-xs font-medium text-white bg-amber-800 dark:bg-amber-600 rounded-lg"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};



