/** Slugs stored in `products.category` and accepted by GET /products?category= */
export const PRODUCT_CATEGORY_SLUGS = [
  'electronics',
  'computers',
  'wearables',
  'storage',
  'furniture',
  'sports-outdoors',
  'home-kitchen',
];

export const PRODUCT_CATEGORY_LABELS = {
  electronics: 'Electronics',
  computers: 'Computers & Accessories',
  wearables: 'Wearable Technology',
  storage: 'Data Storage',
  furniture: 'Furniture',
  'sports-outdoors': 'Sports & Outdoors',
  'home-kitchen': 'Home & Kitchen',
};

export function normalizeCategorySlug(value) {
  if (value === undefined || value === null || String(value).trim() === '') {
    return null;
  }
  const s = String(value).trim().toLowerCase();
  return PRODUCT_CATEGORY_SLUGS.includes(s) ? s : null;
}
