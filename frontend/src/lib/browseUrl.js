/** Build home listing URL with optional search + category (matches backend query params). */
export function buildListingUrl(params) {
  const sp = new URLSearchParams();
  const q = params.q?.trim();
  const category = params.category?.trim();
  if (q) sp.set("q", q);
  if (category) sp.set("category", category);
  const s = sp.toString();
  return s ? `/?${s}` : "/";
}
