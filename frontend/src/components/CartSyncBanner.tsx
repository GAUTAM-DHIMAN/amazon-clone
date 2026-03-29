"use client";

import { useCart } from "@/context/CartContext";

export function CartSyncBanner() {
  const { syncError, clearSyncError } = useCart();

  if (!syncError) return null;

  return (
    <div
      className="border-b border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950 shadow-sm sm:py-2"
      role="alert"
    >
      <div className="amz-container flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-center sm:text-center">
        <span className="min-w-0 flex-1 sm:flex-none">{syncError}</span>
        <button
          type="button"
          onClick={clearSyncError}
          className="shrink-0 touch-manipulation font-semibold text-amber-900 underline hover:no-underline sm:self-center sm:pl-2"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
