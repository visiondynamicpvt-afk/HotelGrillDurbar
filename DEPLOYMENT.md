# Deployment Guide - Hotel Grill Durbar

## Step 1: MongoDB Atlas Setup (Free Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click **"Try Free"**
3. Sign up with email or Google
4. Verify email

### 1.2 Create a Cluster
1. After login, click **"Create a Database"**
2. Choose **"Free"** tier (M0 - perfect for starting)
3. Select **"AWS"** region (closest to you)
4. Click **"Create"** → Wait 2-3 minutes

### 1.3 Create Database User (Credentials)
1. Left sidebar → **"Database Access"**
2. Click **"+ Add New Database User"**
3. Set:
   - **Username**: `hoteluser` (or any name)
   - **Password**: Create strong password (copy it!)
   - **Database User Privileges**: Select "Atlas Admin"
4. Click **"Add User"**

### 1.4 Get Connection String
1. Left sidebar → **"Database"** → Click **"Connect"**
2. Click **"Drivers"**
3. Select **"Node.js"** and version **"3.0 or later"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://hoteluser:PASSWORD@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```

### 1.5 Allow Your IP (for local dev)
1. Left sidebar → **"Network Access"**
2. Click **"+ Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0) for testing
   - ⚠️ For production: whitelist only your Railway IP
4. Click **"Confirm"**

---

## Step 2: Local Setup (Development)

### 2.1 Create Backend Environment File
1. Open `server/` folder
2. Create file: `server/.env`
3. Paste this (replace YOUR_PASSWORD and CONNECTION_STRING):

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080

# MongoDB Atlas
MONGODB_URI=mongodb+srv://hoteluser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/hotel-grill-durbar?retryWrites=true&w=majority

# Admin Credentials (for seeding)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@grilldurbar.com

# Email (optional - skip for now)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=

# Twilio WhatsApp (optional - skip for now)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=
ADMIN_WHATSAPP_NUMBER=
```

### 2.2 Install Backend & Test Connection
```powershell
cd "c:\Users\acer\Downloads\Hotel Grill Durbar\Hotel Grill Durbar\server"
npm install
npm run dev
```

✅ You should see:
```
🚀 Server running on port 5000
📝 Environment: development
✅ MongoDB Connected Successfully
```

### 2.3 Seed Default Data
```powershell
# In server/ directory
npm run seed
```

✅ Output:
```
✅ Default admin created: admin
✅ Created 3 default rooms
✅ Database seeding completed
```

---

## Step 3: Frontend Setup

### 3.1 Create Frontend Environment File
1. Open root folder (not server/)
2. Create file: `.env.local`
3. Paste:
```env
VITE_API_URL=/api
```
(This uses the Vite proxy for local dev; will change for production)

### 3.2 Start Frontend
```powershell
cd "c:\Users\acer\Downloads\Hotel Grill Durbar\Hotel Grill Durbar"
npm install
npm run dev
```

✅ Open http://localhost:8080

### 3.3 Test Availability Check
1. Go to **"Rooms"** section
2. Fill booking form with:
   - Check-in: 2026-01-26
   - Check-out: 2026-01-30
   - Rooms: 1
3. Click **"Check Availability"**

✅ Should see **"3 rooms available"**

---

## Step 4: Production Deployment (Railway + Vercel)

### 4.1 Prepare GitHub Repo
```powershell
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - Hotel Grill Durbar"
git branch -M main

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR_USERNAME/hotel-grill-durbar.git
git push -u origin main
```

### 4.2 Deploy Backend (Railway.app)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"+ New Project"** → **"Deploy from GitHub"**
4. Select your `hotel-grill-durbar` repo
5. Select `server` as root directory
6. Railway auto-detects Node.js
7. Add Environment Variables:
   - Click **"Variables"**
   - Add:
     ```
     MONGODB_URI=mongodb+srv://hoteluser:PASSWORD@cluster0.xxxxx.mongodb.net/hotel-grill-durbar?retryWrites=true&w=majority
     FRONTEND_URL=https://your-domain.com
     PORT=5000
     NODE_ENV=production
     ```
8. Click **"Deploy"** → Wait 2-3 minutes

✅ You'll get a URL like: `https://hotel-api-production.railway.app`

### 4.3 Deploy Frontend (Vercel)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click **"Import Project"** → Select your repo
4. Settings:
   - **Framework**: Vite
   - **Root Directory**: `./` (root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://hotel-api-production.railway.app/api
   ```
6. Click **"Deploy"** → Wait 2 minutes

✅ You'll get: `https://hotel-grill-durbar.vercel.app`

### 4.4 Connect Custom Domain (.com)

**Option A: .com at registrar**

1. Buy domain at GoDaddy/Namecheap (e.g., `grilldurbar.com`)

2. **Point frontend to Vercel:**
   - Vercel dashboard → Settings → Domains
   - Add `grilldurbar.com`
   - Copy Vercel's nameservers
   - Go to registrar → change nameservers to Vercel's

3. **Point API to Railway (optional):**
   - Railway dashboard → Settings → Domain
   - Add `api.grilldurbar.com`
   - Add CNAME to your registrar: `api.grilldurbar.com → CNAME → api.railway.app`

4. Update Vercel environment:
   ```
   VITE_API_URL=https://api.grilldurbar.com/api
   ```

---

## Step 5: Test Production

1. Open https://grilldurbar.com (or your domain)
2. Test booking form → "Check Availability"
3. Check admin panel: https://grilldurbar.com/admin
   - Login: `admin` / `admin123`
4. Health check: https://api.grilldurbar.com/api/health

---

## Troubleshooting

### MongoDB Connection Fails
- Check `.env` has correct password (special chars need URL encoding)
- Verify IP whitelist in MongoDB Atlas (Network Access)
- Test connection string: https://www.mongodb.com/docs/manual/reference/connection-string/

### Frontend can't reach API
- Check `VITE_API_URL` env var in Vercel
- In dev: ensure backend runs on `http://localhost:5000`
- Vercel proxy should work in dev (vite.config.ts)

### Booking form shows 500 error
- Check Railway logs: Railway dashboard → Deployments → Logs
- Likely: MongoDB connection or missing env vars
- Re-seed if needed: Run `npm run seed` in Railway terminal

---

## Next Steps

1. ✅ Set up MongoDB Atlas (this guide)
2. ✅ Local dev (backend + frontend running)
3. ✅ Deploy to Railway (backend) + Vercel (frontend)
4. ✅ Connect custom domain
5. **Optional**: 
   - Set up email notifications (update `.env`)
   - WhatsApp alerts via Twilio
   - Custom styling/branding
   - Admin dashboard enhancements

---

**Questions?** Check MongoDB docs: https://docs.mongodb.com
