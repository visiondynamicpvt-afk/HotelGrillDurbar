import express from 'express';
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  toggleRoomAvailability,
  uploadRoomImages,
} from '../../controllers/admin/roomController.js';
import { protect } from '../../middleware/auth.js';
import { upload, uploadToCloudinary } from '../../middleware/cloudinaryUpload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getAllRooms);
router.post('/', createRoom);
router.put('/:id', updateRoom);
router.delete('/:id', deleteRoom);
router.put('/:id/availability', toggleRoomAvailability);
router.post('/:id/images', upload.array('images', 10), uploadToCloudinary('rooms'), uploadRoomImages);

export default router;
