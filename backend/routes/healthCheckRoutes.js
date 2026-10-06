import express from 'express';
import { protect } from '../middleware/auth.js';
import { analyzeHealthImage } from '../controllers/healthCheckController.js';

const router = express.Router();

router.post('/analyze', protect, analyzeHealthImage);

export default router;
