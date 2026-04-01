import express from 'express';
import {
	changeUserPassword,
	getCurrentUser,
	getUserProfile,
	login,
	signup,
	updateUserProfile,
} from '../controllers/userController.js';
import { protectUser } from '../middleware/userAuth.js';

const router = express.Router();

router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.get('/auth/me', protectUser, getCurrentUser);

router.get('/:userId', protectUser, getUserProfile);
router.put('/:userId', protectUser, updateUserProfile);
router.put('/:userId/password', protectUser, changeUserPassword);

export default router;
