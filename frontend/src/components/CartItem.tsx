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
  const qtyOptions = Array.from({ length: line.stock }, (_, i) => i + 1);

  return (
    <li className="flex flex-col gap-3 border-b border-[#e7e7e7] bg-white py-4 last:border-b-0 sm:flex-row sm:items-start sm:gap-6 sm:py-5">
      <Link
        href={`/products/${line.productId}`}
        className="relative mx-auto h-32 w-32 shrink-0 sm:mx-0 sm:h-28 sm:w-28 md:h-36 md:w-36"
      >
        <Image
          src={line.imageUrl}
          alt={line.name}
          fill
          className="object-contain"
          sizes="(max-width: 640px) 128px, 144px"
        />
      </Link>

      <div className="min-w-0 flex-1 text-center sm:text-left">
        <Link
          href={`/products/${line.productId}`}
          className="text-sm font-medium leading-snug text-[#007185] hover:text-[#c7511f] hover:underline sm:text-base md:text-lg"
        >
          {line.name}
        </Link>
        <p className="mt-1 text-xs text-[#565959] sm:text-sm">
          {formatCurrency(Number(line.price))} each
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#0f1111]">Qty:</span>
            <select
              value={line.quantity}
              onChange={(e) =>
                onQuantityChange(line.productId, Number(e.target.value))
              }
              className="min-h-[44px] rounded-md border border-[#d5d9d9] bg-[#f0f2f2] px-3 py-2 text-base shadow-sm focus:border-[#007185] focus:outline-none focus:ring-1 focus:ring-[#007185] sm:min-h-0 sm:px-2 sm:py-1.5 sm:text-sm"
              aria-label={`Quantity for ${line.name}`}
            >
              {qtyOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <span
            className="hidden h-4 w-px bg-[#d5d9d9] sm:inline"
            aria-hidden
          />
          <button
            type="button"
            onClick={() => onRemove(line.cartId)}
            className="min-h-[44px] px-2 text-sm text-[#007185] touch-manipulation hover:text-[#c7511f] hover:underline sm:min-h-0"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#e7e7e7] pt-3 sm:ml-auto sm:block sm:border-0 sm:pt-0 sm:text-right">
        <span className="text-sm font-medium text-[#565959] sm:hidden">
          Subtotal
        </span>
        <p className="text-lg font-semibold text-[#0f1111] sm:text-lg md:text-xl">
          {formatCurrency(line.lineTotal)}
        </p>
      </div>
    </li>
  );
}
