
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import BookForm from "@/components/books/book-form";
import { bookService } from "@/services/book.service";
import { useSession } from "@/lib/auth-client";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const role = session?.user?.role?.trim().toLowerCase();
  const isManager = role === "admin" || role === "librarian";

  const handleCreateBook = async (bookData) => {
    setLoading(true);
    setError("");

    try {
      await bookService.create(bookData);
      router.push("/books");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <p className="p-4 sm:p-8">Checking authentication...</p>;
  }

  if (!session || !isManager) {
    return (
      <main className="p-4 sm:p-8">
        <h1 className="text-xl font-bold text-red-600">
          Access Denied
        </h1>
        <p className="mt-2 text-gray-600">
          Only Admin and Librarian can add books.
        </p>
        <Link href="/books" className="mt-4 inline-block text-blue-600">
          Back to Books
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/books"
          className="text-sm font-medium text-blue-600"
        >
          ← Back to Books
        </Link>

        <h1 className="mb-2 mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
          Add New Book
        </h1>

        <p className="mb-6 text-gray-500">
          Add a new book to the university library.
        </p>

        <BookForm
          onSubmit={handleCreateBook}
          loading={loading}
          error={error}
          submitLabel="Create Book"
        />

      </div>
    </main>
  );
}
