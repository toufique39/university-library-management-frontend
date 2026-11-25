
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import BookForm from "@/components/books/book-form";
import { bookService } from "@/services/book.service";
import { useSession } from "@/lib/auth-client";

function EditBookPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: session, isPending: sessionPending } = useSession();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const role = session?.user?.role?.trim().toLowerCase();
  const isManager = role === "admin" || role === "librarian";

  useEffect(() => {
    if (sessionPending) return;

    if (!session || !isManager || !id) {
      return;
    }

    let cancelled = false;

    const fetchBook = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await bookService.getById(id);

        if (!cancelled) {
          setBook(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => {
      cancelled = true;
    };
  }, [id, session, sessionPending, isManager]);

  const handleUpdateBook = async (bookData) => {
    setSaving(true);
    setError("");

    try {
      await bookService.update(id, bookData);
      router.push("/books");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (sessionPending || (loading && isManager)) {
    return <p className="p-4 sm:p-8">Loading book information...</p>;
  }

  if (!session || !isManager) {
    return (
      <main className="p-4 sm:p-8">
        <h1 className="text-xl font-bold text-red-600">
          Access Denied
        </h1>
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
          Edit Book
        </h1>

        <p className="mb-6 text-gray-500">
          Update the selected book information.
        </p>

        {error && !book && (
          <p className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </p>
        )}

        {book && (
          <BookForm
            initialData={book}
            onSubmit={handleUpdateBook}
            loading={saving}
            error={error}
            submitLabel="Update Book"
          />
        )}

      </div>
    </main>
  );
}

export default function EditBookPageWrapper() {
  return (
    <Suspense fallback={<p className="p-4 sm:p-8">Loading book information...</p>}>
      <EditBookPage />
    </Suspense>
  );
}