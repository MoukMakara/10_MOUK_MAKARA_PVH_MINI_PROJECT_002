"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import ShopCardComponent from "../../../components/shop/ShopCardComponent";
import FiltersComponent from "../../../components/shop/FiltersComponent";
import { getAllProductService } from "../../../service/auth/product.service";

const transformAPIProduct = (apiProduct) => {
  return {
    productId: apiProduct.productId,
    productName: apiProduct.name,
    price: apiProduct.price,
    imageUrl:
      apiProduct.imageUrl && apiProduct.imageUrl !== "string"
        ? apiProduct.imageUrl
        : null,
    categoryId: apiProduct.categoryId,
    description: apiProduct.description,
  };
};

export default function Page() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ priceRange: 300, categoryId: null });

  useEffect(() => {
    // Don't fetch until session loading is complete
    if (status === "loading") {
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = session?.accessToken;
        const apiData = await getAllProductService(token);
        const transformedProducts = apiData.map(transformAPIProduct);
        setProducts(transformedProducts);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [session?.accessToken, status]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice = product.price <= filters.priceRange;
      const matchesCategory =
        !filters.categoryId || product.categoryId === filters.categoryId;

      return matchesSearch && matchesPrice && matchesCategory;
    });
  }, [searchTerm, filters, products]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="border-b border-gray-200 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Luxury beauty products
            </h1>
            <p className="mt-2 text-gray-600">
              Use the filters to narrow by price and brand.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md ml-auto">
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-500 transition focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-full max-w-xs shrink-0">
              <FiltersComponent onFilterChange={setFilters} />
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {!session && (
                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
                  Please log in to view products.
                </div>
              )}

              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
                  <div className="text-center">
                    <div className="mb-4 inline-block">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900"></div>
                    </div>
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <p className="text-sm text-gray-600">
                      Showing{" "}
                      <span className="font-semibold">
                        {filteredProducts.length}
                      </span>{" "}
                      products
                    </p>
                  </div>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredProducts.map((product) => (
                        <ShopCardComponent
                          key={product.productId}
                          product={product}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
                      <p className="text-gray-600">
                        No products found matching your criteria.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
