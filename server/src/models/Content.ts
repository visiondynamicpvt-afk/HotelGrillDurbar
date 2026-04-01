import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  sectionName: string;
  content: Record<string, any>;
  images: string[];
  updatedAt: Date;
}

const ContentSchema: Schema = new Schema(
  {
    sectionName: {
      type: String,
      required: [true, 'Section name is required'],
      unique: true,
      trim: true,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContent>('Content', ContentSchema);
