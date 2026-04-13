"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../lib/cartStore";

const ProductDetailComponent = ({ productData }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCart((state) => state.addItem);

  const images = productData?.images || [
    productData?.image,
    productData?.image,
  ];
  const sizes = productData?.sizes || ["S", "M", "L", "XL"];
  const colors = productData?.colors || ["#000000", "#808080"];
  const rating = productData?.rating || 4.9;
  const reviews = productData?.reviews || 0;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleQuantityChange = (value) => {
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    setIsAdding(true);
    const cartItem = {
      productId: productData?.id || productData?.productId,
      productName: productData?.name,
      price: productData?.price,
      imageUrl: productData?.imageUrl || productData?.image,
      quantity,
      selectedSize,
      selectedColor,
    };
    addItem(cartItem);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Link
            href="/products"
            className="hover:text-gray-900 dark:hover:text-white"
          >
            Home
          </Link>
          <span>›</span>
          <span>Products</span>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-semibold">
            {productData?.name || "Products"}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Section */}
          <div className="flex flex-col">
            {/* Main Image */}
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-4 h-[500px]">
              <img
                src={images[currentImageIndex] || productData?.imageUrl}
                alt={productData?.name || "Product"}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation Arrows */}
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                ‹
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
              >
                ›
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    currentImageIndex === index
                      ? "border-gray-900 dark:border-white"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <img
                    src={img || productData?.imageUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col">
            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {productData?.name || "Product Name"}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4 space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(rating)
                        ? "text-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-700 dark:text-gray-300 font-semibold">
                ({rating})
              </span>
              {reviews > 0 && (
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {reviews} reviews
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${productData?.price || "0"}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {productData?.description || "Product description not available"}
            </p>

            {/* Available Size */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Available Size
              </label>
              <div className="flex gap-2 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedSize === size
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Available Color */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Available Color
              </label>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor === color
                        ? "border-gray-400 scale-110"
                        : "border-transparent hover:border-gray-400"
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                {productData?.availability
                  ? "Last 1 left - make it yours!"
                  : "Out of Stock"}
              </p>
            </div>

            {/* Quantity Selector and Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 1)
                  }
                  className="w-12 h-full text-center font-semibold border-0 bg-transparent outline-none text-gray-900 dark:text-white"
                  min="1"
                />
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className={`flex-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 px-6 rounded-lg font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all ${
                  isAdding ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {isAdding ? "Added!" : "Add to cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailComponent;
