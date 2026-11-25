

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(apiUrl(`/api/books${endpoint}`), {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
}

export const bookService = {
  // Get all books
  getAll: (page = 1, limit = 12) =>
    apiRequest(`?page=${page}&limit=${limit}`),

  // Get single book
  getById: (id) =>
    apiRequest(`/${id}`),

  // Create book
  create: (bookData) =>
    apiRequest("/", {
      method: "POST",
      body: JSON.stringify(bookData),
    }),

  // Update book
  update: (id, bookData) =>
    apiRequest(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(bookData),
    }),

  // Delete book
  remove: (id) =>
    apiRequest(`/${id}`, {
      method: "DELETE",
    }),
};