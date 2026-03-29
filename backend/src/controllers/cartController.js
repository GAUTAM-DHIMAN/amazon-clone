import * as cartModel from '../models/cartModel.js';
import * as productModel from '../models/productModel.js';
import * as userModel from '../models/userModel.js';

function parseUserId(req) {
  const raw = req.body?.userId ?? req.query.userId;
  const id = raw === undefined || raw === '' ? 1 : Number(raw);
  if (!Number.isInteger(id) || id < 1) {
    const err = new Error('Invalid userId');
    err.statusCode = 400;
    throw err;
  }
  return id;
}

export async function getCart(req, res, next) {
  try {
    const userId = parseUserId(req);
    const user = await userModel.findUserById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    const items = await cartModel.findCartByUserId(userId);
    const subtotal = items.reduce(
      (sum, row) => sum + Number(row.price) * row.quantity,
      0
    );

    res.json({
      userId,
      items: items.map((row) => ({
        cartId: row.cartId,
        productId: row.productId,
        name: row.name,
        price: row.price,
        imageUrl: row.imageUrl,
        stock: row.stock,
        quantity: row.quantity,
        lineTotal: Number(row.price) * row.quantity,
      })),
      subtotal: Math.round(subtotal * 100) / 100,
    });
  } catch (e) {
    next(e);
  }
}

export async function addOrUpdateCart(req, res, next) {
  try {
    const userId = parseUserId(req);
    const { productId, quantity, merge } = req.body ?? {};
    const mergeAdditive =
      merge === true || merge === 'true' || merge === 1 || merge === '1';

    const pid = Number(productId);
    const qty = Number(quantity);

    if (!Number.isInteger(pid) || pid < 1) {
      const err = new Error('Invalid productId');
      err.statusCode = 400;
      return next(err);
    }
    if (!Number.isInteger(qty) || qty < 1) {
      const err = new Error('quantity must be a positive integer');
      err.statusCode = 400;
      return next(err);
    }
    // Prevent bulk purchases of unrealistic quantities
    if (qty > 999) {
      const err = new Error('quantity cannot exceed 999');
      err.statusCode = 400;
      return next(err);
    }

    const user = await userModel.findUserById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    if (mergeAdditive) {
      const row = await cartModel.mergeCartItem(userId, pid, qty);
      return res.status(201).json(row);
    }

    const product = await productModel.findProductById(pid);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    if (qty > product.stock) {
      const err = new Error('Quantity exceeds available stock');
      err.statusCode = 400;
      return next(err);
    }

    const row = await cartModel.upsertCartItem(userId, pid, qty);
    return res.status(201).json(row);
  } catch (e) {
    next(e);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const userId = parseUserId(req);
    const cartId = Number(req.params.id);

    if (!Number.isInteger(cartId) || cartId < 1) {
      const err = new Error('Invalid cart id');
      err.statusCode = 400;
      return next(err);
    }

    const deleted = await cartModel.deleteCartItem(cartId, userId);
    if (deleted === 0) {
      const err = new Error('Cart item not found');
      err.statusCode = 404;
      return next(err);
    }

    res.status(204).send();
  } catch (e) {
    next(e);
  }
}
