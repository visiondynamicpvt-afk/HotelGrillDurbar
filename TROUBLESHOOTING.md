# Troubleshooting Guide

## Login 500 Error

If you're getting a 500 Internal Server Error when trying to login, follow these steps:

### Step 1: Check Backend Server
Make sure your backend server is running:
```bash
cd server
npm run dev
```

You should see:
- `✅ MongoDB Connected Successfully`
- `🚀 Server running on port 5000`

### Step 2: Check MongoDB Connection
Make sure MongoDB is running:

**Local MongoDB:**
- Start MongoDB service
- Check if it's running on `mongodb://localhost:27017`

**MongoDB Atlas:**
- Check your connection string in `server/.env`
- Make sure your IP is whitelisted

### Step 3: Seed the Database
Create the admin user by running:
```bash
cd server
npm run seed
```

This will create:
- Default admin user
- Username: `admin`
- Password: `admin123`

### Step 4: Check Environment Variables
Make sure `server/.env` file exists with:
```env
MONGODB_URI=mongodb://localhost:27017/hotel-grill-durbar
JWT_SECRET=your-secret-key-here
```

### Step 5: Check Backend Logs
Look at the backend terminal for error messages. Common errors:
- `MongoDB Connection Error` - Database not connected
- `Admin not found` - Need to run seed script
- `Password match result: false` - Wrong password

### Step 6: Test Login
After seeding, try logging in with:
- Username: `admin`
- Password: `admin123`

## Common Issues

### "Unexpected end of JSON input"
- Backend returned empty response
- Check backend logs for errors
- Make sure backend is running

### "Token verification failed"
- Token expired or invalid
- Try logging in again
- Check if JWT_SECRET is set

### "Failed to fetch"
- Backend server not running
- Check if backend is on port 5000
- Check network connection

## Quick Fix Commands

```bash
# 1. Start MongoDB (if local)
# Windows: net start MongoDB
# Mac/Linux: sudo systemctl start mongod

# 2. Navigate to server
cd server

# 3. Install dependencies (if needed)
npm install

# 4. Create .env file (if missing)
# Copy from .env.example and fill in values

# 5. Seed database
npm run seed

# 6. Start server
npm run dev
```

## Still Having Issues?

1. Check backend terminal for error messages
2. Verify MongoDB is accessible
3. Make sure all environment variables are set
4. Try restarting both frontend and backend servers
