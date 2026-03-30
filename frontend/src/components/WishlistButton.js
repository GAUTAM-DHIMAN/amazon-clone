"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { addWishlist, removeWishlist } from "@/lib/api";

export function WishlistButton({ productId }) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);

  const toggle = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    if (liked) {
      await removeWishlist(user.id, productId);
      setLiked(false);
    } else {
      await addWishlist(user.id, productId);
      setLiked(true);
    }
  };

  return (
    <button onClick={toggle} className="text-xl hover:scale-110 transition">
      {liked ? "❤️" : "🤍"}
    </button>
  );
}
