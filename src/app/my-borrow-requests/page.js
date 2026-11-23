
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useSession } from "@/lib/auth-client";
import { borrowService } from "@/services/borrow.service";

function formatDate(date) {
  if (!date) return "Not available";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "Not available"
    : parsed.toLocaleDateString();
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    issued: "bg-blue-100 text-blue-700",
    returned: "bg-green-100 text-green-700",
    overdue: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status?.toUpperCase()}
    </span>
  );
}

export default function MyBorrowRequestsPage() {
  const { data: session, isPending } = useSession();

  const role = session?.user?.role?.trim().toLowerCase();

  const [requests, setRequests] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session || role !== "member") {
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [requestResult, recordResult] = await Promise.all([
          borrowService.getMyRequests(),
          borrowService.getMyRecords(),
        ]);

        if (!cancelled) {
          setRequests(requestResult.data || []);
          setRecords(recordResult.data || []);
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

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [session, isPending, role]);

  if (isPending) {
    return <p className="p-4 sm:p-8">Checking authentication...</p>;
  }

  if (!session) {
    return (
      <main className="p-4 sm:p-8">
        <p>Please login first.</p>
        <Link href="/login" className="text-blue-600">
          Login
        </Link>
      </main>
    );
  }

  if (role !== "member") {
    return <p className="p-4 sm:p-8">This page is only for members.</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Borrowing Activity
            </h1>
            <p className="mt-2 text-gray-500">
              Track your borrow requests and issued books.
            </p>
          </div>

          <Link
            href="/books"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white sm:w-auto"
          >
            Browse Books
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-12 text-center">Loading borrowing activity...</p>
        ) : (
          <>
            {/* Requests */}
            <section className="mb-10">
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                My Borrow Requests
              </h2>

              {requests.length === 0 ? (
                <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
                  You have no borrow requests yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border bg-white">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="p-4">Book</th>
                        <th className="p-4">Author</th>
                        <th className="p-4">Request Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {requests.map((request) => (
                        <tr key={request._id}>
                          <td className="p-4 font-medium text-gray-900">
                            {request.bookTitle}
                          </td>
                          <td className="p-4 text-gray-600">
                            {request.bookAuthor}
                          </td>
                          <td className="p-4 text-gray-600">
                            {formatDate(request.createdAt)}
                          </td>
                          <td className="p-4">
                            <StatusBadge status={request.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Borrowing History */}
            <section>
              <h2 className="mb-4 text-xl font-bold text-gray-900">
                My Borrowing History
              </h2>

              {records.length === 0 ? (
                <div className="rounded-xl border bg-white p-8 text-center text-gray-500">
                  No books have been issued to you yet.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border bg-white">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-gray-100 text-gray-600">
                      <tr>
                        <th className="p-4">Book</th>
                        <th className="p-4">Issue Date</th>
                        <th className="p-4">Due Date</th>
                        <th className="p-4">Return Date</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {records.map((record) => (
                        <tr key={record._id}>
                          <td className="p-4 font-medium text-gray-900">
                            {record.bookTitle}
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
                            <StatusBadge
                              status={record.status}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

      </div>
    </main>
  );
}
