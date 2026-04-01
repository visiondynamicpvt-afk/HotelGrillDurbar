import express from 'express';
import {
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  deleteBooking,
  exportBookings,
} from '../../controllers/admin/bookingController.js';
import { protect } from '../../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getAllBookings);
router.get('/export', exportBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.put('/:id/payment', updatePaymentStatus);
router.delete('/:id', deleteBooking);

export default router;
