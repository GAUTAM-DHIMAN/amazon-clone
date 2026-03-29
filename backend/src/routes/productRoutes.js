import { Router } from 'express';
import * as productController from '../controllers/productController.js';

const router = Router();

router.get('/categories', productController.listProductCategories);
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

export default router;
