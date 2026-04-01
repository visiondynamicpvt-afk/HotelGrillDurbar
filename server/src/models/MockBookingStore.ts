// Shared mock data store for bookings
// This simulates a database for development purposes

export interface MockBooking {
  _id: string;
  bookingId: string;
  guestName: string;
  phoneNumber: string;
  email?: string;
  checkInDate: string | Date;
  checkOutDate: string | Date;
  numberOfGuests: number;
  numberOfRooms: number;
  specialRequests?: string;
  bookingStatus: 'Pending' | 'Payment Submitted' | 'Approved' | 'Rejected' | 'Cancelled';
  paymentStatus: 'Pending' | 'Submitted' | 'Verified' | 'Failed';
  paymentProof?: string;
  totalAmount: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  userId?: string;
}

// In-memory storage for mock bookings
// Start with empty array - bookings will be added as users create them
let mockBookings: MockBooking[] = [];

// Functions to manage mock bookings
export const getAllMockBookings = (): MockBooking[] => {
  return [...mockBookings];
};

export const getMockBookingById = (id: string): MockBooking | undefined => {
  return mockBookings.find(booking => booking._id === id);
};

export const getMockBookingByBookingId = (bookingId: string): MockBooking | undefined => {
  return mockBookings.find(booking => booking.bookingId === bookingId);
};

export const getMockBookingsByUserId = (userId: string): MockBooking[] => {
  return mockBookings.filter(booking => booking.userId === userId);
};

export const addMockBooking = (booking: Omit<MockBooking, '_id' | 'createdAt' | 'updatedAt'>): MockBooking => {
  const newBooking: MockBooking = {
    ...booking,
    _id: 'mock_id_' + Date.now(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  mockBookings.push(newBooking);
  return newBooking;
};

export const updateMockBooking = (id: string, updates: Partial<MockBooking>): MockBooking | null => {
  const index = mockBookings.findIndex(booking => booking._id === id);
  if (index === -1) return null;

  mockBookings[index] = {
    ...mockBookings[index],
    ...updates,
    updatedAt: new Date(),
  };
  return mockBookings[index];
};

export const deleteMockBooking = (id: string): boolean => {
  const index = mockBookings.findIndex(booking => booking._id === id);
  if (index === -1) return false;

  mockBookings.splice(index, 1);
  return true;
};

export const filterMockBookings = (filters: {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}): MockBooking[] => {
  let filtered = [...mockBookings];

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(booking => booking.bookingStatus === filters.status);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(booking =>
      booking.bookingId.toLowerCase().includes(searchLower) ||
      booking.guestName.toLowerCase().includes(searchLower) ||
      booking.phoneNumber.toLowerCase().includes(searchLower) ||
      booking.email?.toLowerCase().includes(searchLower)
    );
  }

  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filtered = filtered.filter(booking => new Date(booking.createdAt) >= startDate);
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filtered = filtered.filter(booking => new Date(booking.createdAt) <= endDate);
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};