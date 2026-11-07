"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Compass,
  PlusCircle,
  Upload,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

const categories = ["Fiction", "Science", "History", "Kids", "Other"];

export default function AddBookPage() {
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;
  const userName = user?.name ?? "";
  const userEmail = user?.email ?? "";
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [totalCopies, setTotalCopies] = useState("3");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error(
        "ImgBB API key not found! Please check your .env.local file.",
      );
      setUploading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred while uploading the image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in before adding a book.");
      return;
    }

    const bookData = {
      title,
      author,
      category,
      totalCopies: Number(totalCopies),
      imageUrl,
      description,
      addedBy: {
        name: userName,
        email: userEmail,
      },
    };
    try {
      const backendBaseUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
        (process.env.NODE_ENV === "development"
          ? "http://localhost:8000"
          : undefined);

      if (!backendBaseUrl) {
        throw new Error("NEXT_PUBLIC_BACKEND_BASE_URL is not configured.");
      }

      const res = await fetch(`${backendBaseUrl.replace(/\/+$/, "")}/add-book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to add book.");
      }

      console.log("Book submission response:", data);
      toast.success("Book successfully added to the collection!");
    } catch (error) {
      console.error("Error submitting book:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to add book.",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
          <Compass className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            Community Contribution
          </span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900 dark:text-stone-100 mb-1">
          Add a New Book
        </h1>
        <p className="text-xs text-stone-600 dark:text-stone-400">
          Contribute a volume to the library collection by filling out the
          details below.
        </p>
      </div>

      {/* Form Card */}
      <Card className="bg-stone-50/50 dark:bg-stone-900/50 border-stone-200 dark:border-stone-800 rounded-lg">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="title"
                className="text-xs font-medium text-stone-700 dark:text-stone-300"
              >
                Book Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Shadow of the Wind"
                required
                className="h-9 text-xs"
              />
            </div>

            {/* Author & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="author"
                  className="text-xs font-medium text-stone-700 dark:text-stone-300"
                >
                  Author Name *
                </Label>
                <Input
                  id="author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Carlos Ruiz Zafón"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                  Category *
                </Label>
                <Select
                  value={category}
                  onValueChange={(value) => {
                    if (value !== null) setCategory(value);
                  }}
                >
                  <SelectTrigger className="h-9 text-xs w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="text-xs">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Total Copies */}
            <div className="space-y-1.5">
              <Label
                htmlFor="copies"
                className="text-xs font-medium text-stone-700 dark:text-stone-300"
              >
                Total Copies to Stock *
              </Label>
              <Input
                id="copies"
                type="number"
                value={totalCopies}
                onChange={(e) => setTotalCopies(e.target.value)}
                min="1"
                required
                className="h-9 text-xs"
              />
            </div>

            {/* Image Input Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-stone-700 dark:text-stone-300">
                  Book Cover Image *
                </Label>
                <div className="flex gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setUploadMode("file")}
                    className={`font-medium transition-colors ${
                      uploadMode === "file"
                        ? "text-amber-700 dark:text-amber-400 underline"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    Upload File
                  </button>
                  <span className="text-stone-300">|</span>
                  <button
                    type="button"
                    onClick={() => setUploadMode("url")}
                    className={`font-medium transition-colors ${
                      uploadMode === "url"
                        ? "text-amber-700 dark:text-amber-400 underline"
                        : "text-stone-400 hover:text-stone-600"
                    }`}
                  >
                    Paste Image Link
                  </button>
                </div>
              </div>

              {uploadMode === "file" ? (
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 h-9 px-3 rounded-md border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    {uploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        {imageUrl ? "Change Image File" : "Select from PC"}
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400" />
                  <Input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://i.ibb.co/... or any image URL"
                    required
                    className="h-9 text-xs pl-9"
                  />
                </div>
              )}

              {imageUrl && (
                <p className="text-[11px] text-green-600 dark:text-green-400 truncate pt-1">
                  ✓ Image source ready: {imageUrl}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label
                htmlFor="description"
                className="text-xs font-medium text-stone-700 dark:text-stone-300"
              >
                Short Description *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a concise overview of the book's premise, themes, and why readers will enjoy it..."
                required
                rows={3}
                className="text-xs resize-none"
              />
            </div>

            {/* Read-Only User Info Section (Bottom of Form) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
              <div className="space-y-1.5">
                <Label
                  htmlFor="userName"
                  className="text-xs font-medium text-stone-500 dark:text-stone-400"
                >
                  Contributor Name (Logged In)
                </Label>
                <Input
                  id="userName"
                  value={userName}
                  readOnly
                  placeholder={sessionPending ? "Loading account..." : "Sign in to populate"}
                  className="h-9 text-xs bg-stone-100/60 dark:bg-stone-800/40 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="userEmail"
                  className="text-xs font-medium text-stone-500 dark:text-stone-400"
                >
                  Contributor Email (Logged In)
                </Label>
                <Input
                  id="userEmail"
                  value={userEmail}
                  readOnly
                  placeholder={sessionPending ? "Loading account..." : "Sign in to populate"}
                  className="h-9 text-xs bg-stone-100/60 dark:bg-stone-800/40 text-stone-500 dark:text-stone-400 border-stone-200 dark:border-stone-800 cursor-not-allowed"
                />
              </div>
            </div>
            {!sessionPending && !user && (
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Please{" "}
                <Link
                  href="/login"
                  className="font-medium text-amber-800 underline dark:text-amber-400"
                >
                  sign in
                </Link>{" "}
                to add a book. Your contributor details will fill in
                automatically.
              </p>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={uploading || sessionPending || !user}
                className="bg-amber-800 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-800 text-white text-xs h-9 px-5 font-medium"
              >
                <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
                Publish Book
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
