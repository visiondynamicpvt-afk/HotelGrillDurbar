import express from 'express';
import { getAvailableRooms, getRoomById } from '../controllers/roomController.js';

const router = express.Router();

router.get('/', getAvailableRooms);
router.get('/:id', getRoomById);

export default router;
