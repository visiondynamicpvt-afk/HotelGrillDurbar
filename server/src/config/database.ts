import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DBNAME;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Set it in server/.env.');
  }

  if (mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(mongoUri, {
    dbName,
  });

  console.log('✅ MongoDB connected successfully');
  console.log(`📊 Database: ${mongoose.connection.name}`);
  console.log('🔐 Authentication: MongoDB + JWT');
  console.log('🖼️ Media Storage: Cloudinary');
};

export default connectDB;
