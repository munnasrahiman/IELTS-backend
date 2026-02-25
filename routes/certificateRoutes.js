import express from 'express';
import { generateCertificate, getCertificate } from '../controllers/certificateController.js';

const router = express.Router();

router.get('/generate', generateCertificate);
router.get('/view', getCertificate);

export default router; 