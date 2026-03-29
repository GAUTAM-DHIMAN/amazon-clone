import { query } from '../config/database.js';

export async function findUserById(id) {
  const { rows } = await query(
    `SELECT id, name, email   -- ✅ FIX: added email
     FROM users
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}