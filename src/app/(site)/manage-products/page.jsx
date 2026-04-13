"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ManageProductCard from "../../../components/ManageProductCard";
import ProductFormModal from "../../../components/ProductFormModal";
import { getAllProductService } from "../../../service/auth/product.service";

export default function ManageProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name-asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }

    if (session?.accessToken) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [status, session?.accessToken]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProductService(session.accessToken);
      setProducts(Array.isArray(data) ? data : []);
      if (data.length > 0) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories", {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.payload || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const sortedProducts = () => {
    const copy = [...products];

    switch (sortBy) {
      case "name-asc":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      case "price-low":
        return copy.sort((a, b) => a.price - b.price);
      case "price-high":
        return copy.sort((a, b) => b.price - a.price);
      default:
        return copy;
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((p) => p.productId !== productId));
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSuccess = () => {
    fetchProducts();
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-lime-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-lime-500"></div>
          <p className="mt-4 text-gray-600">Fetching products...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="mt-2 text-gray-600">
            Create, update, and delete products in this demo (local state only).
          </p>
        </div>

        {/* Top Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Sort</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-low">Price (Low to High)</option>
              <option value="price-high">Price (High to Low)</option>
            </select>
          </div>

          <button
            onClick={handleCreateProduct}
            className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-6 py-2 font-medium text-white hover:bg-lime-600 transition"
          >
            <span>+</span>
            Create product
          </button>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Products</h2>

          {products.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
              <p className="text-gray-600">
                No products yet. Create one to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedProducts().map((product) => (
                <ManageProductCard
                  key={product.productId}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  token={session.accessToken}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        product={editingProduct}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
        token={session?.accessToken}
        categories={categories}
      />
    </main>
  );
}
