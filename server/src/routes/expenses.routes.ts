import { Router } from 'express';
import { getExpenses, createExpense, updateExpense } from '../controllers/expenses.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getExpenses);
router.post('/', createExpense);
router.put('/:id', updateExpense);

export default router;
