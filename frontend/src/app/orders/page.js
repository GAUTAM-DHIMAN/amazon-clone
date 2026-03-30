"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const baseUrl =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "https://amazon-clone-backend-5i8v.onrender.com";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/orders/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="amz-container py-6">
      <h1 className="text-2xl font-bold text-[#0f1111] border-b border-[#e7e7e7] pb-3 mb-6">
        Your Orders
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[#febd69] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-[#565959]">Loading orders…</p>
        </div>
      ) : !user ? (
        <div className="bg-white border border-[#d5d9d9] rounded-lg p-8 text-center shadow-sm">
          <svg
            className="w-16 h-16 mx-auto text-[#565959] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-lg text-[#0f1111] font-medium">
            Please sign in to view your orders
          </p>
          <a
            href="/login"
            className="amz-btn-add mt-4 inline-block px-8 py-2 no-underline"
          >
            Sign In
          </a>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-[#d5d9d9] rounded-lg p-8 text-center shadow-sm">
          <svg
            className="w-16 h-16 mx-auto text-[#565959] mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <p className="text-lg text-[#0f1111] font-medium">No orders yet</p>
          <p className="text-sm text-[#565959] mt-1">
            Looks like you haven&apos;t placed any orders
          </p>
          <a
            href="/"
            className="amz-btn-add mt-4 inline-block px-8 py-2 no-underline"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-[#d5d9d9] rounded-lg overflow-hidden shadow-sm"
            >
              {/* Order header */}
              <div className="bg-[#f0f2f2] px-4 py-3 flex flex-wrap gap-4 text-sm border-b border-[#d5d9d9]">
                <div>
                  <p className="text-xs text-[#565959] uppercase tracking-wide">
                    Order placed
                  </p>
                  <p className="text-[#0f1111] font-medium">
                    {new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#565959] uppercase tracking-wide">
                    Total
                  </p>
                  <p className="text-[#0f1111] font-bold">
                    ₹{Number(order.total).toLocaleString()}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-xs text-[#565959] uppercase tracking-wide">
                    Order #
                  </p>
                  <p className="text-[#007185] font-medium">{order.id}</p>
                </div>
              </div>

              {/* Order body */}
              <div className="px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#007600]" />
                  <span className="text-sm font-bold text-[#007600]">
                    Delivered
                  </span>
                </div>
                <p className="text-xs text-[#565959] mt-1">
                  Delivered on{" "}
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
