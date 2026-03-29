"use client";

import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import type { Product } from "@/lib/api";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPriceParts } from "@/lib/formatCurrency";

type Props = {
  product: Product;
};

const ProductCard = memo(function ProductCard({ product }: Props) {
  const { main, fraction } = formatPriceParts(product.price);
  const inStock = product.stock > 0;

  return (
    <article className="flex flex-col h-full w-full bg-white p-3 sm:p-4 md:p-5 border border-[#e7e7e7] rounded-md hover:shadow-md transition">

      {/* Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative mb-3 block w-full h-[180px] sm:h-[200px] overflow-hidden bg-white flex items-center justify-center sm:mb-4"
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 400px) 42vw, (max-width: 640px) 45vw, (max-width: 1024px) 28vw, 18vw"
          className="object-contain mix-blend-multiply hover:scale-105 transition"
        />
      </Link>

      {/* Category */}
      {product.category ? (
        <p className="mb-1 text-xs capitalize text-[#565959]">
          {product.category.replace(/-/g, " ")}
        </p>
      ) : null}

      {/* Title */}
      <Link
        href={`/products/${product.id}`}
        className="line-clamp-2 h-[40px] text-sm font-normal leading-snug text-[#0f1111] hover:text-[#c7511f] sm:text-[15px] md:text-base"
      >
        {product.name}
      </Link>

      {/* ⭐ Rating */}
      <div className="mt-1 flex items-center gap-1 text-xs">
        <span className="text-yellow-500">★★★★☆</span>
        <span className="text-[#565959]">(124)</span>
      </div>

      {/* Price */}
      <div className="mt-2 flex items-start text-[#0f1111]">
        <span className="mr-0.5 text-sm">₹</span>
        <span className="text-xl font-normal sm:text-2xl md:text-[28px] md:leading-none">
          {main}
        </span>
        <span className="pt-0.5 text-xs font-normal sm:pt-1 sm:text-sm md:text-base">
          .{fraction}
        </span>
      </div>

      {/* Stock */}
      <p className="mt-1.5 text-xs md:text-sm">
        {inStock ? (
          <span className="text-[#007600]">In Stock</span>
        ) : (
          <span className="text-[#cc0c39]">Out of Stock</span>
        )}
      </p>

      {/* Buttons */}
      <div className="mt-auto flex flex-col gap-2 pt-3">
        {!inStock ? (
          <span className="amz-btn-secondary cursor-not-allowed py-2.5 text-[#565959]">
            Currently unavailable
          </span>
        ) : (
          <>
            <AddToCartButton
              productId={product.id}
              className="amz-btn-add py-2.5"
            />

            <Link
              href={`/products/${product.id}`}
              className="amz-btn-secondary block py-2.5 text-center"
            >
              See details
            </Link>

            {/* Compare */}
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                alert("Compare feature coming soon");
              }}
            >
              Compare
            </button>
          </>
        )}
      </div>
    </article>
  );
});

export { ProductCard };