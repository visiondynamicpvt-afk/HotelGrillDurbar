import express from 'express';
import {
  getContentBySection,
  updateContentSection,
  uploadContentImage,
} from '../../controllers/admin/contentController.js';
import { protect } from '../../middleware/auth.js';
import { upload, uploadToCloudinary } from '../../middleware/cloudinaryUpload.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/:section', getContentBySection);
router.put('/:section', updateContentSection);
router.post('/upload-image', upload.single('image'), uploadToCloudinary('content'), uploadContentImage);

export default router;
