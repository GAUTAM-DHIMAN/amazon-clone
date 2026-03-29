import * as productModel from '../models/productModel.js';
import { normalizeCategorySlug } from '../constants/productCategories.js';

export async function listProducts(req, res, next) {
  try {
    const q =
      req.query.q != null && String(req.query.q).trim() !== ''
        ? String(req.query.q).trim()
        : null;
    const category = normalizeCategorySlug(req.query.category);
    
    // Validate search term length
    if (q && q.length > 255) {
      const err = new Error('Search query is too long');
      err.statusCode = 400;
      return next(err);
    }

    const products = await productModel.findProducts({
      search: q,
      category,
    });
    res.json(products);
  } catch (e) {
    next(e);
  }
}

export async function listProductCategories(req, res, next) {
  try {
    const items = await productModel.findCategorySummaries();
    res.json({ categories: items });
  } catch (e) {
    next(e);
  }
}

export async function getProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      const err = new Error('Invalid product id');
      err.statusCode = 400;
      return next(err);
    }

    const product = await productModel.findProductById(id);
    if (!product) {
      const err = new Error('Product not found');
      err.statusCode = 404;
      return next(err);
    }

    res.json(product);
  } catch (e) {
    next(e);
  }
}
