"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Book } from "./page";

interface MyBooksListProps {
  initialBooks: Book[];
}


export default function MyBooksList({ initialBooks }: MyBooksListProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);

  // ডিলিট বা এডিটের ফাংশনালিটি চাইলে এখানে হ্যান্ডেল করতে পারেন
  const handleDelete = async (id: string) => {
    // আপনার ডিলিট এপিআই কল এখানে করবেন
    console.log("Delete book:", id);
  };

  if (books.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">You haven't added any books yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <th className="p-4">Book Details</th>
            <th className="p-4">Category</th>
            <th className="p-4">Copies</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y text-sm">
          {books.map((book) => (
            <tr key={book._id} className="hover:bg-gray-50">
              <td className="p-4 flex items-center gap-3">
                {book.imageUrl && (
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    width={40}
                    height={56}
                    className="h-14 w-10 object-cover rounded border"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{book.title}</p>
                  <p className="text-xs text-gray-500">By {book.author}</p>
                </div>
              </td>
              <td className="p-4 text-gray-600">{book.category}</td>
              <td className="p-4 text-gray-600 font-mono">
                {book.availableCopies} / {book.totalCopies} copies
              </td>
              <td className="p-4 text-right space-x-2">
                <button
                  className="px-3 py-1 text-xs font-medium border rounded text-blue-600 hover:bg-blue-50"
                  // onClick={() => ...}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="px-3 py-1 text-xs font-medium border rounded text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
