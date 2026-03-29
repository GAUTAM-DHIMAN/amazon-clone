import { pool } from "../config/database.js";

export async function getWishlistByUser(userId) {
  const res = await pool.query(
    `SELECT w.id, p.*
     FROM wishlist w
     JOIN products p ON p.id = w.product_id
     WHERE w.user_id = $1
     ORDER BY w.created_at DESC`,
    [userId]
  );
  return res.rows;
}

export async function addToWishlist(userId, productId) {
  await pool.query(
    `INSERT INTO wishlist (user_id, product_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, product_id) DO NOTHING`,
    [userId, productId]
  );
}

export async function removeFromWishlist(userId, productId) {
  await pool.query(
    `DELETE FROM wishlist
     WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );
}