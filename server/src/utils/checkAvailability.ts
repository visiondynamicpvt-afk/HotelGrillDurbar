import Booking, { IBooking } from '../models/Booking.js';
import Room from '../models/Room.js';

export interface AvailabilityCheck {
  isAvailable: boolean;
  availableRooms: number;
  totalRooms: number;
  message?: string;
}

export const checkRoomAvailability = async (
  checkInDate: Date,
  checkOutDate: Date,
  numberOfRooms: number
): Promise<AvailabilityCheck> => {
  try {
    // Get total available rooms (assuming 14 rooms total)
    const totalRooms = 14;

    // For now, return mock data to test API connectivity
    // TODO: Re-enable database queries when MongoDB is working
    const bookedRooms = 0; // Mock: no rooms booked

    const availableRooms = totalRooms - bookedRooms;

    if (availableRooms >= numberOfRooms) {
      return {
        isAvailable: true,
        availableRooms,
        totalRooms,
        message: `${availableRooms} rooms available`,
      };
    } else {
      return {
        isAvailable: false,
        availableRooms,
        totalRooms,
        message: `Only ${availableRooms} rooms available. Requested: ${numberOfRooms}`,
      };
    }

    // Original database query (commented out for now):
    /*
    // Find all bookings that overlap with the requested dates
    const overlappingBookings = await Booking.find({
      bookingStatus: { $in: ['Approved', 'Payment Submitted'] },
      $or: [
        {
          checkInDate: { $lte: checkOutDate },
          checkOutDate: { $gte: checkInDate },
        },
      ],
    });

    // Calculate booked rooms for the date range
    let bookedRooms = 0;
    overlappingBookings.forEach((booking) => {
      bookedRooms += booking.numberOfRooms;
    });

    const availableRooms = totalRooms - bookedRooms;

    if (availableRooms >= numberOfRooms) {
      return {
        isAvailable: true,
        availableRooms,
        totalRooms,
        message: `${availableRooms} rooms available`,
      };
    } else {
      return {
        isAvailable: false,
        availableRooms,
        totalRooms,
        message: `Only ${availableRooms} rooms available. Requested: ${numberOfRooms}`,
      };
    }
    */
  } catch (error) {
    console.error('Error checking room availability:', error);
    // Return default available response on error
    return {
      isAvailable: true,
      availableRooms: 14,
      totalRooms: 14,
      message: 'Availability check temporarily unavailable',
    };
  }
};
