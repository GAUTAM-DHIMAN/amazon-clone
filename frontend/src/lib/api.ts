import { DEFAULT_USER_ID } from "./constants";

// ✅ FINAL FIX: strict + safe base URL
const baseUrl = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "https://amazon-clone-backend-5i8v.onrender.com";

// ================= TYPES =================

export type Product = {
  id: number;
  name: string;
  description: string;
  category?: string;
  price: string | number;
  imageUrl: string;
  stock: number;
  createdAt?: string;
};

export type ProductCategorySummary = {
  slug: string;
  label: string;
  count: number;
};

export type CartLine = {
  cartId: number;
  productId: number;
  name: string;
  price: string | number;
  imageUrl: string;
  stock: number;
  quantity: number;
  lineTotal: number;
};

export type CartResponse = {
  userId: number;
  items: CartLine[];
  subtotal: number;
};

export type AuthResponse = {
  status: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

// ================= HELPER =================

async function handleJson<T>(res: Response): Promise<T> {
  let data: any = null;

  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch {
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return null as T;
  }

  if (!res.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed (${res.status})`
    );
  }

  return data as T;
}

// ================= PRODUCTS =================

export async function getProducts(filters?: {
  q?: string | null;
  category?: string | null;
}): Promise<Product[]> {
  const sp = new URLSearchParams();

  if (filters?.q?.trim()) sp.set("q", filters.q.trim());
  if (filters?.category?.trim()) sp.set("category", filters.category.trim());

  const res = await fetch(
    `${baseUrl}/products${sp.toString() ? `?${sp}` : ""}`,
    { cache: "no-store" }
  );

  return handleJson<Product[]>(res);
}

export async function getProductCategories(): Promise<ProductCategorySummary[]> {
  const res = await fetch(`${baseUrl}/products/categories`, {
    cache: "no-store",
  });

  const data = await handleJson<{ categories: ProductCategorySummary[] }>(res);
  return data.categories;
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${baseUrl}/products/${id}`, {
    cache: "no-store",
  });

  return handleJson<Product>(res);
}

// ================= CART =================

export async function getCart(userId = DEFAULT_USER_ID): Promise<CartResponse> {
  if (!userId || userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(
    `${baseUrl}/cart?userId=${encodeURIComponent(String(userId))}`
  );

  return handleJson<CartResponse>(res);
}

export async function postCartItem(input: {
  userId?: number;
  productId: number;
  quantity: number;
  merge?: boolean;
}) {
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

export async function deleteCartItem(
  cartId: number,
  userId = DEFAULT_USER_ID
) {
  if (!userId || userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(
    `${baseUrl}/cart/${cartId}?userId=${userId}`,
    { method: "DELETE" }
  );

  if (res.status === 204) return;

  return handleJson(res);
}

// ================= ORDERS =================

export type ShippingPayload = {
  fullName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export async function postOrder(input: {
  userId?: number;
  shipping: ShippingPayload;
}): Promise<{ orderId: number; total: number; createdAt: string }> {
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

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ IMPORTANT FIX
    body: JSON.stringify(input),
  });

  return handleJson<AuthResponse>(res);
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${baseUrl}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // ✅ IMPORTANT FIX
    body: JSON.stringify(input),
  });

  return handleJson<AuthResponse>(res);
}

// ================= WISHLIST =================

export async function getWishlist(userId: number) {
  const res = await fetch(`${baseUrl}/wishlist/${userId}`);
  return handleJson(res);
}

export async function addWishlist(userId: number, productId: number) {
  const res = await fetch(`${baseUrl}/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, productId }),
  });

  return handleJson(res);
}

export async function removeWishlist(userId: number, productId: number) {
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

export async function getSimilarProducts(category: string) {
  const res = await fetch(
    `${baseUrl}/products?category=${encodeURIComponent(category)}`
  );
  return handleJson(res);
}