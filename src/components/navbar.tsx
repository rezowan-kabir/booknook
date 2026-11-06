"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
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
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface NavbarUser {
  photoURL: string;
  name: string;
  email: string;
}

interface NavbarProps {
  currentPath?: string;
  navigate?: (path: string) => void;
  openProfile?: () => void;
  user?: NavbarUser | null;
  logout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath: currentPathProp,
  navigate: navigateProp,
  openProfile: openProfileProp,
  user = null,
  logout = () => {},
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const currentPath = currentPathProp ?? pathname ?? "/";
  const navigate = navigateProp ?? ((path: string) => router.push(path));
  const openProfile = openProfileProp ?? (() => router.push("/profile"));
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

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "All Books", path: "/all-books" },
    // Private links
    // ...(user
    //   ? [
          { label: "Add Book", path: "/add-book", icon: PlusCircle },
          { label: "My Books", path: "/my-books", icon: Library },
          { label: "My Borrows", path: "/my-borrows", icon: BookMarked },
      //   ]
      // : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-amber-50/90 dark:bg-stone-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (1 line, single element) */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 text-stone-900 dark:text-stone-100 group shrink-0 focus-visible:outline-none"
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
        </button>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive =
              link.path === "/"
                ? currentPath === "/"
                : currentPath.startsWith(link.path);
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
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
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Auth / Profile */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* When User is Logged In */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 hover:opacity-80 transition-all focus-visible:outline-none"
                aria-label="User menu"
              >
                <Image
                  src={user.photoURL}
                  alt={user.name}
                  width={36}
                  height={36}
                  unoptimized
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-stone-200 dark:ring-stone-700"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
                <span className="hidden lg:inline text-sm font-medium text-stone-700 dark:text-stone-300 max-w-[140px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xl py-2 z-50 text-stone-800 dark:text-stone-200 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                    <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      openProfile();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-stone-500" />
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/my-books");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors"
                  >
                    <Library className="w-4 h-4 text-stone-500" />
                    My Added Books
                  </button>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/my-borrows");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium hover:bg-stone-100 dark:hover:bg-stone-800 text-left transition-colors"
                  >
                    <BookMarked className="w-4 h-4 text-stone-500" />
                    My Borrowed Books
                  </button>

                  <div className="my-1 border-t border-stone-100 dark:border-stone-80" />

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
            /* When User is NOT Logged In */
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/login")}
                className="px-3.5 py-1.5 text-sm font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 rounded-sm hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors whitespace-nowrap"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1.5 text-sm font-medium text-white bg-amber-800 hover:bg-amber-900 dark:bg-amber-600 dark:hover:bg-amber-700 rounded-sm shadow-sm transition-colors whitespace-nowrap"
              >
                Register
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-900/95 px-4 pt-3 pb-5 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg"
            >
              {link.label}
            </button>
          ))}
          {!user && (
            <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex gap-2">
              <button
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-medium text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-lg"
              >
                Login
              </button>
              <button
                onClick={() => {
                  navigate("/register");
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-center text-xs font-medium text-white bg-amber-800 dark:bg-amber-600 rounded-lg"
              >
                Register
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
