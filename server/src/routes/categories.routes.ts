import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categories.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getCategories);
router.post('/', createCategory);

export default router;
