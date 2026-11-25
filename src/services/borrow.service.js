
const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function borrowRequest(endpoint, options = {}) {
  const response = await fetch(
    `${API_URL}/api/borrow${endpoint}`,
    {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      result.message || "Borrowing request failed."
    );
  }

  return result;
}

export const borrowService = {
  // Member: Create borrow request
  createRequest: (bookId) =>
    borrowRequest("/requests", {
      method: "POST",
      body: JSON.stringify({ bookId }),
    }),

  // Member: Get own requests
  getMyRequests: () =>
    borrowRequest("/requests/my"),

  // Admin/Librarian: Get all requests
  getAllRequests: (status = "pending") =>
    borrowRequest(`/requests?status=${status}`),

  // Admin/Librarian: Approve
  approveRequest: (id) =>
    borrowRequest(`/requests/${id}/approve`, {
      method: "PATCH",
    }),

  // Admin/Librarian: Reject
  rejectRequest: (id) =>
    borrowRequest(`/requests/${id}/reject`, {
      method: "PATCH",
    }),

  // Member: Get own borrowing records
  getMyRecords: () =>
    borrowRequest("/records/my"),

  // Admin/Librarian: Get all borrowing records
  getAllRecords: (status = "all") =>
    borrowRequest(`/records?status=${status}`),

  // Admin/Librarian: Return book
  returnBook: (id) =>
    borrowRequest(`/records/${id}/return`, {
      method: "PATCH",
    }),
};
