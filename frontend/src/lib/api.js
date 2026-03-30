import { DEFAULT_USER_ID } from "./constants";

// ✅ FINAL FIX: strict + safe base URL
const baseUrl = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "https://amazon-clone-backend-5i8v.onrender.com";

// ================= TYPES =================

// ================= HELPER =================

async function handleJson(res) {
  let data = null;

  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return null;
  }

  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`,
    );
  }

  return data;
}

// ================= PRODUCTS =================

export async function getProducts(filters) {
  const sp = new URLSearchParams();

  if (filters?.q?.trim()) sp.set("q", filters.q.trim());
  if (filters?.category?.trim()) sp.set("category", filters.category.trim());

  const res = await fetch(
    `${baseUrl}/products${sp.toString() ? `?${sp}` : ""}`,
    { cache: "no-store" },
  );

  return handleJson(res);
}

export async function getProductCategories() {
  const res = await fetch(`${baseUrl}/products/categories`, {
    cache: "no-store",
  });

  const data = await handleJson(res);
  return data.categories;
}

export async function getProduct(id) {
  const res = await fetch(`${baseUrl}/products/${id}`, {
    cache: "no-store",
  });

  return handleJson(res);
}

// ================= CART =================

export async function getCart(userId = DEFAULT_USER_ID) {
  if (!userId || userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(
    `${baseUrl}/cart?userId=${encodeURIComponent(String(userId))}`,
  );

  return handleJson(res);
}

export async function postCartItem(input) {
  if (!input.userId || input.userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${baseUrl}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return handleJson(res);
}

export async function deleteCartItem(cartId, userId = DEFAULT_USER_ID) {
  if (!userId || userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${baseUrl}/cart/${cartId}?userId=${userId}`, {
    method: "DELETE",
  });

  if (res.status === 204) return;

  return handleJson(res);
}

// ================= ORDERS =================

export async function postOrder(input) {
  if (!input.userId || input.userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return handleJson(res);
}

// ================= AUTH (🔥 FIXED) =================

export async function login(input) {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ IMPORTANT FIX
    body: JSON.stringify(input),
  });

  return handleJson(res);
}

export async function signup(input) {
  const res = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ IMPORTANT FIX
    body: JSON.stringify(input),
  });

  return handleJson(res);
}

// ================= WISHLIST =================

export async function getWishlist(userId) {
  const res = await fetch(`${baseUrl}/wishlist/${userId}`);
  return handleJson(res);
}

export async function addWishlist(userId, productId) {
  const res = await fetch(`${baseUrl}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productId }),
  });

  return handleJson(res);
}

export async function removeWishlist(userId, productId) {
  const res = await fetch(`${baseUrl}/wishlist`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productId }),
  });

  return handleJson(res);
}

// ================= EXTRA =================

export async function getSimilarProducts(category) {
  const res = await fetch(
    `${baseUrl}/products?category=${encodeURIComponent(category)}`,
  );
  return handleJson(res);
}
