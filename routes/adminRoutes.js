import express from 'express';
import { getAdminDashboardStats } from '../controllers/dashboardController.js';
import { getStudentProgress, getAnalyticsReport } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard/stats', getAdminDashboardStats);
router.get('/student-progress', getStudentProgress);
router.get('/analytics', getAnalyticsReport);

export default router; 