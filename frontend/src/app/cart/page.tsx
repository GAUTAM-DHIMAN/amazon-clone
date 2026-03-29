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
        Loading cart…
      </div>
    );
  }

  if (error) {
    return (
      <div className="amz-container py-12">
        <p className="rounded-md border border-[#cc0c39]/30 bg-[#fcf4f4] p-4 text-[#cc0c39]">
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
      <h1 className="border-b border-[#e7e7e7] pb-3 text-xl font-normal text-[#0f1111] sm:text-2xl md:text-[28px]">
        Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="mt-6 border border-[#d5d9d9] bg-white p-6 text-center shadow-[0_2px_5px_rgba(15,17,17,0.06)] sm:p-10">
          <p className="text-[#0f1111]">Your Amazon Clone Cart is empty.</p>
          <Link
            href="/"
            className="amz-btn-add mt-6 inline-block max-w-xs px-8 py-2.5 no-underline"
          >
            Shop today&apos;s deals
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_minmax(260px,320px)] md:items-start md:gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
          <div className="min-w-0 border border-[#d5d9d9] bg-white px-3 shadow-[0_2px_5px_rgba(15,17,17,0.06)] sm:px-4 md:px-5">
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
          </div>

          <aside className="h-fit border border-[#d5d9d9] bg-white p-4 shadow-[0_2px_5px_rgba(15,17,17,0.06)] md:sticky md:top-[104px] lg:top-[108px]">
            <p className="text-base text-[#0f1111]">
              Subtotal ({totalUnits} item{totalUnits === 1 ? "" : "s"}):
            </p>
            <p className="mt-1 text-2xl font-medium text-[#0f1111]">
              {formatCurrency(subtotal)}
            </p>
            <Link
              href="/checkout"
              className="amz-btn-add mt-4 block py-2.5 text-center no-underline"
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
