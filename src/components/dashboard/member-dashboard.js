
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { dashboardService } from "@/services/dashboard.service";
import StatCard from "@/components/dashboard/stat-card";

export default function MemberDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [overdueIds, setOverdueIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        const result = await dashboardService.getMemberDashboard();

        if (!cancelled) {
          setDashboard(result.data);

          const now = Date.now();

          setOverdueIds(
            new Set(
              (result.data?.myActiveRecords || [])
                .filter(
                  (record) =>
                    record.dueDate &&
                    new Date(record.dueDate).getTime() < now
                )
                .map((record) => record._id)
            )
          );
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

    fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="p-4 sm:p-8">Loading your dashboard...</p>;
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-950 dark:text-red-300 sm:m-6">
        {error}
      </div>
    );
  }

  const stats = dashboard?.overview || {};

  const cards = [
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: "⏳",
      description: "Waiting for approval",
    },
    {
      title: "Currently Borrowed",
      value: stats.issuedBooks,
      icon: "📚",
      description: "Books with you",
    },
    {
      title: "Returned Books",
      value: stats.returnedBooks,
      icon: "📗",
      description: "Successfully returned",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: "⚠️",
      description: "Past their due date",
    },
  ];

  const activeRecords = dashboard?.myActiveRecords || [];
  const recentRequests = dashboard?.recentRequests || [];

  const formatDate = (date) => {
    if (!date) return "—";

    const parsed = new Date(date);

    return Number.isNaN(parsed.getTime())
      ? "—"
      : parsed.toLocaleDateString();
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 dark:bg-slate-950 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="font-semibold text-blue-600">
            Student Portal
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            My Library Dashboard
          </h1>

          <p className="mt-2 text-gray-500 dark:text-slate-400">
            Manage your books and track your borrowing activities.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/books"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Explore Books
          </Link>

          <Link
            href="/my-borrow-requests"
            className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          >
            My Borrowing History
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* Currently Borrowed Books */}
        <section className="mb-10 rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-6">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Currently Borrowed Books
            </h2>

            <Link
              href="/my-borrow-requests"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View History
            </Link>
          </div>

          {activeRecords.length === 0 ? (
            <div className="rounded-lg bg-gray-50 p-8 text-center dark:bg-slate-800">
              <div className="text-4xl">📚</div>

              <p className="mt-3 font-medium text-gray-800 dark:text-white">
                No borrowed books yet
              </p>

              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                Explore the library and request your first book.
              </p>

              <Link
                href="/books"
                className="mt-4 inline-block font-semibold text-blue-600 hover:underline"
              >
                Browse Books →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="text-gray-500 dark:text-slate-400">
                  <tr>
                    <th className="pb-4">Book</th>
                    <th className="pb-4">Issue Date</th>
                    <th className="pb-4">Due Date</th>
                    <th className="pb-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y dark:divide-slate-700">
                  {activeRecords.map((record) => {
                    const overdue = overdueIds.has(record._id);

                    return (
                      <tr key={record._id}>
                        <td className="py-4 font-semibold text-gray-800 dark:text-slate-200">
                          {record.bookTitle}
                        </td>

                        <td className="py-4 text-gray-600 dark:text-slate-400">
                          {formatDate(record.issuedAt)}
                        </td>

                        <td className="py-4 text-gray-600 dark:text-slate-400">
                          {formatDate(record.dueDate)}
                        </td>

                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              overdue
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {overdue ? "OVERDUE" : "ISSUED"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Recent Borrow Requests */}
        <section className="rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-6">

          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Borrow Requests
            </h2>

            <Link
              href="/my-borrow-requests"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <p className="py-6 text-center text-gray-500 dark:text-slate-400">
              You have not submitted any borrow requests.
            </p>
          ) : (
            <div className="space-y-4">
              {recentRequests.map((request) => (
                <div
                  key={request._id}
                  className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 last:border-0 dark:border-slate-700"
                >
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-gray-800 dark:text-white">
                      {request.bookTitle}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                      Requested: {formatDate(request.createdAt)}
                    </p>
                  </div>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold capitalize text-yellow-700">
                    {request.status || "unknown"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
