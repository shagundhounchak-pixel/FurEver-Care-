import express from 'express';
import { protect } from '../middleware/auth.js';
import { chatWithPawbot } from '../controllers/pawbotController.js';

const router = express.Router();

router.post('/', protect, chatWithPawbot);

export default router;
