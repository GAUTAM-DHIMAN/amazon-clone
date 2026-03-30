"use client";

import Link from "next/link";
import { CartItem } from "@/components/CartItem";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/lib/formatCurrency";

export default function CartPage() {
  const { cart, loading, error, setQuantity, removeLine } = useCart();

  if (loading && !cart) {
    return (
      <div className="amz-container py-16 text-center text-[#565959]">
        <div className="inline-block w-8 h-8 border-4 border-[#febd69] border-t-transparent rounded-full animate-spin" />
        <p className="mt-3">Loading cart…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="amz-container py-12">
        <p className="rounded-lg border border-[#cc0c39]/30 bg-[#fcf4f4] p-4 text-[#cc0c39]">
          {error}
        </p>
      </div>
    );
  }

  const items = cart?.items ?? [];
  const subtotal = cart?.subtotal ?? 0;
  const totalUnits = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <div className="amz-container py-4 md:py-6">
      <h1 className="border-b border-[#e7e7e7] pb-3 text-2xl font-bold text-[#0f1111] sm:text-[28px]">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="mt-6 border border-[#d5d9d9] bg-white p-8 text-center shadow-sm rounded-lg sm:p-12">
          {/* Empty cart illustration */}
          <div className="mx-auto w-24 h-24 mb-4 rounded-full bg-[#f0f2f2] flex items-center justify-center">
            <svg
              className="w-12 h-12 text-[#565959]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#0f1111]">
            Your Amazon Clone Cart is empty
          </h2>
          <p className="mt-2 text-sm text-[#565959]">
            Your shopping cart lives to serve. Give it purpose — fill it with
            groceries, clothing, household supplies, electronics, and more.
          </p>
          <Link
            href="/"
            className="amz-btn-add mt-6 inline-block max-w-xs px-10 py-2.5 no-underline"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_minmax(260px,320px)] md:items-start md:gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="min-w-0 border border-[#d5d9d9] bg-white px-4 rounded-lg shadow-sm sm:px-5 md:px-6">
            <div className="flex justify-between items-center py-3 border-b border-[#e7e7e7]">
              <span className="text-sm text-[#565959]">Price</span>
            </div>
            <ul>
              {items.map((line) => (
                <CartItem
                  key={line.cartId}
                  line={line}
                  onQuantityChange={setQuantity}
                  onRemove={removeLine}
                />
              ))}
            </ul>
            <div className="py-4 text-right text-base text-[#0f1111]">
              Subtotal ({totalUnits} item{totalUnits === 1 ? "" : "s"}):{" "}
              <span className="font-bold text-lg">
                {formatCurrency(subtotal)}
              </span>
            </div>
          </div>

          <aside className="h-fit border border-[#d5d9d9] bg-white p-5 rounded-lg shadow-sm md:sticky md:top-[104px] lg:top-[108px]">
            {/* Free delivery callout */}
            <div className="flex items-center gap-2 text-sm text-[#007600] mb-3 pb-3 border-b border-[#e7e7e7]">
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Your order is eligible for FREE delivery</span>
            </div>

            <p className="text-base text-[#0f1111]">
              Subtotal ({totalUnits} item{totalUnits === 1 ? "" : "s"}):
            </p>
            <p className="mt-1 text-2xl font-bold text-[#0f1111]">
              {formatCurrency(subtotal)}
            </p>

            <Link
              href="/checkout"
              className="amz-btn-add mt-4 block py-3 text-center no-underline font-medium"
            >
              Proceed to checkout
            </Link>
            <Link
              href="/"
              className="mt-3 block text-center text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
