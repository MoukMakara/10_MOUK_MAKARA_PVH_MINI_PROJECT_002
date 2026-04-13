"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { deleteProductAction } from "../../../app/actions/product.action";

export default function ManageProductCard({
  product,
  onEdit,
  onDelete,
  token,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteProductAction(product.productId, token);
      if (result.success) {
        onDelete?.(product.productId);
      } else {
        alert(result.error || "Failed to delete product");
      }
    } catch (error) {
      alert("Error deleting product: " + error.message);
    } finally {
      setLoading(false);
      setMenuOpen(false);
    }
  };

  const handleEdit = () => {
    onEdit?.(product);
    setMenuOpen(false);
  };

  return (
    <article className="group relative rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      {/* Menu Button (Top Right) */}
      <div ref={menuRef} className="absolute right-4 top-4 z-20">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center justify-center rounded-full w-8 h-8 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          disabled={loading}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="12" cy="19" r="2" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-1 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
            <button
              onClick={handleEdit}
              disabled={loading}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 first:rounded-t-lg"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="block w-full border-t border-gray-200 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 last:rounded-b-lg"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-linear-to-br from-gray-100 to-lime-50/30 text-gray-400">
            ◇
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="relative mt-4">
        {/* Star Rating */}
        <p className="flex items-center gap-0.5 text-amber-400">
          <span className="text-sm">★★★★★</span>
          <span className="ml-1 text-xs tabular-nums text-gray-500">
            {product.star || "—"}
          </span>
        </p>

        {/* Product Name */}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-900">
          {product.name}
        </h3>

        {/* Price */}
        <p className="mt-2 text-base font-semibold tabular-nums text-gray-900">
          ${product.price}
        </p>
      </div>

      {/* Add Button (Bottom Right) - Placeholder */}
      <div className="absolute bottom-4 right-4">
        <button
          className="inline-flex items-center justify-center rounded-full bg-lime-500 w-10 h-10 text-white hover:bg-lime-600 transition disabled:opacity-50"
          disabled={loading}
          title="Product actions via menu"
        >
          <span className="text-lg">+</span>
        </button>
      </div>
    </article>
  );
}
