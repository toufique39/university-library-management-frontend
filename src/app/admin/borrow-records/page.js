
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useSession } from "@/lib/auth-client";
import { borrowService } from "@/services/borrow.service";

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString();
}

export default function BorrowRecordsPage() {
  const { data: session, isPending } = useSession();

  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState("all");

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const role = session?.user?.role?.trim().toLowerCase();
  const isManager = role === "admin" || role === "librarian";

  const fetchRecords = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await borrowService.getAllRecords(status);
      setRecords(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending || !session || !isManager) return;

    let cancelled = false;

    const loadRecords = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await borrowService.getAllRecords(status);

        if (!cancelled) {
          setRecords(result.data || []);
          setError("");
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

    loadRecords();

    return () => {
      cancelled = true;
    };
  }, [session, isPending, isManager, status]);

  const handleReturn = async (record) => {
    const confirmed = window.confirm(
      `Confirm return of "${record.bookTitle}" from ${record.memberName}?`
    );

    if (!confirmed) return;

    setProcessingId(record._id);
    setError("");
    setSuccess("");

    try {
      await borrowService.returnBook(record._id);

      setSuccess("Book returned successfully.");

      await fetchRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  if (isPending) {
    return <p className="p-4 sm:p-8">Checking authentication...</p>;
  }

  if (!session) {
    return (
      <main className="p-4 sm:p-8">
        Please login first.
        <Link href="/login" className="ml-2 text-blue-600">
          Login
        </Link>
      </main>
    );
  }

  if (!isManager) {
    return <p className="p-4 text-red-600 sm:p-8">Access Denied.</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Borrow Records
            </h1>

            <p className="mt-2 text-gray-500">
              Manage issued and returned library books.
            </p>
          </div>

          <Link
            href="/admin/borrow-requests"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white sm:w-auto"
          >
            Borrow Requests
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-6 rounded-xl border bg-white p-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Filter Records
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full max-w-xs rounded-lg border bg-white px-4 py-3 text-gray-900"
          >
            <option value="all">All Records</option>
            <option value="issued">Currently Issued</option>
            <option value="returned">Returned Books</option>
          </select>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-gray-900">
            Borrowing History
          </h2>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            {records.length} Records
          </span>
        </div>

        {loading ? (
          <p className="py-12 text-center">
            Loading borrowing records...
          </p>
        ) : records.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
            No borrowing records found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4">Book</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Due Date</th>
                  <th className="p-4">Return Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {records.map((record) => (
                  <tr key={record._id}>
                    <td className="p-4 font-semibold text-gray-900">
                      {record.bookTitle}
                    </td>

                    <td className="p-4">
                      <p className="font-medium text-gray-800">
                        {record.memberName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.memberEmail}
                      </p>
                    </td>

                    <td className="p-4 text-gray-600">
                      {formatDate(record.issuedAt)}
                    </td>

                    <td className="p-4 text-gray-600">
                      {formatDate(record.dueDate)}
                    </td>

                    <td className="p-4 text-gray-600">
                      {formatDate(record.returnedAt)}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          record.status === "issued"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {(record.status || "unknown").toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4">
                      {record.status === "issued" ? (
                        <button
                          onClick={() => handleReturn(record)}
                          disabled={processingId === record._id}
                          className="rounded-lg bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {processingId === record._id
                            ? "Processing..."
                            : "Return Book"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
