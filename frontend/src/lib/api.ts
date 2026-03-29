import { DEFAULT_USER_ID } from "./constants";

// ✅ FIX: safer baseUrl (prevents SSR + fetch issues)
const baseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  (typeof window !== "undefined"
    ? "http://localhost:3001"
    : "http://127.0.0.1:3001"); // ✅ FIXED

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

async function handleJson<T>(res: Response): Promise<T> {
  let data: any = null;

  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  } catch (parseError) {
    if (!res.ok) {
      throw new Error(`Request failed (${res.status})`);
    }
    return null as T;
  }

  if (!res.ok) {
    const message =
      data && typeof data.message === "string"
        ? data.message
        : data && typeof data.error === "string"
        ? data.error
        : `Request failed (${res.status})`;

    throw new Error(message);
  }

  return data as T;
}

// ================= PRODUCTS =================

export async function getProducts(filters?: {
  q?: string | null;
  category?: string | null;
}): Promise<Product[]> {
  const sp = new URLSearchParams();
  const q = filters?.q?.trim();
  const category = filters?.category?.trim();

  if (q) sp.set("q", q);
  if (category) sp.set("category", category);

  const qs = sp.toString();

  const res = await fetch(
    `${baseUrl}/products${qs ? `?${qs}` : ""}`,
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
  // ✅ FIX: enforce real user
  if (!userId || userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(
    `${baseUrl}/cart?userId=${encodeURIComponent(String(userId))}`,
    { cache: "no-store" }
  );

  return handleJson<CartResponse>(res);
}

export type PostCartItemResult = {
  cartId: number;
  userId: number;
  productId: number;
  quantity: number;
};

export async function postCartItem(input: {
  userId?: number;
  productId: number;
  quantity: number;
  merge?: boolean;
}): Promise<PostCartItemResult> {

  // ✅ FIX
  if (!input.userId || input.userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const body: Record<string, unknown> = {
    userId: input.userId,
    productId: input.productId,
    quantity: input.quantity,
  };

  if (input.merge === true) {
    body.merge = true;
  }

  const res = await fetch(`${baseUrl}/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  return handleJson<PostCartItemResult>(res);
}

export async function deleteCartItem(
  cartId: number,
  userId = DEFAULT_USER_ID
): Promise<void> {

  // ✅ FIX
  if (!userId || userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(
    `${baseUrl}/cart/${cartId}?userId=${encodeURIComponent(String(userId))}`,
    { method: "DELETE" }
  );

  if (res.status === 204) return;

  await handleJson(res);
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

  // ✅ FIX
  if (!input.userId || input.userId === DEFAULT_USER_ID) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${baseUrl}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: input.userId, // ✅ FORCE REAL USER
      shipping: input.shipping,
    }),
  });

  return handleJson(res);
}

// ================= AUTH =================

export type AuthResponse = {
  status: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

export async function login(input: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return handleJson<AuthResponse>(res);
}

// ================= EXTRA =================

export async function getSimilarProducts(category: string): Promise<Product[]> {
  const res = await fetch(
    `${baseUrl}/products?category=${encodeURIComponent(category)}`,
    { cache: "no-store" }
  );
  return handleJson<Product[]>(res);
}

export async function getWishlist(userId: number) {
  const res = await fetch(`${baseUrl}/wishlist/${userId}`);
  return handleJson(res);
}

export async function addWishlist(userId: number, productId: number) {
  const res = await fetch(`${baseUrl}/wishlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId }),
  });
  return handleJson(res);
}

export async function removeWishlist(userId: number, productId: number) {
  const res = await fetch(`${baseUrl}/wishlist`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, productId }),
  });
  return handleJson(res);
}