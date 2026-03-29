import * as wishlistModel from "../models/wishlistModel.js";

export async function getWishlist(req, res, next) {
  try {
    const userId = Number(req.params.userId);
    const data = await wishlistModel.getWishlistByUser(userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function addWishlist(req, res, next) {
  try {
    const { userId, productId } = req.body;
    await wishlistModel.addToWishlist(userId, productId);
    res.json({ message: "Added to wishlist" });
  } catch (e) {
    next(e);
  }
}

export async function removeWishlist(req, res, next) {
  try {
    const { userId, productId } = req.body;
    await wishlistModel.removeFromWishlist(userId, productId);
    res.json({ message: "Removed from wishlist" });
  } catch (e) {
    next(e);
  }
}