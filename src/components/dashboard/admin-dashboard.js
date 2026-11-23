
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { dashboardService } from "@/services/dashboard.service";
import StatCard from "@/components/dashboard/stat-card";

export default function AdminDashboard({ role = "admin" }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const fetchDashboard = async () => {
      try {
        const result = await dashboardService.getAdminDashboard();

        if (!cancelled) {
          setDashboard(result.data);
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
    return <p className="p-4 sm:p-8">Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className="m-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-950 dark:text-red-300 sm:m-6">
        {error}
      </div>
    );
  }

  const stats = dashboard?.overview || {};

  const adminCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: "📚",
      description: `${stats.totalCopies || 0} total copies`,
    },
    {
      title: "Available Copies",
      value: stats.availableCopies,
      icon: "📖",
      description: "Ready to borrow",
    },
    {
      title: "Total Members",
      value: stats.totalMembers,
      icon: "👨‍🎓",
      description: "Registered students",
    },
    {
      title: "Total Librarians",
      value: stats.totalLibrarians,
      icon: "👨‍💼",
      description: "Library staff",
    },
    {
      title: "Categories",
      value: stats.totalCategories,
      icon: "🏷️",
      description: "Book categories",
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: "⏳",
      description: "Awaiting approval",
    },
    {
      title: "Issued Books",
      value: stats.issuedBooks,
      icon: "📕",
      description: "Currently borrowed",
    },
    {
      title: "Overdue Books",
      value: stats.overdueBooks,
      icon: "⚠️",
      description: "Past due date",
    },
  ];

  const librarianCards = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: "📚",
      description: `${stats.availableCopies || 0} available copies`,
    },
    {
      title: "Pending Requests",
      value: stats.pendingRequests,
      icon: "⏳",
      description: "Require your attention",
    },
    {
      title: "Issued Books",
      value: stats.issuedBooks,
      icon: "📕",
      description: "Currently issued",
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
      description: "Past due date",
    },
  ];

  const cards = role === "admin" ? adminCards : librarianCards;

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
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-blue-600">
              {role === "admin" ? "Administrator Panel" : "Librarian Panel"}
            </p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {role === "admin" ? "Admin Dashboard" : "Librarian Dashboard"}
            </h1>

            <p className="mt-2 text-gray-500 dark:text-slate-400">
              Overview of university library activities.
            </p>
          </div>

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold capitalize text-blue-700 dark:bg-blue-950 dark:text-blue-300">
            {role}
          </span>
        </div>

        {/* Statistics */}
        <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
            Quick Actions
          </h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              href="/books"
              className="rounded-xl border bg-white p-4 transition hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-5"
            >
              <span className="text-2xl">📚</span>
              <h3 className="mt-3 font-semibold dark:text-white">
                Manage Books
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                View and manage library books.
              </p>
            </Link>

            <Link
              href="/categories"
              className="rounded-xl border bg-white p-4 transition hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-5"
            >
              <span className="text-2xl">🏷️</span>
              <h3 className="mt-3 font-semibold dark:text-white">
                Categories
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Organize book categories.
              </p>
            </Link>

            <Link
              href="/admin/borrow-requests"
              className="rounded-xl border bg-white p-4 transition hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-5"
            >
              <span className="text-2xl">📩</span>
              <h3 className="mt-3 font-semibold dark:text-white">
                Borrow Requests
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Review student requests.
              </p>
            </Link>

            <Link
              href="/admin/borrow-records"
              className="rounded-xl border bg-white p-4 transition hover:border-blue-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:p-5"
            >
              <span className="text-2xl">📋</span>
              <h3 className="mt-3 font-semibold dark:text-white">
                Borrow Records
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                Manage issued and returned books.
              </p>
            </Link>

          </div>
        </section>

        {/* Most Borrowed Books */}
        {role === "admin" && (
          <section className="mb-10 rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
            <h2 className="mb-5 text-xl font-bold text-gray-900 dark:text-white">
              Most Borrowed Books
            </h2>

            {(dashboard?.mostBorrowedBooks || []).length === 0 ? (
              <p className="text-gray-500 dark:text-slate-400">
                No borrowing history available yet.
              </p>
            ) : (
              <div className="space-y-4">
                {dashboard.mostBorrowedBooks.map((book) => (
                  <div
                    key={String(book.bookId)}
                    className="flex items-center justify-between gap-4 border-b pb-3 last:border-0 dark:border-slate-700"
                  >
                    <span className="min-w-0 break-words font-medium text-gray-800 dark:text-slate-200">
                      {book.bookTitle}
                    </span>

                    <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {book.borrowCount} times
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Recent Requests */}
        <section className="mb-10 rounded-xl border bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Borrow Requests
            </h2>

            <Link
              href="/admin/borrow-requests"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View All
            </Link>
          </div>

          {(dashboard?.recentRequests || []).length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400">
              No recent requests available.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="text-gray-500 dark:text-slate-400">
                  <tr>
                    <th className="pb-3">Book</th>
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y dark:divide-slate-700">
                  {dashboard.recentRequests.map((request) => (
                    <tr key={request._id}>
                      <td className="py-4 font-medium text-gray-800 dark:text-slate-200">
                        {request.bookTitle}
                      </td>

                      <td className="py-4 text-gray-600 dark:text-slate-400">
                        {request.memberName}
                      </td>

                      <td className="py-4 text-gray-600 dark:text-slate-400">
                        {formatDate(request.createdAt)}
                      </td>

                      <td className="py-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs capitalize text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                          {request.status || "unknown"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
