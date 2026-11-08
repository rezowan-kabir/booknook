"use client";

import React, { useState } from "react";
import Image from "next/image";
import { BookOpen, BookmarkCheck, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileClientViewProps {
  user: {
    name: string;
    email: string;
    image: string;
  };
  booksAddedCount: number;
  activeBorrowsCount: number;
}

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=60";

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
      const result = await authClient.updateUser({
        name: name.trim(),
        image: image.trim(),
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!", {
        description: "Your name and photo are now live.",
      });
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="relative w-full max-w-lg rounded-2xl border-0 bg-white p-8 shadow-xl dark:border dark:border-stone-800 dark:bg-stone-900">
      
      <button
        type="button"
        onClick={() => router.push("/")}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full p-1.5 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-stone-800 dark:hover:text-stone-200"
      >
        <X className="h-5 w-5" />
      </button>

     
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 h-20 w-20 rounded-full border-2 border-amber-400 p-1 dark:border-amber-500/60">
          <Image
            src={image || FALLBACK_AVATAR}
            alt={name}
            width={68}
            height={68}
            unoptimized
            className="h-full w-full rounded-full object-cover"
          />
        </div>

        <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
          {name}
        </h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {user.email}
        </p>
        <span className="mt-1.5 text-sm font-semibold text-amber-800 dark:text-amber-400">
          BookNook Member
        </span>
      </div>

      <div className="my-5 border-t border-stone-200 dark:border-stone-800" />

      
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-stone-200 bg-[#FFFCF5] p-4 shadow-xs dark:border-stone-800 dark:bg-amber-950/20">
          <div className="mb-2 flex items-center gap-2 text-amber-800 dark:text-amber-400">
            <BookOpen className="h-4 w-4" />
            <span className="text-[13px] text-stone-500 dark:text-stone-400">
              Books Added
            </span>
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {booksAddedCount}
          </p>
        </div>

        <div className="rounded-lg border border-stone-200 bg-[#FFFCF5] p-4 shadow-xs dark:border-stone-800 dark:bg-amber-950/20">
          <div className="mb-2 flex items-center gap-2 text-amber-800 dark:text-amber-400">
            <BookmarkCheck className="h-4 w-4" />
            <span className="text-[13px] text-stone-500 dark:text-stone-400">
              Active Borrows
            </span>
          </div>
          <p className="text-xl font-bold text-stone-900 dark:text-stone-100">
            {activeBorrowsCount}
          </p>
        </div>
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSave}
          className="mt-6 space-y-4 animate-in fade-in duration-200"
        >
          <div className="space-y-1.5">
            <Label
              htmlFor="profile-name"
              className="text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200"
            >
              Display Name
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="profile-image"
              className="text-xs font-semibold uppercase tracking-wider text-stone-800 dark:text-stone-200"
            >
              Avatar Photo URL
            </Label>
            <Input
              id="profile-image"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
              className="h-10"
            />
          </div>

          <div className="flex items-center justify-end gap-4 border-t border-stone-200 pt-4 dark:border-stone-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="text-stone-500 hover:text-stone-700 dark:text-stone-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="min-w-[180px] bg-[#9A3412] text-white hover:bg-[#7C2D12] dark:bg-[#9A3412] dark:hover:bg-[#7C2D12]"
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer text-sm font-semibold text-[#9A3412] transition-colors hover:text-[#7C2D12] dark:text-amber-500 dark:hover:text-amber-400"
          >
            Edit Name or Profile Photo
          </button>
        </div>
      )}
    </div>
  );
}
