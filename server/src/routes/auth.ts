import express from 'express';
import { login, logout, verify } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', protect, verify);

export default router;
