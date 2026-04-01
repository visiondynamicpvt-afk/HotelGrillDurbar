import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../../models/Booking.js';
import { notifyGuestBookingConfirmed } from '../../utils/notifications.js';
import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Private
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, startDate, endDate, search } = req.query;

    // Build MongoDB query
    const query: any = {};

    // Apply filters
    if (status && status !== 'all') {
      query.bookingStatus = status;
    }

    if (startDate) {
      query.createdAt = { ...query.createdAt, $gte: new Date(startDate as string) };
    }

    if (endDate) {
      query.createdAt = { ...query.createdAt, $lte: new Date(endDate as string) };
    }

    if (search) {
      const searchTerm = (search as string).toLowerCase();
      query.$or = [
        { guestName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
        { bookingId: { $regex: searchTerm, $options: 'i' } },
        { phoneNumber: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    // Fetch bookings from MongoDB
    const bookings = await Booking.find(query)
      .sort({ createdAt: -1 }) // Sort by creation date (newest first)
      .lean();

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error while fetching bookings',
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/admin/bookings/:id
// @access  Private
export const getBookingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let booking = null;

    // Check if id is a valid MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      // Try to find by MongoDB _id first
      try {
        booking = await Booking.findById(id).lean();
      } catch (err) {
        // If findById fails, continue to search by bookingId field
      }
    }

    // If not found by _id, search by bookingId field
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id }).lean();
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

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['Pending', 'Payment Submitted', 'Approved', 'Rejected', 'Cancelled'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
      return;
    }

    let booking = null;

    // Check if id is a valid MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      // Try to find by MongoDB _id first
      try {
        booking = await Booking.findById(id);
      } catch (err) {
        // If findById fails, continue to search by bookingId field
      }
    }

    // If not found by _id, search by bookingId field
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id });
    }

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    booking.bookingStatus = status as any;
    const updatedBooking = await booking.save();

    // Send notification for approved bookings
    if (status === 'Approved') {
      try {
        await notifyGuestBookingConfirmed(updatedBooking as any);
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }
    }

    res.status(200).json({
      success: true,
      data: updatedBooking,
      message: 'Booking status updated successfully',
    });
  } catch (error: any) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/admin/bookings/:id/payment
// @access  Private
export const updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['Pending', 'Submitted', 'Verified', 'Failed'].includes(paymentStatus)) {
      res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
      return;
    }

    let booking = null;

    // Check if id is a valid MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      // Try to find by MongoDB _id first
      try {
        booking = await Booking.findById(id);
      } catch (err) {
        // If findById fails, continue to search by bookingId field
      }
    }

    // If not found by _id, search by bookingId field
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id });
    }

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    booking.paymentStatus = paymentStatus as any;

    // Auto-update booking status if payment verified
    if (paymentStatus === 'Verified') {
      booking.bookingStatus = 'Approved';
    }

    const updatedBooking = await booking.save();

    // Send notification for verified payments
    if (paymentStatus === 'Verified' && updatedBooking.bookingStatus === 'Approved') {
      try {
        await notifyGuestBookingConfirmed(updatedBooking as any);
      } catch (notifError) {
        console.error('Failed to send notification:', notifError);
      }
    }

    res.status(200).json({
      success: true,
      data: updatedBooking,
      message: 'Payment status updated successfully',
    });
  } catch (error: any) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/admin/bookings/:id
// @access  Private
export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    let booking = null;

    // Check if id is a valid MongoDB ObjectId (24 hex characters)
    if (mongoose.Types.ObjectId.isValid(id) && id.length === 24) {
      // Try to find by MongoDB _id first
      try {
        booking = await Booking.findById(id);
      } catch (err) {
        // If findById fails, continue to search by bookingId field
      }
    }

    // If not found by _id, search by bookingId field
    if (!booking) {
      booking = await Booking.findOne({ bookingId: id });
    }

    if (!booking) {
      res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
      return;
    }

    await Booking.findByIdAndDelete(booking._id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// @desc    Export bookings
// @route   GET /api/admin/bookings/export
// @access  Private
export const exportBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { format } = req.query;
    const exportFormat = format === 'pdf' ? 'pdf' : 'excel';

    // Fetch all bookings from MongoDB
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();

    if (exportFormat === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Bookings');

      worksheet.columns = [
        { header: 'Booking ID', key: 'bookingId', width: 15 },
        { header: 'Guest Name', key: 'guestName', width: 20 },
        { header: 'Phone', key: 'phoneNumber', width: 15 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Check-in', key: 'checkInDate', width: 15 },
        { header: 'Check-out', key: 'checkOutDate', width: 15 },
        { header: 'Guests', key: 'numberOfGuests', width: 10 },
        { header: 'Rooms', key: 'numberOfRooms', width: 10 },
        { header: 'Amount', key: 'totalAmount', width: 15 },
        { header: 'Status', key: 'bookingStatus', width: 15 },
        { header: 'Payment', key: 'paymentStatus', width: 15 },
        { header: 'Created', key: 'createdAt', width: 20 },
      ];

      bookings.forEach((booking) => {
        worksheet.addRow({
          bookingId: booking.bookingId,
          guestName: booking.guestName,
          phoneNumber: booking.phoneNumber,
          email: booking.email || '',
          checkInDate: new Date(booking.checkInDate).toLocaleDateString(),
          checkOutDate: new Date(booking.checkOutDate).toLocaleDateString(),
          numberOfGuests: booking.numberOfGuests,
          numberOfRooms: booking.numberOfRooms,
          totalAmount: booking.totalAmount,
          bookingStatus: booking.bookingStatus,
          paymentStatus: booking.paymentStatus,
          createdAt: new Date(booking.createdAt).toLocaleString(),
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } else {
      // PDF export
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.pdf');

      doc.pipe(res);
      doc.fontSize(20).text('Hotel Grill Durbar - Bookings Report', { align: 'center' });
      doc.moveDown();

      bookings.forEach((booking, index) => {
        doc.fontSize(12).text(`Booking ${index + 1}: ${booking.bookingId}`);
        doc.text(`Guest: ${booking.guestName}`);
        doc.text(`Phone: ${booking.phoneNumber}`);
        doc.text(`Check-in: ${new Date(booking.checkInDate).toLocaleDateString()}`);
        doc.text(`Check-out: ${new Date(booking.checkOutDate).toLocaleDateString()}`);
        doc.text(`Amount: NPR ${booking.totalAmount}`);
        doc.text(`Status: ${booking.bookingStatus}`);
        doc.moveDown();
      });

      doc.end();
    }
  } catch (error: any) {
    console.error('Export bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};
