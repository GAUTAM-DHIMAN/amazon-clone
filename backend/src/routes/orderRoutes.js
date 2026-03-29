import { Router } from 'express';
import * as orderController from '../controllers/orderController.js';
import { pool } from '../config/database.js';

const router = Router();

router.post('/', orderController.createOrder);

// ✅ THIS MUST EXIST
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await pool.query(
      `SELECT id, total, created_at 
       FROM orders 
       WHERE user_id = $1 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(orders.rows);
  } catch (err) {
    console.error("Order history error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;