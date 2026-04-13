"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../../lib/cartStore";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { createOrderService } from "../../../service/auth/order.service";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } =
    useCart();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const subtotal = getTotalPrice();

  const handleCheckout = async () => {
    if (!session?.accessToken) {
      alert("Please log in first");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setIsLoading(true);
    try {
      const orderDetailRequests = items.map((item) => ({
        productId: item.productId,
        orderQty: item.quantity,
      }));

      const response = await createOrderService(
        orderDetailRequests,
        session.accessToken,
      );

      if (response.status === 201 && response.data?.payload?.orderId) {
        alert(
          `Order created successfully! Order ID: ${response.data.payload.orderId}`,
        );
        clearCart();
      } else {
        alert(`Error: ${response.data?.message || "Failed to create order"}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error creating order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <h1 className="text-3xl font-semibold text-gray-900">
            Your cart is empty
          </h1>
          <p className="text-gray-600">Add some products to get started!</p>
          <Link
            href="/products"
            className="rounded-full bg-lime-400 px-6 py-2 font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-semibold text-gray-900">Your cart</h1>
          <p className="mt-2 text-gray-600">
            Cart is stored in memory for this visit — refreshing the page clears
            it.
          </p>
          <p className="mt-4 text-sm font-medium text-gray-900">
            {items.length} {items.length === 1 ? "product" : "products"} in cart
          </p>
        </div>

        {/* Cart Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-6 rounded-2xl border border-gray-100 bg-white p-6"
            >
              {/* Product Image */}
              <div className="shrink-0">
                <div className="relative h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      ◇
                    </div>
                  )}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.productName}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Remove Link */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm font-medium text-red-600 transition hover:text-red-700"
                >
                  Remove
                </button>
              </div>

              {/* Quantity and Price */}
              <div className="flex flex-col items-end gap-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>

                {/* Total Price */}
                <p className="text-lg font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Section */}
        <div className="space-y-4 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          {/* Subtotal */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-gray-700">Subtotal</p>
              <p className="text-xs text-gray-600">
                Tax and shipping calculated at checkout (demo).
              </p>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              ${subtotal.toFixed(2)}
            </p>
          </div>

          {/* Checkout Button */}
          <Button
            fullWidth
            className="mt-6 h-12 rounded-full bg-gray-900 text-base font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
            onPress={handleCheckout}
            disabled={isLoading}
            isLoading={isLoading}
          >
            {isLoading ? "Creating Order..." : "Checkout"}
          </Button>

          {/* Clear Cart Button */}
          <Button
            fullWidth
            className="h-12 rounded-full border border-gray-300 bg-white text-base font-semibold text-gray-900 transition hover:bg-gray-100"
            onPress={clearCart}
          >
            Clear cart
          </Button>
        </div>

        {/* Continue Shopping Link */}
        <div className="text-center">
          <Link
            href="/products"
            className="text-sm font-medium text-lime-600 transition hover:text-lime-700"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    </main>
  );
}
