"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getWishlist } from "@/lib/api";
import { ProductCard } from "@/components/ProductCard";

export default function WishlistPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    getWishlist(user.id).then(setItems);
  }, [user]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}