import { Router } from 'express';
import { getCustomers, createCustomer, getCustomer, updateCustomer } from '../controllers/customers.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/', getCustomers);
router.post('/', createCustomer);
router.get('/:id', getCustomer);
router.put('/:id', updateCustomer);

export default router;
