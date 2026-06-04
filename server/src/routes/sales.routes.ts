import { Router } from 'express';
import {
  getSales,
  createSale,
  getSale,
  cancelSale,
} from '../controllers/sales.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', getSales);
router.post('/', createSale);
router.get('/:id', getSale);
router.delete('/:id', cancelSale);

export default router;
