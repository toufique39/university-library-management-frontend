
"use client";

import { useEffect, useState } from "react";
import { bookService } from "@/services/book.service";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import BorrowBookButton from "@/components/books/borrow-book-button";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [retry, setRetry] = useState(0);
const { data: session } = useSession();

const role = session?.user?.role?.trim().toLowerCase();
const isMember = role === "member";
const isManager = role === "admin" || role === "librarian";

const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchBooks = async () => {
      try {
        const result = await bookService.getAll(page);

        if (cancelled) return;

        setBooks(result.data || []);
        setPagination(result.pagination || null);
        setError("");
      } catch (err) {
        if (cancelled) return;

        setError(err.message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBooks();

    return () => {
      cancelled = true;
    };
  }, [page, retry]);


const handleDelete = async (id) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this book?"
  );

  if (!confirmed) return;

  setDeletingId(id);
  setError("");

  try {
    await bookService.remove(id);

    setBooks((prev) => prev.filter((book) => book._id !== id));

    setPagination((prev) =>
      prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev
    );

    // If the last book on this page was deleted, move to the previous page.
    if (books.length === 1 && page > 1) {
      setLoading(true);
      setPage((prev) => prev - 1);
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setDeletingId(null);
  }
};

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Library Books
            </h1>

            <p className="mt-2 text-gray-500">
              Browse and manage university library books.
            </p>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto">
            {isManager && (
              <Link
                href="/books/new"
                className="flex-1 rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700 sm:flex-none"
              >
                + Add New Book
              </Link>
            )}

            <div className="rounded-lg bg-blue-100 px-4 py-2 text-blue-700">
              Total Books: {pagination?.total ?? 0}
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-16 text-center">
            Loading books...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-lg bg-red-100 p-4 text-red-700">
            {error}

            <button
              onClick={() => {
                setLoading(true);
                setError("");
                setRetry((prev) => prev + 1);
              }}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && books.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No Books Found
            </h2>

            <p className="mt-2 text-gray-500">
              No books have been added to the library yet.
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {books.map((book) => (
              <div
                key={book._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-40 items-center justify-center bg-gray-100">
                  {book.coverImage ? (
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      width={300}
                      height={160}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-5xl">📚</span>
                  )}
                </div>

                <div className="space-y-3 p-5">

                  <div>
                    <h2 className="line-clamp-2 text-lg font-bold text-gray-900">
                      {book.title}
                    </h2>

                    <p className="mt-1 line-clamp-1 text-sm text-gray-500">
                      By {book.author}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="max-w-full truncate rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                      {book.category}
                    </span>

                    <span className="max-w-full truncate text-xs text-gray-500">
                      {book.isbn}
                    </span>
                  </div>

                  <div className="border-t pt-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Copies</span>
                      <span>{book.totalCopies}</span>
                    </div>

                    <div className="mt-2 flex justify-between">
                      <span className="text-gray-600">
                        Available
                      </span>

                      <span className="font-semibold text-green-600">
                        {book.availableCopies}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-400">
                    Shelf: {book.shelfLocation || "Not specified"}
                  </div>
                  
{isMember && (
  <BorrowBookButton book={book} />
)}
<div>
{isManager && (
  <div className="mt-4 flex gap-2 border-t pt-4">

    <Link
      href={`/books/${book._id}/edit`}
      className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
    >
      Edit
    </Link>

    <button
      onClick={() => handleDelete(book._id)}
      disabled={deletingId === book._id}
      className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
    >
      {deletingId === book._id ? "Deleting..." : "Delete"}
    </button>

  </div>
)}
</div>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination && pagination.totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">

            <button
              disabled={page <= 1}
              onClick={() => {
                setLoading(true);
                setError("");
                setPage((prev) => prev - 1);
              }}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <button
              disabled={page >= pagination.totalPages}
              onClick={() => {
                setLoading(true);
                setError("");
                setPage((prev) => prev + 1);
              }}
              className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>

          </div>
        )}

      </div>

    </main>
  );
}