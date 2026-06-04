import { Router } from 'express';
import { getDashboardSummary, getDailyRevenueChart, getBusinessReport } from '../controllers/reports.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/summary', getDashboardSummary);
router.get('/charts/daily', getDailyRevenueChart);
router.get('/business', getBusinessReport);

export default router;
