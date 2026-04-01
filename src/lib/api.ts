import { API_BASE_URL, expectJsonResponse, getResponseMessage, parseJsonResponse } from './http';

export interface BookingData {
  guestName: string;
  phoneNumber: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  specialRequests?: string;
  userId?: string;
}

export interface Booking {
  id: string;
  bookingId: string;
  guestName: string;
  phoneNumber: string;
  email?: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  specialRequests?: string;
  bookingStatus: 'Pending' | 'Payment Submitted' | 'Approved' | 'Rejected' | 'Cancelled';
  paymentStatus: 'Pending' | 'Submitted' | 'Verified' | 'Failed';
  paymentProof?: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  roomType: string;
  pricePerPerson: number;
  features: string[];
  images?: string[];
  isAvailable: boolean;
  maxOccupancy: number;
  description?: string;
}

export interface AvailabilityCheck {
  isAvailable: boolean;
  availableRooms: number;
  totalRooms: number;
  message?: string;
}

export interface AppUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

// Helper function to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

export const api = {
  // User Auth (MongoDB + JWT)
  async signupUser(email: string, password: string, name?: string): Promise<{ token: string; user: AppUser }> {
    const response = await fetch(`${API_BASE_URL}/users/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const result = await parseJsonResponse<{ token: string; user: AppUser; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to create account'));
    }

    const data = expectJsonResponse(result);

    return {
      token: data.token,
      user: data.user,
    };
  },

  async loginUser(email: string, password: string): Promise<{ token: string; user: AppUser }> {
    const response = await fetch(`${API_BASE_URL}/users/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await parseJsonResponse<{ token: string; user: AppUser; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to login'));
    }

    const data = expectJsonResponse(result);

    return {
      token: data.token,
      user: data.user,
    };
  },

  async getCurrentUser(): Promise<AppUser> {
    const response = await fetch(`${API_BASE_URL}/users/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseJsonResponse<{ data: AppUser; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to fetch current user'));
    }

    return expectJsonResponse(result).data;
  },

  // Bookings
  async createBooking(data: BookingData): Promise<{ booking: Booking; message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookings/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await parseJsonResponse<{ data: Booking; message: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to create booking'));
    }

    const responseData = expectJsonResponse(result);
    return { booking: responseData.data, message: responseData.message };
  },

  async checkAvailability(
    checkInDate: string,
    checkOutDate: string,
    numberOfRooms: number
  ): Promise<AvailabilityCheck> {
    const params = new URLSearchParams({
      checkInDate,
      checkOutDate,
      numberOfRooms: numberOfRooms.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/bookings/check-availability?${params}`);

    const result = await parseJsonResponse<{ data: AvailabilityCheck; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to check availability'));
    }

    return expectJsonResponse(result).data;
  },

  async getBooking(bookingId: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);

    const result = await parseJsonResponse<{ data: Booking; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Booking not found'));
    }

    return expectJsonResponse(result).data;
  },

  async getUserBookings(userId: string, email?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    const url = params.toString()
      ? `${API_BASE_URL}/bookings/user/${encodeURIComponent(userId)}?${params.toString()}`
      : `${API_BASE_URL}/bookings/user/${encodeURIComponent(userId)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseJsonResponse<{ data: Booking[]; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to fetch user bookings'));
    }

    return expectJsonResponse(result).data;
  },

  async cancelUserBooking(userId: string, bookingId: string, email?: string): Promise<void> {
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    const url = params.toString()
      ? `${API_BASE_URL}/bookings/user/${encodeURIComponent(userId)}/bookings/${encodeURIComponent(bookingId)}/cancel?${params.toString()}`
      : `${API_BASE_URL}/bookings/user/${encodeURIComponent(userId)}/bookings/${encodeURIComponent(bookingId)}/cancel`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const result = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(getResponseMessage(response, result, 'Failed to cancel booking'));
    }
  },

  async rescheduleUserBooking(
    userId: string,
    bookingId: string,
    checkInDate: string,
    checkOutDate: string,
    email?: string
  ): Promise<Booking> {
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    const url = params.toString()
      ? `${API_BASE_URL}/bookings/user/${encodeURIComponent(userId)}/bookings/${encodeURIComponent(bookingId)}/reschedule?${params.toString()}`
      : `${API_BASE_URL}/bookings/user/${encodeURIComponent(userId)}/bookings/${encodeURIComponent(bookingId)}/reschedule`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ checkInDate, checkOutDate }),
    });

    const result = await parseJsonResponse<{ data: Booking; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to reschedule booking'));
    }

    return expectJsonResponse(result).data;
  },

  async getUserProfile(userId: string, email?: string): Promise<{ id: string; name?: string; phone?: string; email?: string }>
  {
    const params = new URLSearchParams();
    if (email) params.set('email', email);
    const url = params.toString()
      ? `${API_BASE_URL}/users/${encodeURIComponent(userId)}?${params.toString()}`
      : `${API_BASE_URL}/users/${encodeURIComponent(userId)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const result = await parseJsonResponse<{ data: { id: string; name?: string; phone?: string; email?: string }; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to fetch profile'));
    }

    return expectJsonResponse(result).data;
  },

  async updateUserProfile(
    userId: string,
    profile: { name?: string; phone?: string; email?: string }
  ): Promise<{ id: string; name?: string; phone?: string; email?: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(userId)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profile),
    });

    const result = await parseJsonResponse<{ data: { id: string; name?: string; phone?: string; email?: string }; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to update profile'));
    }

    return expectJsonResponse(result).data;
  },

  async changeUserPassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(userId)}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const result = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(getResponseMessage(response, result, 'Failed to update password'));
    }
  },

  async uploadPaymentProof(bookingId: string, file: File): Promise<Booking> {
    const formData = new FormData();
    formData.append('paymentProof', file);

    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/payment-proof`, {
      method: 'POST',
      body: formData,
    });

    const result = await parseJsonResponse<{ data: Booking; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to upload payment proof'));
    }

    return expectJsonResponse(result).data;
  },

  // Rooms
  async getRooms(): Promise<Room[]> {
    const response = await fetch(`${API_BASE_URL}/rooms`);

    const result = await parseJsonResponse<{ data: Room[]; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to fetch rooms'));
    }

    return expectJsonResponse(result).data;
  },

  // Content
  async getContent(section: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/content/${section}`);

    const result = await parseJsonResponse<{ data: any; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to fetch content'));
    }

    return expectJsonResponse(result).data;
  },

  // Admin Auth
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const result = await parseJsonResponse<{ token: string; user: any; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Login failed'));
    }

    return expectJsonResponse(result);
  },

  async verifyToken(): Promise<any> {
    const token = localStorage.getItem('admin_token');
    
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await parseJsonResponse(response);

    if (!response.ok) {
      const error: any = new Error(getResponseMessage(response, result, 'Token verification failed'));
      error.status = response.status;
      error.statusText = response.statusText;
      throw error;
    }

    return expectJsonResponse(result);
  },
};

// Admin API Functions
export const adminApi = {
  getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  },

  async getAllBookings(params?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }): Promise<{ data: Booking[]; count: number }> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(
      `${API_BASE_URL}/admin/bookings?${queryParams}`,
      {
        headers: getAuthHeaders(),
      }
    );

    const result = await parseJsonResponse<{ data: Booking[]; count: number; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to fetch bookings'));
    }

    return expectJsonResponse(result);
  },

  async getBooking(id: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
      headers: getAuthHeaders(),
    });

    const result = await parseJsonResponse<{ data: Booking; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to fetch booking'));
    }

    return expectJsonResponse(result).data;
  },

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    const result = await parseJsonResponse<{ data: Booking; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to update booking status'));
    }

    return expectJsonResponse(result).data;
  },

  async updatePaymentStatus(id: string, paymentStatus: string): Promise<Booking> {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}/payment`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ paymentStatus }),
    });

    const result = await parseJsonResponse<{ data: Booking; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to update payment status'));
    }

    return expectJsonResponse(result).data;
  },

  async deleteBooking(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/bookings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const result = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(getResponseMessage(response, result, 'Failed to delete booking'));
    }
  },

  async exportBookings(format: 'excel' | 'pdf'): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/admin/bookings/export?format=${format}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to export bookings');
    }

    return await response.blob();
  },

  // Rooms
  async getAllRooms(): Promise<Room[]> {
    const response = await fetch(`${API_BASE_URL}/admin/rooms`, {
      headers: getAuthHeaders(),
    });

    const result = await parseJsonResponse<{ data: Room[]; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to fetch rooms'));
    }

    return expectJsonResponse(result).data;
  },

  async createRoom(data: Partial<Room>): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/admin/rooms`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await parseJsonResponse<{ data: Room; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to create room'));
    }

    return expectJsonResponse(result).data;
  },

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/admin/rooms/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await parseJsonResponse<{ data: Room; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to update room'));
    }

    return expectJsonResponse(result).data;
  },

  async deleteRoom(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/rooms/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const result = await parseJsonResponse<{ message?: string }>(response);
      throw new Error(getResponseMessage(response, result, 'Failed to delete room'));
    }
  },

  async uploadRoomImages(id: string, files: File[]): Promise<Room> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/rooms/${id}/images`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await parseJsonResponse<{ data: Room; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to upload images'));
    }

    return expectJsonResponse(result).data;
  },

  async toggleRoomAvailability(id: string): Promise<Room> {
    const response = await fetch(`${API_BASE_URL}/admin/rooms/${id}/availability`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });

    const result = await parseJsonResponse<{ data: Room; message?: string }>(response);

    if (!response.ok) {
      throw new Error(getResponseMessage(response, result, 'Failed to toggle availability'));
    }

    return expectJsonResponse(result).data;
  },
};
