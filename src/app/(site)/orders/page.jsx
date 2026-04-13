"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getOrdersService } from "../../../service/auth/order.service";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getOrdersService(session.accessToken);

        if (response.status === 200 && response.data?.payload) {
          setOrders(response.data.payload);
        } else {
          setError("Failed to load orders");
        }
      } catch (err) {
        setError("Error loading orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session?.accessToken]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="flex items-center justify-center py-16">
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <h1 className="text-3xl font-semibold text-gray-900">Error</h1>
          <p className="text-gray-600">{error}</p>
          <Link
            href="/products"
            className="rounded-full bg-lime-400 px-6 py-2 font-semibold text-gray-900 transition hover:bg-lime-300"
          >
            Back to Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 lg:py-20">
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <h1 className="text-3xl font-semibold text-gray-900">
            No orders yet
          </h1>
          <p className="text-gray-600">
            Start shopping to create your first order!
          </p>
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
          <h1 className="text-4xl font-semibold text-gray-900">
            Ordered products
          </h1>
          <p className="mt-2 text-gray-600">
            {orders.length} {orders.length === 1 ? "order" : "orders"} from your
            account.
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="rounded-2xl border border-gray-200 bg-white p-6"
            >
              {/* Order Header */}
              <div className="flex items-start justify-between border-b border-gray-100 pb-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order
                  </p>
                  <p className="font-semibold text-gray-900">
                    #{order.orderId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Total
                  </p>
                  <p className="text-xl font-semibold text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 py-4 md:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    User ID
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {order.appUserId}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order date
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Line items
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {order.orderDetailsResponse.length}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="border-t border-gray-100 pt-4">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Order details
                </p>
                <div className="space-y-3">
                  {order.orderDetailsResponse.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Product {item.productName}
                        </p>
                      </div>
                      <div className="flex items-center gap-8">
                        <p className="text-gray-600">Qty {item.orderQty}</p>
                        <p className="font-semibold text-gray-900">
                          ${item.orderTotal.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Shopping */}
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
