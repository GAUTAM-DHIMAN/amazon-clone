"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_USER_ID } from "@/lib/constants";
import {
  type CartResponse,
  deleteCartItem,
  getCart,
  postCartItem,
} from "@/lib/api";

export type AddProductOptions = {
  /** true = add to existing qty (default). false = set line qty (e.g. Buy Now). */
  merge?: boolean;
};

type CartContextValue = {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  syncError: string | null;
  syncing: boolean;
  clearSyncError: () => void;
  refresh: () => Promise<void>;
  /** Replace quantity for a product, or pass 0 / negative to remove the line. */
  setQuantity: (productId: number, quantity: number) => Promise<void>;
  addProduct: (
    productId: number,
    quantity: number,
    options?: AddProductOptions
  ) => Promise<void>;
  removeLine: (cartId: number) => Promise<void>;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function syncMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Cart sync failed";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const clearSyncError = useCallback(() => setSyncError(null), []);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      const data = await getCart(DEFAULT_USER_ID);
      setCart(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  const addProduct = useCallback(
    async (
      productId: number,
      quantity: number,
      options?: AddProductOptions
    ) => {
      const merge = options?.merge !== false;
      setSyncError(null);
      setSyncing(true);
      try {
        await postCartItem({ productId, quantity, merge });
        await refresh();
      } catch (e) {
        setSyncError(syncMessage(e));
        throw e;
      } finally {
        setSyncing(false);
      }
    },
    [refresh]
  );

  const setQuantity = useCallback(
    async (productId: number, quantity: number) => {
      setSyncError(null);
      setSyncing(true);
      try {
        if (quantity < 1) {
          // Find the cart line in current cart and delete it
          const line = cart?.items.find((i) => i.productId === productId);
          if (line) {
            await deleteCartItem(line.cartId, DEFAULT_USER_ID);
            await refresh();
          }
          return;
        }
        await postCartItem({ productId, quantity, merge: false });
        await refresh();
      } catch (e) {
        setSyncError(syncMessage(e));
        throw e;
      } finally {
        setSyncing(false);
      }
    },
    [cart, refresh]
  );

  const removeLine = useCallback(
    async (cartId: number) => {
      setSyncError(null);
      setSyncing(true);
      try {
        await deleteCartItem(cartId);
        await refresh();
      } catch (e) {
        setSyncError(syncMessage(e));
        throw e;
      } finally {
        setSyncing(false);
      }
    },
    [refresh]
  );

  const itemCount = useMemo(
    () => cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0,
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      syncError,
      syncing,
      clearSyncError,
      refresh,
      setQuantity,
      addProduct,
      removeLine,
      itemCount,
    }),
    [
      cart,
      loading,
      error,
      syncError,
      syncing,
      clearSyncError,
      refresh,
      setQuantity,
      addProduct,
      removeLine,
      itemCount,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
