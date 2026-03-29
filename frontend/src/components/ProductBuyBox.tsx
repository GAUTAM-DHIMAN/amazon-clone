"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useCart } from "@/context/CartContext";
import { formatPriceParts } from "@/lib/formatCurrency";
import type { Product } from "@/lib/api";

type Props = {
  product: Product;
};

export function ProductBuyBox({ product }: Props) {
  const router = useRouter();
  const { addProduct } = useCart();
  const [qty, setQty] = useState(1);
  const [buyPending, setBuyPending] = useState(false);
  const max = product.stock;
  const disabled = max < 1;
  const { main, fraction } = formatPriceParts(product.price);

  const clampQty = (n: number) =>
    Math.max(1, Math.min(max || 1, Math.floor(n)));

  const buyNow = async () => {
    setBuyPending(true);
    try {
      await addProduct(product.id, qty, { merge: false });
      router.push("/checkout");
    } finally {
      setBuyPending(false);
    }
  };

  return (
    <div className="rounded-md border border-[#d5d9d9] bg-white p-3 shadow-[0_2px_5px_rgba(15,17,17,0.08)] sm:p-4 md:p-5">
      <div className="flex items-start text-[#0f1111]">
        <span className="text-3xl font-normal">{main}</span>
        <span className="pt-1 text-lg font-normal">.{fraction}</span>
      </div>

      <p className="mt-3 text-sm text-[#0f1111]">
        {disabled ? (
          <span className="font-medium text-[#cc0c39]">Out of stock</span>
        ) : (
          <>
            <span className="font-medium text-[#007600]">In Stock</span>
            <span className="text-[#565959]"> — {max} left in stock</span>
          </>
        )}
      </p>

      {!disabled && (
        <div className="mt-4">
          <label
            htmlFor="pdp-qty"
            className="text-sm font-medium text-[#0f1111]"
          >
            Quantity:
          </label>
          <select
            id="pdp-qty"
            value={qty}
            onChange={(e) => setQty(clampQty(Number(e.target.value)))}
            className="ml-2 min-h-[44px] rounded-md border border-[#d5d9d9] bg-[#f0f2f2] px-3 py-2 text-base text-[#0f1111] shadow-inner focus:border-[#007185] focus:outline-none focus:ring-1 focus:ring-[#007185] sm:min-h-0 sm:py-1.5 sm:text-sm"
          >
            {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2.5">
        <AddToCartButton
          productId={product.id}
          quantity={qty}
          disabled={disabled}
          className="amz-btn-add py-2.5"
        >
          Add to Cart
        </AddToCartButton>
        <button
          type="button"
          onClick={buyNow}
          disabled={disabled || buyPending}
          className="amz-btn-buy py-2.5"
        >
          {buyPending ? "Please wait…" : "Buy Now"}
        </button>
      </div>

      <div className="mt-4 border-t border-[#e7e7e7] pt-4 text-xs text-[#565959]">
        <p className="leading-relaxed">Ships from Amazon Clone</p>
        <p className="leading-relaxed">FREE delivery on eligible orders</p>
        <p className="leading-relaxed">30-day returns</p>
      </div>
    </div>
  );
}
