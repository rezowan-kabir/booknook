import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import React from "react";
import MyBooksList from "./my-books-list"; // ক্লায়েন্ট কম্পোনেন্টটি নিচে দেওয়া হলো

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  imageUrl: string;
  description: string;
  addedBy: {
    name: string;
    email: string;
  };
  createdAt?: string;
}

const getBackendBaseUrl = () =>
  (
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    "http://localhost:8000"
  ).replace(/\/+$/, "");

async function fetchMyBooks(email: string): Promise<Book[]> {
  try {
    const res = await fetch(
      `${getBackendBaseUrl()}/my-books/${encodeURIComponent(email)}`,
      { cache: "no-store" },
    );
    if (!res.ok) throw new Error("Failed to fetch books");
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching user books:", error);
    return [];
  }
}

export default async function MyBooksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;
  const books = user?.email ? await fetchMyBooks(user.email) : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Books</h1>
          <p className="text-gray-500">
            Manage the books you have added to BookNook.
          </p>
        </div>
      </div>

      {/* এখানে ডেটা পাস করা হলো, নিচে আপনি আপনার মতো ডিজাইন করে নিতে পারবেন */}
      <MyBooksList initialBooks={books} />
    </div>
  );
}
