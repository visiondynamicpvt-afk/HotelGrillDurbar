import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  bookingId: string;
  guestName: string;
  phoneNumber: string;
  email?: string;
  userId?: string;
  checkInDate: Date;
  checkOutDate: Date;
  numberOfGuests: number;
  numberOfRooms: number;
  specialRequests?: string;
  bookingStatus: 'Pending' | 'Payment Submitted' | 'Approved' | 'Rejected' | 'Cancelled';
  paymentStatus: 'Pending' | 'Submitted' | 'Verified' | 'Failed';
  paymentProof?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const generateBookingId = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `HGD${timestamp}${random}`;
};

const BookingSchema: Schema = new Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: generateBookingId,
    },
    guestName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    userId: {
      type: String,
      trim: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
      validate: {
        validator: function (this: IBooking, value: Date) {
          return value > this.checkInDate;
        },
        message: 'Check-out date must be after check-in date',
      },
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: [1, 'Number of guests must be at least 1'],
    },
    numberOfRooms: {
      type: Number,
      required: [true, 'Number of rooms is required'],
      min: [1, 'Number of rooms must be at least 1'],
      max: [8, 'Maximum 8 rooms available'],
    },
    specialRequests: {
      type: String,
      trim: true,
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Payment Submitted', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Submitted', 'Verified', 'Failed'],
      default: 'Pending',
    },
    paymentProof: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure bookingId exists before save
BookingSchema.pre('save', async function (next) {
  if (!this.bookingId) {
    this.bookingId = generateBookingId();
  }
  next();
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
