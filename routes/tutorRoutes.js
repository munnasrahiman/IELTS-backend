import express from 'express';
import { getAssignedUsers } from '../controllers/tutorController.js';

const router = express.Router();

// Tutor routes
router.get('/assigned-users/:tutorId', getAssignedUsers);

export default router; 