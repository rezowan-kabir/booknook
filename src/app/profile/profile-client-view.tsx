"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, BookOpen, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProfileClientViewProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  booksAddedCount: number;
  activeBorrowsCount: number;
}

export default function ProfileClientView({
  user,
  booksAddedCount,
  activeBorrowsCount,
}: ProfileClientViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // এখানে বেটারঅথ বা আপনার প্রোফাইল আপডেট এপিআই কল করতে পারেন
      // যেমন: await authClient.updateUser({ name, image })

      // সিম্যুলেশন বা সাকসেস মেসেজ:
      toast.success("Profile updated successfully!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-lg rounded-lg border border-stone-200/80 bg-white p-8 shadow-xl dark:border-stone-800 dark:bg-stone-900 relative">
      {/* Close button (Optional redirect to home or dashboard) */}
      <button
        onClick={() => router.push("/")}
        className="absolute right-6 top-6 rounded-full p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Profile Header (Avatar + Name + Email + Role) */}
      <div className="flex flex-col items-center text-center mt-2">
        <div className="relative mb-4 h-24 w-24 rounded-full p-1 border-2 border-amber-200 dark:border-amber-700/50 shadow-inner">
          <Image
            src={
              image ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60"
            }
            alt={name}
            fill
            unoptimized
            className="rounded-full object-cover"
          />
        </div>

        <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          {name}
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          {user.email}
        </p>
        <span className="mt-1.5 text-xs font-semibold text-amber-800 dark:text-amber-400">
          BookNook Member
        </span>
      </div>

      <div className="my-6 border-t border-stone-100 dark:border-stone-800" />

      {/* Stats Grid Cards (Books Added & Active Borrows) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Books Added Card */}
        <div className="rounded-lg border border-amber-100 bg-[#FFFCF5] p-5 dark:border-amber-900/30 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 mb-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Books Added
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
            {booksAddedCount}
          </p>
        </div>

        {/* Active Borrows Card */}
        <div className="rounded-lg border border-amber-100 bg-[#FFFCF5] p-5 dark:border-amber-900/30 dark:bg-amber-950/20 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 mb-2">
            <BookmarkCheck className="h-4 w-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              Active Borrows
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-stone-900 dark:text-stone-100">
            {activeBorrowsCount}
          </p>
        </div>
      </div>

      {/* Edit Form or Edit Trigger Button */}
      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="mt-6 space-y-4 animate-in fade-in duration-200"
        >
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1.5">
              Avatar Photo URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="w-full rounded-md border border-stone-200 bg-stone-50/50 px-4 py-2.5 text-sm text-stone-900 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-700/20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 rounded-md border border-stone-200 py-3 text-xs font-medium text-stone-700 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:text-stone-300 dark:hover:bg-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 rounded-md bg-[#9A3412] py-3 text-xs font-medium text-white transition-colors hover:bg-[#822B0F] disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-[#9A3412] hover:text-[#7C2D12] dark:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            Edit Name or Profile Photo
          </button>
        </div>
      )}
    </div>
  );
}
