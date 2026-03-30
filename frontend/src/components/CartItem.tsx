"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartLine } from "@/lib/api";
import { formatCurrency } from "@/lib/formatCurrency";

export type CartItemProps = {
  line: CartLine;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (cartId: number) => void;
};

export function CartItem({
  line,
  onQuantityChange,
  onRemove,
}: CartItemProps) {
  const max = line.stock;

  return (
    <li className="flex flex-col gap-3 border-b border-[#e7e7e7] bg-white py-5 last:border-b-0 sm:flex-row sm:items-start sm:gap-6 sm:py-6">
      <Link
        href={`/products/${line.productId}`}
        className="relative mx-auto h-32 w-32 shrink-0 sm:mx-0 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-lg overflow-hidden bg-[#f7f7f7]"
      >
        <Image
          src={line.imageUrl}
          alt={line.name}
          fill
          className="object-contain p-2"
          sizes="(max-width: 640px) 128px, 160px"
        />
      </Link>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <Link
          href={`/products/${line.productId}`}
          className="text-sm font-medium leading-snug text-[#0f1111] hover:text-[#c7511f] hover:underline sm:text-base md:text-lg"
        >
          {line.name}
        </Link>

        <p className="mt-1 text-xs text-[#007600] font-medium">In Stock</p>

        {/* Prime badge */}
        <div className="mt-1 flex items-center justify-center sm:justify-start gap-1">
          <span className="inline-block bg-[#232f3e] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">
            prime
          </span>
          <span className="text-[11px] text-[#007185]">FREE Delivery</span>
        </div>

        {/* Actions */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start">
          {/* Qty +/- */}
          <div className="qty-selector">
            <button
              type="button"
              onClick={() => onQuantityChange(line.productId, Math.max(1, line.quantity - 1))}
              disabled={line.quantity <= 1}
              className="disabled:opacity-40"
            >
              −
            </button>
            <span>{line.quantity}</span>
            <button
              type="button"
              onClick={() => onQuantityChange(line.productId, Math.min(max, line.quantity + 1))}
              disabled={line.quantity >= max}
              className="disabled:opacity-40"
            >
              +
            </button>
          </div>

          <span className="hidden h-4 w-px bg-[#d5d9d9] sm:inline" aria-hidden />

          <button
            type="button"
            onClick={() => onRemove(line.cartId)}
            className="text-sm text-[#007185] touch-manipulation hover:text-[#c7511f] hover:underline"
          >
            Delete
          </button>

          <span className="hidden h-4 w-px bg-[#d5d9d9] sm:inline" aria-hidden />

          <button
            type="button"
            className="text-sm text-[#007185] touch-manipulation hover:text-[#c7511f] hover:underline"
            onClick={() => alert("Save for later — coming soon!")}
          >
            Save for later
          </button>
        </div>
      </div>

      {/* Line Total */}
      <div className="flex items-center justify-between border-t border-[#e7e7e7] pt-3 sm:ml-auto sm:block sm:border-0 sm:pt-0 sm:text-right">
        <span className="text-sm font-medium text-[#565959] sm:hidden">
          Subtotal
        </span>
        <p className="text-lg font-bold text-[#0f1111] sm:text-xl">
          {formatCurrency(line.lineTotal)}
        </p>
        <p className="text-xs text-[#565959] mt-0.5 hidden sm:block">
          {formatCurrency(Number(line.price))} each
        </p>
      </div>
    </li>
  );
}
