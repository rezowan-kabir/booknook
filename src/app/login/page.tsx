"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2, Lock, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const GoogleIcon = () => (
  <svg viewBox="0 0 48 48" aria-hidden="true" className="h-4 w-4">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);

const inputClassName =
  "w-full rounded-sm border border-stone-300 bg-white py-2.5 pl-9 pr-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-amber-700 focus:ring-2 focus:ring-amber-700/15 dark:border-stone-700 dark:bg-stone-950/50 dark:text-stone-100";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleSignIn = () => {
    toast.info("Google sign-in isn't connected yet.", {
      description: "No OAuth provider is configured for BookNook.",
    });
  };

  const handleForgotPassword = () => {
    toast.info("Password reset isn't available yet.", {
      description: "Contact the library to reset your password.",
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isValidEmail(email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Login failed. Please try again.");
        return;
      }

      toast.success("Signed in successfully!", {
        description: "Welcome back.",
      });
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center bg-[#F7F5F0] px-4 py-12 dark:bg-stone-950">
      <div className="w-full max-w-md rounded-lg border border-stone-200/70 bg-white p-8 shadow-[0_4px_30px_rgba(0,0,0,0.08)] dark:border-stone-800 dark:bg-stone-900">
        {/* Icon */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-amber-800 text-white dark:bg-amber-700">
          <BookOpen className="h-6 w-6" />
        </div>

        <h1 className="mx-auto mt-5 max-w-[320px] text-center font-serif text-3xl font-bold leading-tight text-stone-900 dark:text-stone-50">
          Welcome Back to BookNook
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-center text-sm text-stone-500 dark:text-stone-400">
          Sign in to borrow titles, view personal shelves, and catalog books.
        </p>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-sm border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-950/50 dark:text-stone-200 dark:hover:bg-stone-800"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <span className="h-px flex-1 bg-stone-200 dark:bg-stone-800" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-stone-400 dark:text-stone-500">
            or sign in with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="reader@booknook.dev"
                autoComplete="email"
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-semibold uppercase tracking-wider text-stone-600 dark:text-stone-400"
              >
                Password
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-[11px] font-semibold text-amber-700 transition-colors hover:text-amber-900 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
              >
                Forget Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className={inputClassName}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-sm bg-amber-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-amber-700 dark:hover:bg-amber-600"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {submitting ? "Signing In..." : "Log In to BookNook"}
          </button>
        </form>

        {/* Footer link */}
        <div className="mt-6 border-t border-stone-100 pt-5 text-center text-xs text-stone-500 dark:border-stone-800 dark:text-stone-400">
          Don&apos;t have a library account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-amber-800 hover:text-amber-900 hover:underline dark:text-amber-400 dark:hover:text-amber-300"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

