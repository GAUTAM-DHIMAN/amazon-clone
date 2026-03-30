"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPriceParts } from "@/lib/formatCurrency";

export function ProductBuyBox({ product }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addProduct } = useCart();
  const [qty, setQty] = useState(1);
  const [buyPending, setBuyPending] = useState(false);
  const max = product.stock;
  const disabled = max < 1;
  const { main, fraction } = formatPriceParts(product.price);
  const discount = 20;
  const originalPrice = Math.round(
    Number(product.price) / (1 - discount / 100),
  );

  const clampQty = (n) => Math.max(1, Math.min(max || 1, Math.floor(n)));

  const buyNow = async () => {
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          window.location.pathname + window.location.search
        )}`
      );
      return;
    }
    setBuyPending(true);
    try {
      await addProduct(product.id, qty, { merge: false });
      router.push("/checkout");
    } finally {
      setBuyPending(false);
    }
  };

  // Fake delivery date
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 1);
  const deliveryStr = deliveryDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="rounded-lg border border-[#d5d9d9] bg-white p-4 shadow-sm sm:p-5">
      {/* Price */}
      <div className="flex items-start text-[#cc0c39]">
        <span className="text-sm mt-1">₹</span>
        <span className="text-3xl font-medium">{main}</span>
        <span className="text-base mt-1">.{fraction}</span>
      </div>

      {/* MRP */}
      <div className="mt-1 flex items-center gap-2 text-sm">
        <span className="text-[#565959]">M.R.P.:</span>
        <span className="text-[#565959] line-through">
          ₹{originalPrice.toLocaleString()}
        </span>
        <span className="text-[#cc0c39] font-medium">({discount}% off)</span>
      </div>

      <p className="mt-0.5 text-xs text-[#565959]">Inclusive of all taxes</p>

      {/* Prime badge */}
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-block bg-[#232f3e] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm tracking-wide">
          prime
        </span>
        <span className="text-sm text-[#007185]">FREE Delivery</span>
      </div>

      {/* Delivery info */}
      <div className="mt-2 text-sm">
        <span className="text-[#007185]">FREE delivery </span>
        <span className="font-bold text-[#0f1111]">{deliveryStr}</span>
      </div>
      <p className="text-xs text-[#565959] mt-0.5">
        Order within{" "}
        <span className="font-bold text-[#007600]">12 hrs 30 mins</span>
      </p>

      {/* Delivery Features */}
      <div className="delivery-features mt-3">
        <div className="feature">
          <TruckIcon />
          <span>Free Delivery</span>
        </div>
        <div className="feature">
          <ReturnIcon />
          <span>10 Day Returns</span>
        </div>
        <div className="feature">
          <WarrantyIcon />
          <span>1 Year Warranty</span>
        </div>
      </div>

      {/* Stock status */}
      <p className="mt-3 text-sm">
        {disabled ? (
          <span className="font-medium text-[#cc0c39]">Out of stock</span>
        ) : (
          <span className="font-medium text-[#007600]">In Stock</span>
        )}
      </p>

      {/* Quantity selector */}
      {!disabled && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-sm text-[#0f1111]">Quantity:</span>
          <div className="qty-selector">
            <button
              type="button"
              onClick={() => setQty(clampQty(qty - 1))}
              disabled={qty <= 1}
              className="disabled:opacity-40"
            >
              −
            </button>
            <span>{qty}</span>
            <button
              type="button"
              onClick={() => setQty(clampQty(qty + 1))}
              disabled={qty >= max}
              className="disabled:opacity-40"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="mt-4 flex flex-col gap-2.5">
        <AddToCartButton
          productId={product.id}
          quantity={qty}
          disabled={disabled}
          className="amz-btn-add py-2.5 flex items-center justify-center gap-2"
        >
          <CartMiniIcon /> Add to Cart
        </AddToCartButton>
        <button
          type="button"
          onClick={buyNow}
          disabled={disabled || buyPending}
          className="amz-btn-buy py-2.5 flex items-center justify-center gap-2"
        >
          <BoltIcon /> {buyPending ? "Please wait…" : "Buy Now"}
        </button>
      </div>

      {/* Footer info */}
      <div className="mt-4 border-t border-[#e7e7e7] pt-4 text-xs text-[#565959] space-y-1">
        <p className="flex justify-between">
          <span>Ships from</span>
          <span className="text-[#0f1111]">Amazon Clone</span>
        </p>
        <p className="flex justify-between">
          <span>Sold by</span>
          <span className="text-[#007185]">Amazon Clone Store</span>
        </p>
      </div>
    </div>
  );
}

function CartMiniIcon() {
  return (
    <svg
      className="w-4 h-4"
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
  );
}

function BoltIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
      />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
      />
    </svg>
  );
}

function WarrantyIcon() {
  return (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}
