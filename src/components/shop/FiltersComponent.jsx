"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getAllCategoriesService } from "../../service/auth/product.service";

export default function FiltersComponent({ onFilterChange }) {
  const { data: session } = useSession();
  const [priceRange, setPriceRange] = useState(300);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = session?.accessToken;
        const categoriesData = await getAllCategoriesService(token);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [session?.accessToken]);

  const handlePriceChange = (e) => {
    const newPrice = parseInt(e.target.value);
    setPriceRange(newPrice);
    onFilterChange({ priceRange: newPrice, categoryId: selectedCategoryId });
  };

  const handleQuickSelect = (maxPrice) => {
    setPriceRange(maxPrice);
    onFilterChange({ priceRange: maxPrice, categoryId: selectedCategoryId });
  };

  const handleResetFilters = () => {
    setPriceRange(300);
    setSelectedCategoryId(null);
    onFilterChange({ priceRange: 300, categoryId: null });
  };

  const handleCategoryChange = (categoryId) => {
    const newCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    setSelectedCategoryId(newCategoryId);
    onFilterChange({ priceRange, categoryId: newCategoryId });
  };

  return (
    <aside className="w-full max-w-xs rounded-2xl border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        <button
          onClick={handleResetFilters}
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          Reset filters
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
          Price Range
        </h3>
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max="300"
            value={priceRange}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-900"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>$0</span>
          <span>${priceRange} (no limit)</span>
        </div>
      </div>

      {/* Quick Select */}
      <div className="mb-8 border-b border-gray-200 pb-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
          Quick Select
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleQuickSelect(50)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
          >
            Under $50
          </button>
          <button
            onClick={() => handleQuickSelect(100)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
          >
            Under $100
          </button>
          <button
            onClick={() => handleQuickSelect(150)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
          >
            Under $150
          </button>
          <button
            onClick={() => handleQuickSelect(300)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
          >
            All prices
          </button>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-700">
          Categories
        </h3>
        {loadingCategories ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">No categories available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category.categoryId}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategoryId === category.categoryId}
                  onChange={() => handleCategoryChange(category.categoryId)}
                  className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-sm text-gray-700">{category.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
