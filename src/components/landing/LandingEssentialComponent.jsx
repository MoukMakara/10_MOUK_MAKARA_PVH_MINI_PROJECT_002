"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import ProductCardComponent from "../ProductCardComponent";
import { filterProductsByCategory } from "../../data/mockData";
import { getCategoriesAction } from "../../app/actions/product.action";

const PAGE_SIZE = 8;

export default function LandingEssentialsGrid({ products = [] }) {
  const [categories, setCategories] = useState([]);
  const [selectedTab, setSelectedTab] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getCategoriesAction();
        if (result.success && result.data.length > 0) {
          setCategories([{ categoryId: "All", name: "All" }, ...result.data]);
        } else {
          setCategories([
            { categoryId: "All", name: "All" },
            {
              categoryId: "774afb41-ca95-4991-9bba-4e0dee76f590",
              name: "Skincare",
            },
            {
              categoryId: "80bcb82e-f017-4ce0-8bd7-e715a64f86cb",
              name: "Makeup",
            },
            {
              categoryId: "70d1eea3-a7bf-454a-805f-c8debb04d320",
              name: "Fragrance",
            },
            {
              categoryId: "b0767100-5f4f-4714-a616-b0993ec08b30",
              name: "Haircare",
            },
          ]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        // Fallback to mock data
        setCategories([
          { categoryId: "All", name: "All" },
          {
            categoryId: "774afb41-ca95-4991-9bba-4e0dee76f590",
            name: "Skincare",
          },
          {
            categoryId: "80bcb82e-f017-4ce0-8bd7-e715a64f86cb",
            name: "Makeup",
          },
          {
            categoryId: "70d1eea3-a7bf-454a-805f-c8debb04d320",
            name: "Fragrance",
          },
          {
            categoryId: "b0767100-5f4f-4714-a616-b0993ec08b30",
            name: "Haircare",
          },
        ]);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filtered = filterProductsByCategory(products, selectedTab);
  const visible = showAll ? filtered : filtered.slice(0, PAGE_SIZE);
  const canLoadMore = !showAll && filtered.length > PAGE_SIZE;

  if (loading) {
    return (
      <section id="shop" className="mx-auto w-full max-w-7xl py-16 lg:py-20">
        <div className="flex justify-center">
          <p className="text-gray-500">Loading categories...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="mx-auto w-full max-w-7xl py-16 lg:py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          Our skincare essentials
        </h2>
        <p className="mt-2 max-w-lg text-gray-500">
          Filter by category — explore our curated collection by type.
        </p>
      </div>

      <div
        className="mt-10 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Product categories"
      >
        {categories.map((category) => {
          const on = selectedTab === category.categoryId;
          return (
            <Button
              key={category.categoryId}
              role="tab"
              aria-selected={on}
              onPress={() => {
                setSelectedTab(category.categoryId);
                setShowAll(false);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                on
                  ? "bg-lime-400 text-gray-900 shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {category.name}
            </Button>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {visible.map((product, index) => (
          <ProductCardComponent product={product} key={index} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-gray-500">
          No products in this category — try "All".
        </p>
      )}

      {canLoadMore && (
        <div className="mt-12 flex justify-center">
          <Button
            variant="secondary"
            onPress={() => setShowAll(true)}
            className="rounded-full border border-gray-200 bg-white px-10 py-3 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50"
          >
            Load more
          </Button>
        </div>
      )}
    </section>
  );
}
