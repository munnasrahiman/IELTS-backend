import express from 'express';
import { getChatHistory, sendMessage, markMessagesAsRead } from '../controllers/chatController.js';

const router = express.Router();

router.get('/history', getChatHistory);
router.post('/send', sendMessage);
router.put('/mark-read', markMessagesAsRead);

export default router; 