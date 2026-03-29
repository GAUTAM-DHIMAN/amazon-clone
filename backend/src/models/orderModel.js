import { withTransaction } from '../config/database.js';

export async function createOrderWithItems(userId, shipping, lineItems, total) {
  return withTransaction(async (client) => {
    for (const item of lineItems) {
      const stockRes = await client.query(
        `SELECT stock
         FROM products
         WHERE id = $1
         FOR UPDATE`,
        [item.productId]
      );
      if (!stockRes.rows[0] || stockRes.rows[0].stock < item.quantity) {
        const err = new Error('Insufficient stock for one or more items');
        err.statusCode = 409;
        throw err;
      }
    }

    const orderRes = await client.query(
      `INSERT INTO orders (
        user_id, shipping_recipient_name, shipping_phone,
        shipping_line1, shipping_line2, shipping_city,
        shipping_state, shipping_postal_code, shipping_country, total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, created_at AS "createdAt", total`,
      [
        userId,
        shipping.fullName ? String(shipping.fullName).trim() : null,
        shipping.phone ? String(shipping.phone).trim() : null,
        shipping.line1,
        shipping.line2 ?? null,
        shipping.city,
        shipping.state,
        shipping.postalCode,
        shipping.country,
        total,
      ]
    );

    const order = orderRes.rows[0];

    for (const item of lineItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.productId, item.quantity, item.unitPrice]
      );

      const upd = await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2 AND stock >= $1`,
        [item.quantity, item.productId]
      );
      if (upd.rowCount === 0) {
        const err = new Error('Stock changed while placing order; try again');
        err.statusCode = 409;
        throw err;
      }
    }

    return order;
  });
}
