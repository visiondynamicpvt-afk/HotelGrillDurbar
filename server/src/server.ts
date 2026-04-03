import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import { initializeDatabase } from './utils/initializeDb.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';
import roomRoutes from './routes/rooms.js';
import contentRoutes from './routes/content.js';
import userRoutes from './routes/users.js';
import adminBookingRoutes from './routes/admin/bookings.js';
import adminRoomRoutes from './routes/admin/rooms.js';
import adminContentRoutes from './routes/admin/content.js';

// Load environment variables
dotenv.config();

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : true, // Allow all origins in development
  credentials: true,
}));

// Trust proxy for rate limiter when behind Render/Cloudflare proxy
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running with MongoDB backend',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);

// Admin Routes
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin/rooms', adminRoomRoutes);
app.use('/api/admin/content', adminContentRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🔐 Using MongoDB + JWT for authentication');
  console.log('📊 Using MongoDB for all application data');
  console.log('🖼️ Using Cloudinary for images/videos/files');

  await connectDB();
  
  // Initialize database with default data
  await initializeDatabase();
});

export default app;