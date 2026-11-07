"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  BookOpen,
  Eye,
  Loader2,
  Pencil,
  PlusCircle,
  SquarePen,
  Trash2,
  TriangleAlert,
  Upload,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface BookForm {
  title: string;
  author: string;
  category: string;
  totalCopies: string;
  imageUrl: string;
  description: string;
}

const categories = ["Fiction", "Science", "History", "Kids", "Other"];

const categoryColors: Record<string, string> = {
  Fiction: "text-amber-800 dark:text-amber-400",
  Science: "text-sky-700 dark:text-sky-400",
  History: "text-stone-700 dark:text-stone-300",
  Kids: "text-emerald-700 dark:text-emerald-400",
  Other: "text-violet-700 dark:text-violet-400",
};

const getBackendBaseUrl = () =>
  (
    process.env.NEXT_PUBLIC_BACKEND_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:8000"
      : undefined) ||
    ""
  ).replace(/\/+$/, "");

/** M/D/YYYY, matching the cataloged date in the design. */
const formatCataloged = (book: Book) => {
  let date: Date | null = null;

  if (book.createdAt) {
    const parsed = new Date(book.createdAt);
    if (!Number.isNaN(parsed.getTime())) date = parsed;
  }

  if (!date && /^[0-9a-f]{24}$/i.test(book._id)) {
    // Mongo ObjectIds embed their creation time in the first 4 bytes.
    date = new Date(parseInt(book._id.slice(0, 8), 16) * 1000);
  }

  return date ? date.toLocaleDateString("en-US") : "—";
};

export default function MyBooksList({
  initialBooks,
}: {
  initialBooks: Book[];
}) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [editing, setEditing] = useState<Book | null>(null);
  const [removing, setRemoving] = useState<Book | null>(null);
  const [form, setForm] = useState<BookForm>({
    title: "",
    author: "",
    category: "Fiction",
    totalCopies: "1",
    imageUrl: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // `books` is seeded from the server-rendered props and kept consistent by
  // the save/delete handlers below — no effect needed. (router.refresh() after
  // a delete re-renders with data that already matches local state.)

  const openEdit = (book: Book) => {
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      totalCopies: String(book.totalCopies),
      imageUrl: book.imageUrl ?? "",
      description: book.description ?? "",
    });
    setEditing(book);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast.error("ImgBB API key not found! Please check your .env.local.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        { method: "POST", body: formData },
      );
      const data = await response.json();

      if (data.success) {
        setForm((prev) => ({ ...prev, imageUrl: data.data.url }));
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const backendBaseUrl = getBackendBaseUrl();
    if (!backendBaseUrl) {
      toast.error("Backend URL is not configured.");
      return;
    }

    try {
      setSaving(true);

      const res = await fetch(
        `${backendBaseUrl}/my-books/${editing._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.title.trim(),
            author: form.author.trim(),
            category: form.category,
            totalCopies: Number(form.totalCopies),
            imageUrl: form.imageUrl.trim(),
            description: form.description.trim(),
          }),
        },
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // Surface the backend's reason instead of a generic failure.
        throw new Error(data?.message || "Failed to save changes.");
      }

      const updated = data.result as Book;
      setBooks((prev) =>
        prev.map((book) => (book._id === updated._id ? updated : book)),
      );
      setEditing(null);

      toast.success("Book updated!", {
        description: `${updated.title} has been saved to the catalog.`,
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong!",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!removing) return;

    const backendBaseUrl = getBackendBaseUrl();
    if (!backendBaseUrl) {
      toast.error("Backend URL is not configured.");
      return;
    }

    try {
      setDeleting(true);

      const res = await fetch(`${backendBaseUrl}/my-books/${removing._id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // e.g. 409 while copies are still out on loan.
        throw new Error(data?.message || "Failed to remove the book.");
      }

      const removedTitle = removing.title;
      setBooks((prev) => prev.filter((book) => book._id !== removing!._id));
      setRemoving(null);

      toast.success("Book removed", {
        description: `${removedTitle} is no longer in the catalog.`,
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong!",
      );
    } finally {
      setDeleting(false);
    }
  };

  if (books.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-stone-200 bg-white/60 px-6 py-20 text-center dark:border-stone-800 dark:bg-stone-900/20">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-stone-400" />
        <p className="mb-1 text-sm font-medium text-stone-700 dark:text-stone-300">
          You haven&apos;t added any books yet
        </p>
        <p className="text-xs text-stone-500 dark:text-stone-400">
          Publish your first title to start building your curator shelf.
        </p>
        <Button
          className="mt-5 bg-amber-800 text-stone-100 hover:bg-amber-900 dark:bg-amber-700 dark:hover:bg-amber-800"
          render={<Link href="/add-book" />}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          Add a Book
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900/60">
        <Table className="min-w-[860px]">
          <TableHeader>
            <TableRow className="border-stone-200 bg-stone-50/60 hover:bg-stone-50/60 dark:border-stone-800 dark:bg-stone-900/40 dark:hover:bg-stone-900/40">
              <TableHead className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Book Details
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Category
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Available / Total
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Date Cataloged
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => (
              <TableRow
                key={book._id}
                className="border-stone-100 hover:bg-stone-50/60 dark:border-stone-800 dark:hover:bg-stone-900/40"
              >
                <TableCell className="max-w-[280px] px-6 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    {book.imageUrl ? (
                      <Image
                        src={book.imageUrl}
                        alt={book.title}
                        width={40}
                        height={56}
                        className="h-14 w-10 shrink-0 rounded-sm border border-stone-200 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-14 w-10 shrink-0 items-center justify-center rounded-sm border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800">
                        <BookOpen className="h-4 w-4 text-stone-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-serif text-sm font-medium text-stone-900 dark:text-stone-100">
                        {book.title}
                      </p>
                      <p className="truncate text-xs text-stone-500 dark:text-stone-400">
                        By {book.author}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell
                  className={`px-6 py-4 text-xs font-medium ${
                    categoryColors[book.category] ?? "text-stone-600"
                  }`}
                >
                  {book.category}
                </TableCell>

                <TableCell className="px-6 py-4 font-mono text-xs">
                  <span
                    className={
                      book.availableCopies > 0
                        ? "font-semibold text-emerald-600 dark:text-emerald-400"
                        : "font-semibold text-red-600 dark:text-red-400"
                    }
                  >
                    {book.availableCopies}
                  </span>
                  <span className="text-stone-400 dark:text-stone-500">
                    {" "}
                    / {book.totalCopies} copies
                  </span>
                </TableCell>

                <TableCell className="px-6 py-4 font-mono text-xs text-stone-500 dark:text-stone-400">
                  {formatCataloged(book)}
                </TableCell>

                <TableCell className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`View ${book.title}`}
                      render={<Link href={`/all-books/${book._id}`} />}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(book)}
                      className="border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/40"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setRemoving(book)}
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit dialog */}
      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="border-b border-stone-200 pb-4 dark:border-stone-800">
            <DialogTitle className="flex items-center gap-2 text-lg">
              <SquarePen className="h-4 w-4 text-orange-600 dark:text-orange-500" />
              Edit Book Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              Update the catalog details for this title. Changes are visible to
              everyone browsing the library.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="edit-title"
                className="text-[11px] font-semibold uppercase tracking-wider"
              >
                Book Title *
              </Label>
              <Input
                id="edit-title"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                required
                className="h-10"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="edit-author"
                  className="text-[11px] font-semibold uppercase tracking-wider"
                >
                  Author Name *
                </Label>
                <Input
                  id="edit-author"
                  value={form.author}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, author: e.target.value }))
                  }
                  required
                  className="h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider">
                  Category *
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(value) => {
                    if (value !== null)
                      setForm((prev) => ({ ...prev, category: value }));
                  }}
                >
                  <SelectTrigger className="h-10 w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="edit-copies"
                className="text-[11px] font-semibold uppercase tracking-wider"
              >
                Total Copies *
              </Label>
              <Input
                id="edit-copies"
                type="number"
                min={1}
                value={form.totalCopies}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    totalCopies: e.target.value,
                  }))
                }
                required
                className="h-10"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="edit-image"
                className="text-[11px] font-semibold uppercase tracking-wider"
              >
                Book Cover Image  *
              </Label>
              <div className="flex gap-2">
                <Input
                  id="edit-image"
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  placeholder="https://i.ibb.co/... or any image URL"
                  className="h-10 flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 shrink-0 gap-1.5"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Upload className="h-3.5 w-3.5" />
                  )}
                  {uploading ? "Uploading…" : "Upload"}
                </Button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {form.imageUrl ? (
                <div className="flex items-center gap-3 rounded-sm border border-stone-200 bg-stone-50 p-2 dark:border-stone-700 dark:bg-stone-800/60">
                  {/* eslint-disable-next-line @next/next/no-img-element -- covers are user-supplied URLs that may fall outside next.config remotePatterns */}
                  <img
                    src={form.imageUrl}
                    alt=""
                    className="h-16 w-11 shrink-0 rounded-sm border border-stone-200 object-cover"
                  />
                  <span className="min-w-0 flex-1 truncate text-xs text-stone-500 dark:text-stone-400">
                    {form.imageUrl}
                  </span>
                </div>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="edit-description"
                className="text-[11px] font-semibold uppercase tracking-wider"
              >
                Short Description *
              </Label>
              <Textarea
                id="edit-description"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                required
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditing(null)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || uploading}
                className="bg-amber-900 text-stone-100 hover:bg-amber-950 dark:bg-amber-800 dark:hover:bg-amber-700"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : null}
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={removing !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setRemoving(null);
        }}
      >
        <AlertDialogContent className="sm:max-w-md!">
          {/* AlertDialogContent ships no close button (Dialog does) — add one. */}
          <AlertDialogCancel
            variant="ghost"
            size="icon-sm"
            className="absolute top-2 right-2"
            aria-label="Close"
          >
            <XIcon />
          </AlertDialogCancel>

          <AlertDialogHeader className="place-items-start pr-6 text-left">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-red-100 dark:bg-red-950/40">
                <TriangleAlert className="size-5 text-red-600 dark:text-red-400" />
              </span>
              <div className="space-y-1">
                <AlertDialogTitle className="text-lg font-semibold">
                  Delete Book
                </AlertDialogTitle>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </AlertDialogHeader>

          <AlertDialogDescription>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-stone-900 dark:text-stone-100">
              &quot;{removing?.title}&quot;
            </span>{" "}
            from the library catalog?
          </AlertDialogDescription>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-rose-600 text-white hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
              {deleting ? "Removing…" : "Yes, Delete Book"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
