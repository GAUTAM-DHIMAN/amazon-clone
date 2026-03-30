import { query, withTransaction } from '../config/database.js';

export async function findCartByUserId(userId) {
  const { rows } = await query(
    `SELECT c.id AS "cartId",
            c.quantity,
            p.id AS "productId",
            p.name,
            p.price,
            p.image_url AS "imageUrl",
            p.stock
     FROM cart c
     INNER JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1
     ORDER BY c.updated_at DESC`,
    [userId]
  );
  return rows;
}

export async function upsertCartItem(userId, productId, quantity) {
  const { rows } = await query(
    `INSERT INTO cart (user_id, product_id, quantity, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = NOW()
     RETURNING id AS "cartId", user_id AS "userId", product_id AS "productId", quantity`,
    [userId, productId, quantity]
  );
  return rows[0];
}

/**
 * Add quantity to an existing line (or create). Caps at current product stock.
 */
export async function mergeCartItem(userId, productId, addQuantity) {
  return withTransaction(async (client) => {
    const pRes = await client.query(
      `SELECT stock
       FROM products
       WHERE id = $1
       FOR UPDATE`,
      [productId]
    );
    if (!pRes.rows[0]) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      throw err;
    }
    const stock = Number(pRes.rows[0].stock);

    const cRes = await client.query(
      `SELECT id, quantity
       FROM cart
       WHERE user_id = $1 AND product_id = $2
       FOR UPDATE`,
      [userId, productId]
    );
    const existing = cRes.rows[0];
    const current = existing ? Number(existing.quantity) : 0;
    const newQty = Math.min(stock, current + addQuantity);

    if (addQuantity < 1) {
      const err = new Error('quantity must be a positive integer');
      err.statusCode = 400;
      throw err;
    }
    if (newQty < 1) {
      const err = new Error('Insufficient stock');
      err.statusCode = 400;
      throw err;
    }

    if (existing) {
      const { rows } = await client.query(
        `UPDATE cart
         SET quantity = $1, updated_at = NOW()
         WHERE id = $2
         RETURNING id AS "cartId", user_id AS "userId", product_id AS "productId", quantity`,
        [newQty, existing.id]
      );
      return rows[0];
    }

    const { rows } = await client.query(
      `INSERT INTO cart (user_id, product_id, quantity, updated_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id AS "cartId", user_id AS "userId", product_id AS "productId", quantity`,
      [userId, productId, newQty]
    );
    return rows[0];
  });
}

export async function deleteCartItem(cartId, userId) {
  const { rowCount } = await query(
    `DELETE FROM cart
     WHERE id = $1 AND user_id = $2`,
    [cartId, userId]
  );
  return rowCount;
}

export async function clearCartForUser(userId) {
  await query(`DELETE FROM cart WHERE user_id = $1`, [userId]);
}
