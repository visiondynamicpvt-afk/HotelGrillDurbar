import express from 'express';
import { getContentBySection } from '../controllers/contentController.js';

const router = express.Router();

router.get('/:section', getContentBySection);

export default router;
