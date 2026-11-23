
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useSession } from "@/lib/auth-client";
import { borrowService } from "@/services/borrow.service";

export default function BorrowRequestsPage() {
  const { data: session, isPending } = useSession();

  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("pending");

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const role = session?.user?.role?.trim().toLowerCase();
  const isManager = role === "admin" || role === "librarian";

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await borrowService.getAllRequests(status);
      setRequests(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending || !session || !isManager) return;

    let cancelled = false;

    const loadRequests = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await borrowService.getAllRequests(status);

        if (!cancelled) {
          setRequests(result.data || []);
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

    loadRequests();

    return () => {
      cancelled = true;
    };
  }, [session, isPending, isManager, status]);

  const handleAction = async (id, action) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this borrow request?`
    );

    if (!confirmed) return;

    setProcessingId(id);
    setError("");
    setSuccess("");

    try {
      if (action === "approve") {
        await borrowService.approveRequest(id);
        setSuccess("Request approved and book issued successfully.");
      } else {
        await borrowService.rejectRequest(id);
        setSuccess("Borrow request rejected successfully.");
      }

      await fetchRequests();
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
        Please login to continue.
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
              Borrow Requests
            </h1>
            <p className="mt-2 text-gray-500">
              Review and manage student borrowing requests.
            </p>
          </div>

          <Link
            href="/admin/borrow-records"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center font-semibold text-white sm:w-auto"
          >
            Borrow Records
          </Link>
        </div>

        {/* Filter */}
        <div className="mb-6 rounded-xl border bg-white p-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Filter by Status
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full max-w-xs rounded-lg border bg-white px-4 py-3 text-gray-900"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="all">All Requests</option>
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
            {status === "all"
              ? "All Requests"
              : `${status.charAt(0).toUpperCase()}${status.slice(1)} Requests`}
          </h2>

          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            {requests.length} Requests
          </span>
        </div>

        {loading ? (
          <p className="py-12 text-center">Loading requests...</p>
        ) : requests.length === 0 ? (
          <div className="rounded-xl border bg-white p-12 text-center text-gray-500">
            No borrow requests found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-4">Book</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Request Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {requests.map((request) => (
                  <tr key={request._id}>
                    <td className="p-4">
                      <p className="font-semibold text-gray-900">
                        {request.bookTitle}
                      </p>
                      <p className="text-xs text-gray-500">
                        {request.bookAuthor}
                      </p>
                    </td>

                    <td className="p-4 text-gray-700">
                      {request.memberName}
                    </td>

                    <td className="p-4 text-gray-600">
                      {request.memberEmail}
                    </td>

                    <td className="p-4 text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold capitalize text-gray-700">
                        {request.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {request.status === "pending" ? (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              handleAction(request._id, "approve")
                            }
                            disabled={processingId === request._id}
                            className="rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                          >
                            {processingId === request._id
                              ? "Processing..."
                              : "Approve"}
                          </button>

                          <button
                            onClick={() =>
                              handleAction(request._id, "reject")
                            }
                            disabled={processingId === request._id}
                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">
                          No actions
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
