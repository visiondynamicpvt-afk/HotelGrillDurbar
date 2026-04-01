# Hotel Grill Durbar - Complete Booking System

A full-stack hotel booking website for Hotel Grill Durbar in Sauraha, Chitwan, Nepal.

## Features

### Frontend
- ✅ Modern React + TypeScript + Tailwind CSS UI
- ✅ Responsive design
- ✅ Booking form with validation
- ✅ Booking status tracking
- ✅ FonePay QR code integration
- ✅ Payment proof upload

### Backend
- ✅ Node.js + Express.js API
- ✅ MongoDB database with Mongoose
- ✅ JWT authentication
- ✅ File upload (Multer)
- ✅ Email notifications (Nodemailer)
- ✅ WhatsApp notifications (Twilio)
- ✅ Booking management
- ✅ Room management
- ✅ Admin panel

## Technology Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- React Hook Form + Zod validation
- TanStack Query

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT authentication
- Multer (file uploads)
- Nodemailer (emails)
- Twilio (WhatsApp)
- ExcelJS & PDFKit (exports)

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- npm or yarn

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Environment Configuration

Create `server/.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/hotel-grill-durbar

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Admin Default Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@grilldurbar.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Hotel Grill Durbar <noreply@grilldurbar.com>

# WhatsApp Configuration (Callmebot API)
CALLMEBOT_API_KEY=your-callmebot-api-key
ADMIN_WHATSAPP_NUMBER=977XXXXXXXXXX
# Note: Phone number should be in international format without + sign
# Example: 9779841234567 (for Nepal number +977-9841234567)

# FonePay Configuration
FONEPAY_MERCHANT_ID=your-merchant-id
FONEPAY_SECRET_KEY=your-secret-key

# Frontend URL
FRONTEND_URL=http://localhost:8080
```

Create `.env` file in root for frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Seed Database

```bash
cd server
npm run seed
```

This will create:
- Default admin user (username: admin, password: admin123)
- Sample rooms

### 5. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## Project Structure

```
├── server/                 # Backend
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, upload, error handling
│   │   ├── models/        # MongoDB schemas
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utilities (notifications, etc.)
│   │   └── server.ts      # Main server file
│   └── uploads/           # Uploaded files
│
├── src/                   # Frontend
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── lib/              # Utilities & API client
│   └── App.tsx           # Main app component
```

## API Endpoints

### Public Endpoints
- `POST /api/bookings/create` - Create booking
- `GET /api/bookings/check-availability` - Check room availability
- `GET /api/bookings/:bookingId` - Get booking details
- `POST /api/bookings/upload-payment` - Upload payment proof
- `GET /api/rooms` - Get available rooms

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `GET /api/admin/bookings` - Get all bookings
- `PUT /api/admin/bookings/:id/status` - Update booking status
- `PUT /api/admin/bookings/:id/payment` - Update payment status
- `GET /api/admin/bookings/export` - Export bookings
- `GET /api/admin/rooms` - Get all rooms
- `POST /api/admin/rooms` - Create room
- `PUT /api/admin/rooms/:id` - Update room
- `DELETE /api/admin/rooms/:id` - Delete room

## Admin Panel

Access admin panel at: http://localhost:8080/admin/login

Default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Change default password after first login!**

## Features Overview

### Booking Flow
1. User fills booking form
2. System checks room availability
3. Booking created with unique ID
4. QR code generated for payment
5. User uploads payment proof
6. Admin receives notification
7. Admin verifies and approves booking
8. Guest receives confirmation

### Admin Panel Features
- Dashboard with statistics
- Booking management (view, approve, reject)
- Room management (create, edit, delete)
- Export bookings to Excel/PDF
- Payment verification
- Content management

## Deployment

### Backend Deployment (Railway/Render/DigitalOcean)
1. Set environment variables
2. Deploy server code
3. Ensure MongoDB connection
4. Create uploads directory

### Frontend Deployment (Vercel/Netlify)
1. Set `VITE_API_URL` to production API URL
2. Build: `npm run build`
3. Deploy `dist` folder

### Database
- Use MongoDB Atlas for production
- Update `MONGODB_URI` in environment variables

## Security Notes

- Change JWT_SECRET in production
- Use strong admin password
- Enable HTTPS
- Configure CORS properly
- Set up rate limiting
- Validate all inputs
- Use environment variables for secrets

## Support

For issues or questions, contact:
- Email: info@grilldurbar.com
- Phone: +977 056-580123

## License

Private - Hotel Grill Durbar
