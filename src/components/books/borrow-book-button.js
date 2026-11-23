
"use client";

import { useState } from "react";
import { borrowService } from "@/services/borrow.service";

export default function BorrowBookButton({ book }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleBorrow = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await borrowService.createRequest(book._id);

      setSubmitted(true);
      setMessage(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <button
        onClick={handleBorrow}
        disabled={
          loading ||
          submitted ||
          book.availableCopies <= 0
        }
        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {loading
          ? "Submitting Request..."
          : submitted
            ? "Request Submitted"
            : book.availableCopies <= 0
              ? "Currently Unavailable"
              : "Request to Borrow"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-green-600">
          {message}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
