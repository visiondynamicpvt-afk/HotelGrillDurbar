import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking.js';
import { notifyAdminNewBooking, notifyAdminPaymentSubmitted } from '../utils/notifications.js';

// @desc    Create new booking
// @route   POST /api/bookings/create
// @access  Public
export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      guestName,
      phoneNumber,
      email,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      numberOfRooms,
      specialRequests,
      userId,
    } = req.body;

    // Validation
    if (!guestName || !phoneNumber || !checkInDate || !checkOutDate || !numberOfGuests || !numberOfRooms) {
      res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Validate dates
    if (checkIn >= checkOut) {
      res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
      return;
    }

    if (checkIn < new Date(new Date().setHours(0, 0, 0, 0))) {
      res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past',
      });
      return;
    }

    // Mock availability check (always available for now)
    const availability = {
      isAvailable: true,
      availableRooms: 10,
      message: 'Rooms available'
    };

    if (!availability.isAvailable) {
      res.status(400).json({
        success: false,
        message: availability.message || 'Rooms not available for selected dates',
        availability,
      });
      return;
    }

    // Mock room price
    const pricePerRoom = 2000; // Mock price per room per night

    // Calculate number of nights
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

    // Calculate total amount (price per room * number of rooms * nights)
    const totalAmount = pricePerRoom * numberOfRooms * nights;

    // Create booking in MongoDB
    const booking = await Booking.create({
      guestName,
      phoneNumber,
      email,
      userId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfGuests,
      numberOfRooms,
      specialRequests,
      totalAmount,
      bookingStatus: 'Pending',
      paymentStatus: 'Pending',
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully! Your payment is pending admin approval. You will receive a confirmation once approved.',
    });
  } catch (error: any) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Check room availability
// @route   GET /api/bookings/check-availability
// @access  Public
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
  try {
    const { checkInDate, checkOutDate, numberOfRooms } = req.query;

    if (!checkInDate || !checkOutDate || !numberOfRooms) {
      res.status(400).json({
        success: false,
        message: 'Please provide checkInDate, checkOutDate, and numberOfRooms',
      });
      return;
    }

    const checkIn = new Date(checkInDate as string);
    const checkOut = new Date(checkOutDate as string);
    const rooms = parseInt(numberOfRooms as string);

    if (isNaN(rooms) || rooms < 1) {
      res.status(400).json({
        success: false,
        message: 'Invalid number of rooms',
      });
      return;
    }

    // Mock availability check - always return available for now
    const availability = {
      isAvailable: true,
      availableRooms: 10,
      requestedRooms: rooms,
      message: 'Rooms available for selected dates'
    };

    res.status(200).json({
      success: true,
      data: availability,
    });
  } catch (error: any) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:bookingId
// @access  Public
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
      return;
    }

    let booking = null;

    // Check if bookingId is a valid MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(bookingId) && bookingId.length === 24) {
      // Try to find by MongoDB _id first
      try {
        booking = await Booking.findById(bookingId).lean();
      } catch (err) {
        // If findById fails, continue to search by bookingId field
      }
    }

    // If not found by _id, search by bookingId field
    if (!booking) {
      booking = await Booking.findOne({ bookingId }).lean();
    }

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Upload payment proof
// @route   POST /api/bookings/:bookingId/payment-proof
// @access  Public
export const uploadPaymentProof = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    const fileUrl = (req as any).fileUrl as string | undefined;

    if (!bookingId) {
      res.status(400).json({
        success: false,
        message: 'Booking ID is required',
      });
      return;
    }

    if (!fileUrl) {
      res.status(400).json({
        success: false,
        message: 'Payment proof image is required',
      });
      return;
    }

    let booking = null;

    // Check if bookingId is a valid MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(bookingId) && bookingId.length === 24) {
      // Try to find by MongoDB _id first
      try {
        booking = await Booking.findById(bookingId);
      } catch (err) {
        // If findById fails, continue to search by bookingId field
      }
    }

    // If not found by _id, search by bookingId field
    if (!booking) {
      booking = await Booking.findOne({ bookingId });
    }
    
    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    // Update booking with payment proof URL from Cloudinary
    booking.paymentProof = fileUrl;
    booking.bookingStatus = 'Payment Submitted';
    booking.paymentStatus = 'Submitted';
    
    const updatedBooking = await booking.save();

    // Send WhatsApp notification to admin
    try {
      await notifyAdminNewBooking(updatedBooking as any, true);
      console.log(`✅ WhatsApp notification sent for booking ${bookingId}`);
    } catch (notifError) {
      console.error('⚠️ Failed to send WhatsApp notification:', notifError);
      // Don't fail the request if notification fails
    }

    res.status(200).json({
      success: true,
      data: updatedBooking,
      message: 'Payment proof uploaded successfully. Admin has been notified via WhatsApp.',
    });
  } catch (error: any) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/user/:userId
// @access  Public
export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      });
      return;
    }

    // Fetch bookings from MongoDB for this user
    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Cancel booking by user
// @route   PUT /api/bookings/user/:userId/bookings/:bookingId/cancel
// @access  Private (MongoDB JWT)
export const cancelBookingByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, bookingId } = req.params;

    if (!userId || !bookingId) {
      res.status(400).json({
        success: false,
        message: 'User ID and booking ID are required',
      });
      return;
    }

    let booking = await Booking.findOne({ bookingId, userId });
    if (!booking && mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findOne({ _id: bookingId, userId });
    }

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    booking.bookingStatus = 'Cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Reschedule booking by user
// @route   PUT /api/bookings/user/:userId/bookings/:bookingId/reschedule
// @access  Private (MongoDB JWT)
export const rescheduleBookingByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, bookingId } = req.params;
    const { checkInDate, checkOutDate } = req.body;

    if (!userId || !bookingId || !checkInDate || !checkOutDate) {
      res.status(400).json({
        success: false,
        message: 'User ID, booking ID, check-in date and check-out date are required',
      });
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    if (checkIn >= checkOut) {
      res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date',
      });
      return;
    }

    let booking = await Booking.findOne({ bookingId, userId });
    if (!booking && mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findOne({ _id: bookingId, userId });
    }

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    booking.checkInDate = checkIn;
    booking.checkOutDate = checkOut;
    booking.bookingStatus = 'Pending';
    booking.paymentStatus = booking.paymentProof ? 'Submitted' : 'Pending';

    const updatedBooking = await booking.save();

    res.status(200).json({
      success: true,
      data: updatedBooking,
      message: 'Booking rescheduled successfully',
    });
  } catch (error: any) {
    console.error('Reschedule booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};