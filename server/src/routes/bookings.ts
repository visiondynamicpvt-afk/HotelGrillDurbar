import express from 'express';
import {
  checkAvailability,
  createBooking,
  getBookingById,
  uploadPaymentProof,
  getUserBookings,
  cancelBookingByUser,
  rescheduleBookingByUser,
} from '../controllers/bookingController.js';
import { upload, uploadToCloudinary } from '../middleware/cloudinaryUpload.js';
import { protectUser } from '../middleware/userAuth.js';

const router = express.Router();

router.get('/check-availability', checkAvailability);
router.post('/create', createBooking);
router.post('/:bookingId/payment-proof', upload.single('paymentProof'), uploadToCloudinary('payment-proofs'), uploadPaymentProof);
router.get('/user/:userId', protectUser, getUserBookings);
router.put('/user/:userId/bookings/:bookingId/cancel', protectUser, cancelBookingByUser);
router.put('/user/:userId/bookings/:bookingId/reschedule', protectUser, rescheduleBookingByUser);
router.get('/:bookingId', getBookingById);

export default router;