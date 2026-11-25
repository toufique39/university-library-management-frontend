
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { categoryService } from "@/services/category.service";
const emptyForm = {
  title: "",
  author: "",
  isbn: "",
  category: "",
  description: "",
  publisher: "",
  publishedYear: "",
  totalCopies: "1",
  shelfLocation: "",
  coverImage: "",
};

const normalizeInitialData = (data) =>
  data
    ? {
        ...emptyForm,
        ...data,
        publishedYear: data.publishedYear ?? "",
        totalCopies: String(data.totalCopies ?? 1),
      }
    : emptyForm;

export default function BookForm({
  initialData,
  onSubmit,
  loading,
  error,
  submitLabel = "Save Book",
}) {
  const [formData, setFormData] = useState(() =>
    normalizeInitialData(initialData),
  );
  const [previousInitialData, setPreviousInitialData] = useState(initialData);

  if (initialData !== previousInitialData) {
    setPreviousInitialData(initialData);
    setFormData(normalizeInitialData(initialData));
  }


const [categories, setCategories] = useState([]);
const [categoryLoading, setCategoryLoading] = useState(true);
const [categoryError, setCategoryError] = useState("");

useEffect(() => {
  let cancelled = false;

  const fetchCategories = async () => {
    try {
      const result = await categoryService.getAll();

      if (!cancelled) {
        setCategories(result.data || []);
      }
    } catch (error) {
      if (!cancelled) {
        setCategoryError(
          error.message || "Failed to load categories."
        );
      }
    } finally {
      if (!cancelled) {
        setCategoryLoading(false);
      }
    }
  };

  fetchCategories();

  return () => {
    cancelled = true;
  };
}, []);



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      publishedYear: formData.publishedYear
        ? Number(formData.publishedYear)
        : null,
      totalCopies: Number(formData.totalCopies),
    };

    onSubmit(payload);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-xl border bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="grid gap-5 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Book Title *
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Author *
          </label>
          <input
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            ISBN *
          </label>
          <input
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter ISBN"
            className={inputClass}
            required
          />
        </div>

       
<div>
  <label className="mb-2 block text-sm font-medium text-gray-700">
    Category *
  </label>

  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    disabled={categoryLoading}
    className={inputClass}
  >
    <option value="">
      {categoryLoading ? "Loading categories..." : "Select a category"}
    </option>

    {categories.map((category) => (
      <option key={category._id} value={category.name}>
        {category.name}
      </option>
    ))}
  </select>

  {categoryError ? (
    <p className="mt-2 text-sm text-red-500">{categoryError}</p>
  ) : (
    categories.length === 0 &&
    !categoryLoading && (
      <p className="mt-2 text-sm text-red-500">
        No categories found. Please create a category first.
      </p>
    )
  )}
</div>


        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Publisher
          </label>
          <input
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            placeholder="Enter publisher"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Published Year
          </label>
          <input
            type="number"
            name="publishedYear"
            value={formData.publishedYear}
            onChange={handleChange}
            placeholder="e.g. 2024"
            min="0"
            max="9999"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Total Copies *
          </label>
          <input
            type="number"
            name="totalCopies"
            value={formData.totalCopies}
            onChange={handleChange}
            min="1"
            step="1"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Shelf Location
          </label>
          <input
            name="shelfLocation"
            value={formData.shelfLocation}
            onChange={handleChange}
            placeholder="e.g. A-101"
            className={inputClass}
          />
        </div>

      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Write book description..."
          rows={4}
          className={inputClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Book Cover Image URL
        </label>
        <input
          type="url"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/book-cover.jpg"
          className={inputClass}
        />
      </div>

      {formData.coverImage && (
        <div>
          <p className="mb-2 text-sm font-medium text-gray-700">
            Cover Preview
          </p>
          <Image
            src={formData.coverImage}
            alt="Book cover preview"
            width={144}
            height={192}
            unoptimized
            className="h-48 w-36 rounded-lg border object-contain"
          />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}