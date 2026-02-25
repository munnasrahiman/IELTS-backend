import express from 'express';
import { addResource, getResources, deleteResource } from '../controllers/resourceController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/add', upload.single('file'), addResource);
router.get('/:tutorId', getResources);
router.delete('/:id/:tutor_id', deleteResource);

export default router; 