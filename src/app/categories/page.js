
"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { categoryService } from "@/services/category.service";

export default function CategoriesPage() {
  const { data: session, isPending } = useSession();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const role = session?.user?.role?.trim().toLowerCase();
  const isManager = role === "admin" || role === "librarian";

  const fetchCategories = async () => {
    try {
      const result = await categoryService.getAll();
      setCategories(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending || !session) return;

    void Promise.resolve().then(fetchCategories);
  }, [session, isPending]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
      };

      if (editingId) {
        await categoryService.update(editingId, payload);
        setSuccess("Category updated successfully.");
      } else {
        await categoryService.create(payload);
        setSuccess("Category created successfully.");
      }

      resetForm();
      await fetchCategories();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || "");
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    setDeletingId(category._id);
    setError("");
    setSuccess("");

    try {
      await categoryService.remove(category._id);

      setCategories((prev) =>
        prev.filter((item) => item._id !== category._id)
      );

      setSuccess("Category deleted successfully.");

      if (editingId === category._id) {
        resetForm();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending) {
    return <p className="p-4 sm:p-8">Loading categories...</p>;
  }

  if (!session) {
    return (
      <main className="p-4 sm:p-8">
        <p>Please login to view categories.</p>
      </main>
    );
  }

  if (loading) {
    return <p className="p-4 sm:p-8">Loading categories...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Book Categories
          </h1>

          <p className="mt-2 text-gray-500">
            Browse and manage university library categories.
          </p>
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

        {/* Add/Edit Form */}
        {isManager && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 space-y-4 rounded-xl border bg-white p-4 shadow-sm sm:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? "Edit Category" : "Add New Category"}
            </h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Category Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Computer Science"
                maxLength={80}
                required
                className="w-full rounded-lg border px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write category description..."
                maxLength={500}
                rows={3}
                className="w-full rounded-lg border px-4 py-3 text-gray-900 outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Category"
                    : "Create Category"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-lg border px-6 py-3 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {/* Categories List */}
        <div className="rounded-xl border bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4 sm:p-5">
            <h2 className="text-xl font-semibold text-gray-900">
              All Categories
            </h2>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {categories.length} Categories
            </span>
          </div>

          {categories.length === 0 ? (
            <p className="p-10 text-center text-gray-500">
              No categories found.
            </p>
          ) : (
            <div className="divide-y">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5"
                >
                  <div className="min-w-0 flex-1 break-words">
                    <h3 className="font-semibold text-gray-900">
                      {category.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {category.description || "No description available."}
                    </p>

                    <p className="mt-2 break-all text-xs text-gray-400">
                      Slug: {category.slug}
                    </p>
                  </div>

                  {isManager && (
                    <div className="flex w-full gap-2 sm:w-auto">
                      <button
                        onClick={() => handleEdit(category)}
                        className="rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(category)}
                        disabled={deletingId === category._id}
                        className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        {deletingId === category._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
