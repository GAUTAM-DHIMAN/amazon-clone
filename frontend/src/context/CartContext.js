"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_USER_ID } from "@/lib/constants";
import { deleteCartItem, getCart, postCartItem } from "@/lib/api";
import { useAuth } from "@/context/AuthContext"; // ✅ ADDED

const CartContext = createContext(null);

function syncMessage(err) {
  return err instanceof Error ? err.message : "Cart sync failed";
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const { user } = useAuth(); // ✅ ADDED

  const clearSyncError = useCallback(() => setSyncError(null), []);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      if (!user) {
        setCart({ id: 0, user_id: 0, items: [], subtotal: 0, total: 0 });
        return;
      }
      const data = await getCart(user.id);
      setCart(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load cart");
    } finally {
      setLoading(false);
    }
  }, [user]);

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
    async (productId, quantity, options) => {
      const merge = options?.merge !== false;
      setSyncError(null);
      setSyncing(true);
      try {
        await postCartItem({
          userId: user?.id ?? DEFAULT_USER_ID, // ✅ FIXED
          productId,
          quantity,
          merge,
        });
        await refresh();
      } catch (e) {
        setSyncError(syncMessage(e));
        throw e;
      } finally {
        setSyncing(false);
      }
    },
    [refresh, user], // ✅ added
  );

  const setQuantity = useCallback(
    async (productId, quantity) => {
      setSyncError(null);
      setSyncing(true);
      try {
        if (quantity < 1) {
          const line = cart?.items.find((i) => i.productId === productId);
          if (line) {
            await deleteCartItem(
              line.cartId,
              user?.id ?? DEFAULT_USER_ID, // ✅ FIXED
            );
            await refresh();
          }
          return;
        }
        await postCartItem({
          userId: user?.id ?? DEFAULT_USER_ID, // ✅ FIXED
          productId,
          quantity,
          merge: false,
        });
        await refresh();
      } catch (e) {
        setSyncError(syncMessage(e));
        throw e;
      } finally {
        setSyncing(false);
      }
    },
    [cart, refresh, user], // ✅ added
  );

  const removeLine = useCallback(
    async (cartId) => {
      setSyncError(null);
      setSyncing(true);
      try {
        await deleteCartItem(
          cartId,
          user?.id ?? DEFAULT_USER_ID, // ✅ FIXED
        );
        await refresh();
      } catch (e) {
        setSyncError(syncMessage(e));
        throw e;
      } finally {
        setSyncing(false);
      }
    },
    [refresh, user], // ✅ added
  );

  const itemCount = useMemo(
    () => cart?.items.reduce((n, i) => n + i.quantity, 0) ?? 0,
    [cart],
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
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
