# Setup Guide - Hotel Grill Durbar

## Complete Setup Instructions

### Step 1: Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd server
npm install
```

### Step 2: Configure Environment Variables

#### Backend (.env in server folder)
Copy the example and fill in your values:
```bash
cd server
# Create .env file with the following variables (see server/.env.example)
```

Required variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A random secret string for JWT tokens
- `ADMIN_USERNAME` - Admin login username (default: admin)
- `ADMIN_PASSWORD` - Admin login password (default: admin123)
- `EMAIL_USER` & `EMAIL_PASS` - For email notifications (optional)
- `TWILIO_ACCOUNT_SID` & `TWILIO_AUTH_TOKEN` - For WhatsApp (optional)

#### Frontend (.env in root folder)
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Setup MongoDB

**Option A: Local MongoDB**
1. Install MongoDB locally
2. Start MongoDB service
3. Use: `mongodb://localhost:27017/hotel-grill-durbar`

**Option B: MongoDB Atlas (Recommended)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### Step 4: Seed Database

```bash
cd server
npm run seed
```

This creates:
- Default admin user
- Sample rooms

### Step 5: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on: http://localhost:8080

### Step 6: Access the Application

- **Website**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin/login
  - Username: `admin`
  - Password: `admin123`

## Testing the System

### 1. Test Booking Flow
1. Go to http://localhost:8080
2. Click "Book Now" or navigate to `/book`
3. Fill in booking form
4. Submit booking
5. You'll receive a booking ID
6. Upload payment proof
7. Check admin panel for new booking

### 2. Test Admin Panel
1. Login at `/admin/login`
2. View dashboard statistics
3. Go to Bookings - see all bookings
4. Approve/reject bookings
5. Go to Rooms - manage rooms
6. Export bookings to Excel/PDF

## Production Deployment

### Backend (Railway/Render/DigitalOcean)
1. Set all environment variables
2. Deploy server code
3. Ensure MongoDB connection works
4. Create `uploads` directory
5. Run `npm run seed` to create admin

### Frontend (Vercel/Netlify)
1. Set `VITE_API_URL` to production API
2. Build: `npm run build`
3. Deploy `dist` folder

### Database
- Use MongoDB Atlas
- Whitelist your server IP
- Use connection string in environment variables

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running (local) or connection string (Atlas)
- Verify network access for Atlas
- Check credentials

### Port Already in Use
- Change `PORT` in backend `.env`
- Update `VITE_API_URL` in frontend `.env`

### Admin Login Not Working
- Run `npm run seed` again
- Check admin credentials in `.env`
- Verify JWT_SECRET is set

### File Upload Not Working
- Ensure `uploads` directory exists in server folder
- Check file permissions
- Verify MAX_FILE_SIZE in `.env`

## Next Steps After Setup

1. **Change Admin Password**: Login and change default password
2. **Configure Email**: Set up SMTP for email notifications
3. **Configure WhatsApp**: Set up Twilio for WhatsApp notifications
4. **Add Rooms**: Use admin panel to add/edit rooms
5. **Test Booking**: Create a test booking end-to-end
6. **Customize Content**: Update hotel information and content

## Support

For issues:
- Check server logs for errors
- Verify all environment variables are set
- Ensure MongoDB is accessible
- Check file permissions for uploads
