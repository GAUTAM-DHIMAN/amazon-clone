"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import type { Product } from "@/lib/api";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPriceParts } from "@/lib/formatCurrency";
import { WishlistButton } from "@/components/WishlistButton";

type Props = {
  product: Product;
};

function getDiscount() {
  // Generate a realistic-looking discount percentage
  const discounts = [10, 15, 20, 25, 30, 35, 40];
  return discounts[Math.floor(Math.random() * discounts.length)];
}

function StarRating({ rating = 4.2, count = 124 }: { rating?: number; count?: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="star-rating text-sm">
        {"★".repeat(full)}
        {half && "★"}
        {"☆".repeat(empty)}
      </div>
      <span className="text-xs text-[#007185] hover:text-[#c7511f] cursor-pointer">
        ({count.toLocaleString()})
      </span>
    </div>
  );
}

const ProductCard = memo(function ProductCard({ product }: Props) {
  const { main, fraction } = formatPriceParts(product.price);
  const inStock = product.stock > 0;
  const discount = getDiscount();
  const originalPrice = Math.round(Number(product.price) / (1 - discount / 100));

  const imageSrc =
    product.imageUrl && product.imageUrl.trim() !== ""
      ? product.imageUrl
      : "/placeholder.png";

  return (
    <article className="group relative flex flex-col h-full w-full bg-white p-3 sm:p-4 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 border border-[#e7e7e7]">

      {/* Discount Badge */}
      {inStock && (
        <span className="discount-badge">
          -{discount}%
        </span>
      )}

      {/* Wishlist */}
      <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <WishlistButton productId={product.id} />
      </div>

      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative mb-3 block w-full h-[160px] sm:h-[200px] overflow-hidden bg-white flex items-center justify-center"
      >
        <Image
          src={imageSrc}
          alt={product.name || "Product"}
          fill
          sizes="(max-width: 400px) 42vw, (max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
          className="object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Category */}
      {product.category ? (
        <p className="mb-0.5 text-[11px] capitalize text-[#565959]">
          {product.category.replace(/-/g, " ")}
        </p>
      ) : null}

      {/* Title */}
      <Link
        href={`/products/${product.id}`}
        className="line-clamp-2 min-h-[36px] text-sm font-normal leading-snug text-[#0f1111] hover:text-[#c7511f] sm:text-[14px]"
      >
        {product.name}
      </Link>

      {/* Rating */}
      <div className="mt-1">
        <StarRating />
      </div>

      {/* Price */}
      <div className="mt-2">
        <div className="flex items-baseline gap-2">
          <div className="flex items-start text-[#0f1111]">
            <span className="text-xs mt-0.5">₹</span>
            <span className="text-xl font-medium sm:text-2xl">{main}</span>
            <span className="text-xs mt-0.5">.{fraction}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-[#565959]">M.R.P.:</span>
          <span className="text-xs text-[#565959] line-through">
            ₹{originalPrice.toLocaleString()}
          </span>
          <span className="text-xs text-[#cc0c39] font-medium">
            ({discount}% off)
          </span>
        </div>
      </div>

      {/* Prime & Delivery */}
      <div className="mt-1.5 flex items-center gap-1">
        <span className="inline-block bg-[#232f3e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide">
          prime
        </span>
        <span className="text-[11px] text-[#007185]">FREE Delivery</span>
      </div>

      {/* Add to Cart */}
      <div className="mt-auto pt-3">
        {!inStock ? (
          <span className="amz-btn-secondary cursor-not-allowed py-2 text-[#565959] text-xs">
            Currently unavailable
          </span>
        ) : (
          <AddToCartButton
            productId={product.id}
            className="amz-btn-add py-2 text-xs flex items-center justify-center gap-1"
          >
            <CartMiniIcon /> Add to Cart
          </AddToCartButton>
        )}
      </div>
    </article>
  );
});

function CartMiniIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

export { ProductCard };