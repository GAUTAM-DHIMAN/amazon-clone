import * as cartModel from '../models/cartModel.js';
import * as orderModel from '../models/orderModel.js';
import * as userModel from '../models/userModel.js';

export async function createOrder(req, res, next) {
  try {
    const rawUserId = req.body?.userId ?? 1;
    const userId = Number(rawUserId);
    if (!Number.isInteger(userId) || userId < 1) {
      const err = new Error('Invalid userId');
      err.statusCode = 400;
      return next(err);
    }

    const shipping = req.body?.shipping;
    if (!shipping || typeof shipping !== 'object') {
      const err = new Error('shipping object is required');
      err.statusCode = 400;
      return next(err);
    }

    const required = ['fullName', 'line1', 'city', 'state', 'postalCode', 'country'];
    for (const key of required) {
      const value = shipping[key];
      if (!value || String(value).trim() === '') {
        const err = new Error(`shipping.${key} is required`);
        err.statusCode = 400;
        return next(err);
      }
    }

    // Validate string lengths
    if (String(shipping.fullName).length > 255) {
      const err = new Error('Full name is too long');
      err.statusCode = 400;
      return next(err);
    }
    if (shipping.phone && String(shipping.phone).length > 32) {
      const err = new Error('Phone number is too long');
      err.statusCode = 400;
      return next(err);
    }

    const user = await userModel.findUserById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      return next(err);
    }

    const cartRows = await cartModel.findCartByUserId(userId);
    if (cartRows.length === 0) {
      const err = new Error('Cart is empty');
      err.statusCode = 400;
      return next(err);
    }

    const lineItems = cartRows.map((row) => ({
      productId: row.productId,
      quantity: row.quantity,
      unitPrice: Number(row.price),
    }));

    for (const row of cartRows) {
      if (row.quantity > row.stock) {
        const err = new Error(`Not enough stock for "${row.name}"`);
        err.statusCode = 400;
        return next(err);
      }
    }

    const total =
      Math.round(
        lineItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100
      ) / 100;

    const order = await orderModel.createOrderWithItems(
      userId,
      {
        fullName: String(shipping.fullName).trim(),
        phone: shipping.phone ? String(shipping.phone).trim() : null,
        line1: String(shipping.line1).trim(),
        line2: shipping.line2 ? String(shipping.line2).trim() : null,
        city: String(shipping.city).trim(),
        state: String(shipping.state).trim(),
        postalCode: String(shipping.postalCode).trim(),
        country: String(shipping.country).trim(),
      },
      lineItems,
      total
    );

    await cartModel.clearCartForUser(userId);

    res.status(201).json({
      orderId: order.id,
      total: order.total,
      createdAt: order.createdAt,
    });
  } catch (e) {
    next(e);
  }
}
