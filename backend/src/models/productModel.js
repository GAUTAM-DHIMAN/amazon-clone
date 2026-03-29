import { query } from '../config/database.js';
import { PRODUCT_CATEGORY_LABELS, PRODUCT_CATEGORY_SLUGS } from '../constants/productCategories.js';

const productSelect = `SELECT id,
            name,
            description,
            category,
            price,
            image AS "imageUrl",
            stock,
            created_at AS "createdAt"`;

/**
 * @param {{ search?: string | null; category?: string | null }} filters
 */
export async function findProducts(filters = {}) {
  const search =
    filters.search != null && String(filters.search).trim() !== ''
      ? String(filters.search).trim()
      : null;
  const category = filters.category ?? null;

  const parts = [];
  const params = [];
  let n = 1;

  if (search) {
    parts.push(
      `(name ILIKE '%' || $${n} || '%' OR description ILIKE '%' || $${n} || '%')`
    );
    params.push(search);
    n += 1;
  }

  if (category) {
    parts.push(`category = $${n}`);
    params.push(category);
    n += 1;
  }

  const where = parts.length ? `WHERE ${parts.join(' AND ')}` : '';
  const sql = `${productSelect}
     FROM products
     ${where}
     ORDER BY id ASC`;

  const { rows } = await query(sql, params);
  return rows;
}

export async function findProductById(id) {
  const { rows } = await query(
    `${productSelect}
     FROM products
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

/**
 * Distinct categories that exist in DB and are in the catalog allowlist, with counts.
 * @returns {Promise<{ slug: string, label: string, count: number }[]>}
 */
export async function findCategorySummaries() {
  const { rows } = await query(
    `SELECT category AS slug, COUNT(*)::int AS count
     FROM products
     WHERE category = ANY($1::text[])
     GROUP BY category
     ORDER BY category ASC`,
    [PRODUCT_CATEGORY_SLUGS]
  );

  return rows.map((r) => ({
    slug: r.slug,
    label: PRODUCT_CATEGORY_LABELS[r.slug] || r.slug,
    count: r.count,
  }));
}
