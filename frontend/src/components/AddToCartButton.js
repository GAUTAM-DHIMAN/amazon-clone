"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled,
  className,
  children,
}) {
  const router = useRouter();
  const { user } = useAuth();
  const { addProduct } = useCart();
  const [pending, setPending] = useState(false);

  const onClick = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setPending(true);
    try {
      await addProduct(productId, quantity, { merge: true });
    } catch {
      /* syncError banner in CartProvider */
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || pending}
      className={className ?? "amz-btn-add py-2"}
    >
      {pending ? "Adding…" : (children ?? "Add to Cart")}
    </button>
  );
}
