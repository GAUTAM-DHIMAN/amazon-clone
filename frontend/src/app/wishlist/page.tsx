"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWishlist } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    getWishlist(user.id)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="amz-container py-6">
      <h1 className="text-2xl font-bold text-[#0f1111] border-b border-[#e7e7e7] pb-3 mb-6">
        Your Wishlist
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-[#febd69] border-t-transparent rounded-full animate-spin" />
          <p className="mt-3 text-[#565959]">Loading wishlist…</p>
        </div>
      ) : !user ? (
        <div className="bg-white border border-[#d5d9d9] rounded-lg p-8 text-center shadow-sm">
          <svg className="w-16 h-16 mx-auto text-[#cc0c39] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-lg text-[#0f1111] font-medium">Please sign in to view your wishlist</p>
          <a href="/login" className="amz-btn-add mt-4 inline-block px-8 py-2 no-underline">
            Sign In
          </a>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-[#d5d9d9] rounded-lg p-8 text-center shadow-sm">
          <svg className="w-16 h-16 mx-auto text-[#565959] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-lg text-[#0f1111] font-medium">Your wishlist is empty</p>
          <p className="text-sm text-[#565959] mt-1">Save items you love to your wishlist</p>
          <a href="/" className="amz-btn-add mt-4 inline-block px-8 py-2 no-underline">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}