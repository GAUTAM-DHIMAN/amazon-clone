import express from 'express';
import cors from 'cors';
import { checkDatabase } from './config/database.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import authRoutes from './routes/authRoutes.js'; // NEW: Import Auth Routes
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json());

app.get('/health', async (req, res) => {
  const db = await checkDatabase();
  res.status(db ? 200 : 503).json({
    ok: db,
    database: db ? 'up' : 'down',
  });
});

// --- ROUTES ---
app.use('/api/auth', authRoutes); // NEW: Auth endpoints (matches your frontend fetch)
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// --- ERROR HANDLING ---
app.use(notFoundHandler);
app.use(errorHandler);

export default app;