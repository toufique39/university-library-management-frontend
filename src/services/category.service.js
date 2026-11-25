
async function categoryRequest(endpoint = "", options = {}) {
  const response = await fetch(
    apiUrl(`/api/categories${endpoint}`),
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
    throw new Error(result.message || "Category request failed.");
  }

  return result;
}

export const categoryService = {
  getAll: () => categoryRequest(),

  getById: (id) => categoryRequest(`/${id}`),

  create: (data) =>
    categoryRequest("", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id, data) =>
    categoryRequest(`/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  remove: (id) =>
    categoryRequest(`/${id}`, {
      method: "DELETE",
    }),
};