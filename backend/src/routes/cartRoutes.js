import { Router } from 'express';
import * as cartController from '../controllers/cartController.js';

const router = Router();

router.get('/', cartController.getCart);
router.post('/', cartController.addOrUpdateCart);
router.delete('/:id', cartController.removeCartItem);

export default router;
