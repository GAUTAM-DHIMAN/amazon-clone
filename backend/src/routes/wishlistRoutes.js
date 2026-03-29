import express from "express";
import {
  getWishlist,
  addWishlist,
  removeWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/:userId", getWishlist);
router.post("/", addWishlist);
router.delete("/", removeWishlist);

// ✅ VERY IMPORTANT
export default router;