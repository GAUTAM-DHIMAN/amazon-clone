"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const baseUrl =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
    : "https://amazon-clone-k9mj.onrender.com";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    fetch(`${baseUrl}/orders/user/${user.id}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="p-6 bg-[#f3f3f3] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>

      {!user ? (
        <p>Please login to see your orders</p>
      ) : orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-4 mb-4 border rounded shadow-sm"
          >
            <p><strong>Order ID:</strong> {order.id}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}