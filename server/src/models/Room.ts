import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom extends Document {
  roomType: string;
  pricePerPerson: number;
  features: string[];
  images: string[];
  isAvailable: boolean;
  maxOccupancy: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema: Schema = new Schema(
  {
    roomType: {
      type: String,
      required: [true, 'Room type is required'],
      trim: true,
    },
    pricePerPerson: {
      type: Number,
      required: [true, 'Price per person is required'],
      min: [0, 'Price cannot be negative'],
    },
    features: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    maxOccupancy: {
      type: Number,
      required: [true, 'Max occupancy is required'],
      min: [1, 'Max occupancy must be at least 1'],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IRoom>('Room', RoomSchema);
