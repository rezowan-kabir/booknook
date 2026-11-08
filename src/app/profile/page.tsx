import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import ProfileClientView from "./profile-client-view";
import getTokenFromServer from "@/lib/getTokenFromServer";

const getBackendBaseUrl = () =>
  (
    process.env.BACKEND_BASE_URL ||
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    "http://localhost:8000"
  ).replace(/\/+$/, "");

async function fetchUserCounts(email: string) {
  const backendBaseUrl = getBackendBaseUrl();
  const token = await getTokenFromServer()
  try {
    const booksRes = await fetch(
      `${backendBaseUrl}/my-books/${encodeURIComponent(email)}`,
      {
        cache: "no-store",
        headers: {
          authorization: `Bearer ${token}`,
        },
      },
    );
    const booksData = booksRes.ok ? await booksRes.json() : [];
    const booksAddedCount = Array.isArray(booksData) ? booksData.length : 0;

    // ২. Active Borrows কাউন্ট ফেচ
    const borrowsRes = await fetch(
      `${backendBaseUrl}/my-borrow/${encodeURIComponent(email)}`,
      {
        cache: "no-store",
      },
    );
    const borrowsData = borrowsRes.ok ? await borrowsRes.json() : [];
    const activeBorrowsCount = Array.isArray(borrowsData)
      ? borrowsData.filter(
          (borrow: unknown) =>
            typeof borrow === "object" &&
            borrow !== null &&
            (!("status" in borrow) || borrow.status !== "returned"),
        ).length
      : 0;

    return { booksAddedCount, activeBorrowsCount };
  } catch (error) {
    console.error("Error fetching profile counts:", error);
    return { booksAddedCount: 0, activeBorrowsCount: 0 };
  }
}

export default async function ProfilePage() {
  // BetterAuth দিয়ে লগইন করা ইউজারের সেশন ফেচ করা
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  // যদি ইউজার লগইন করা না থাকে
  if (!user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F5F0] dark:bg-stone-950 px-4">
        <div className="text-center rounded-lg border border-stone-200 bg-white p-8 shadow-sm dark:border-stone-800 dark:bg-stone-900 max-w-md w-full">
          <h2 className="font-serif text-2xl font-semibold text-stone-900 dark:text-stone-100 mb-2">
            Access Denied
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
            Please sign in to view and manage your BookNook profile.
          </p>
          <a
            href="/login"
            className="inline-block rounded-sm bg-amber-800 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-900"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // ডাটাবেজ থেকে কাউন্ট ফেচ করা
  const { booksAddedCount, activeBorrowsCount } = await fetchUserCounts(
    user.email,
  );

  return (
    <div className="flex min-h-[85vh] items-center justify-center bg-[#F7F5F0] dark:bg-stone-950 px-4 py-12">
      {/* ক্লায়েন্ট কম্পোনেন্টে ইউজার ডাটা এবং কাউন্ট পাস করা হলো */}
      <ProfileClientView
        user={{
          name: user.name || "BookNook Member",
          email: user.email,
          image:
            user.image ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60",
        }}
        booksAddedCount={booksAddedCount}
        activeBorrowsCount={activeBorrowsCount}
      />
    </div>
  );
}
