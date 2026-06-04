import { Router } from 'express';
import { getDebts, recordPayment } from '../controllers/debts.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getDebts);
router.post('/:id/payment', recordPayment);

export default router;
