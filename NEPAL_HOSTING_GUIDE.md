# Complete .com.np Hosting Guide for Hotel Grill Durbar

## Phase 1: Domain Registration (1-3 days)

### Step 1.1: Choose Registrar
**Recommended**: Mercantile Communications or WebSurfer

### Step 1.2: Required Documents
- [ ] Citizenship copy
- [ ] Company registration (if business)
- [ ] PAN/VAT certificate (for business)

### Step 1.3: Register Domain
1. Visit: https://www.mos.com.np or https://websurfer.com.np
2. Search: `hotelgrilldurbar.com.np` (or your preferred name)
3. Fill application form
4. Upload documents
5. Pay NPR 1,000-2,000
6. Wait 2-3 business days for approval

---

## Phase 2: Prepare Application

### Step 2.1: Setup MongoDB Atlas (Free)
```powershell
# Already done in DEPLOYMENT.md
# Make sure you have your connection string
```

### Step 2.2: Create Production Environment Variables

Create `server/.env.production`:
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://hotelgrilldurbar.com.np

# MongoDB Atlas (from your setup)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hotel-grill-durbar?retryWrites=true&w=majority

# JWT Secret (generate random string)
JWT_SECRET=your_super_secret_random_string_here_make_it_long

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongPassword123!
ADMIN_EMAIL=admin@hotelgrilldurbar.com.np

# Email (Gmail SMTP - Free)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-hotel-email@gmail.com
EMAIL_PASS=your_app_specific_password

# WhatsApp (Optional - Twilio)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
ADMIN_WHATSAPP_NUMBER=whatsapp:+9779XXXXXXXXX
```

### Step 2.3: Update Frontend API URL

Edit `src/lib/api.ts`:
```typescript
const API_URL = import.meta.env.PROD 
  ? 'https://api.hotelgrilldurbar.com.np' 
  : 'http://localhost:5000';
```

---

## Phase 3: Deploy to Railway (Recommended for Nepal)

### Step 3.1: Install Railway CLI
```powershell
npm install -g @railway/cli
```

### Step 3.2: Deploy Backend

```powershell
# Navigate to server
cd "c:\Users\acer\Downloads\Hotel Grill Durbar main\Hotel Grill Durbar\server"

# Login to Railway
railway login

# Create new project
railway init

# Link to project
railway link

# Add environment variables
railway variables set NODE_ENV=production
railway variables set MONGODB_URI="your_mongodb_connection_string"
railway variables set JWT_SECRET="your_jwt_secret"
railway variables set FRONTEND_URL="https://hotelgrilldurbar.com.np"

# Deploy
railway up

# Get deployment URL
railway domain
```

### Step 3.3: Deploy Frontend

**Option A: Railway**
```powershell
# Go to root directory
cd ..

# Initialize Railway project
railway init

# Build frontend
npm run build

# Deploy
railway up
```

**Option B: Vercel (Easier for frontend)**
```powershell
npm install -g vercel

# Build
npm run build

# Deploy
vercel --prod

# Add environment variable
vercel env add VITE_API_URL production
# Enter: https://api.hotelgrilldurbar.com.np
```

---

## Phase 4: Connect Domain

### Step 4.1: Get Hosting IPs/URLs

**Railway Backend:**
1. Go to https://railway.app/dashboard
2. Click your backend project
3. Go to Settings → Domains
4. Click "Generate Domain" (e.g., `hotel-backend-production.railway.app`)
5. Note this URL

**Railway/Vercel Frontend:**
1. Same process for frontend project
2. Note the deployment URL

### Step 4.2: Add Custom Domain in Railway/Vercel

**For Backend (Railway):**
1. Settings → Domains → "Custom Domain"
2. Enter: `api.hotelgrilldurbar.com.np`
3. Copy the CNAME/A record values shown

**For Frontend:**
1. Settings → Domains → "Add Domain"
2. Enter: `hotelgrilldurbar.com.np` and `www.hotelgrilldurbar.com.np`
3. Copy DNS records

### Step 4.3: Update DNS Records

Login to your domain registrar (Mercantile/WebSurfer) dashboard:

**Add these DNS records:**

```
Type    Name    Value                                   TTL
A       @       76.76.21.21 (Railway IP)               3600
A       www     76.76.21.21                            3600
CNAME   api     hotel-backend-production.railway.app   3600
```

*Note: Replace with actual IPs provided by Railway/Vercel*

### Step 4.4: Wait for DNS Propagation
- Takes 1-24 hours
- Check status: https://dnschecker.org

---

## Phase 5: SSL Certificate (Free)

### Railway automatically provides SSL
- SSL certificates are auto-generated
- Your site will be `https://hotelgrilldurbar.com.np`

---

## Phase 6: Test Deployment

### Step 6.1: Test Backend
```powershell
curl https://api.hotelgrilldurbar.com.np/health
```

### Step 6.2: Test Frontend
1. Visit: https://hotelgrilldurbar.com.np
2. Try booking a room
3. Login to admin panel: https://hotelgrilldurbar.com.np/admin

### Step 6.3: Seed Production Database
```powershell
# SSH to Railway backend or run locally pointing to production
railway run npm run seed
```

---

## Cost Summary

### One-Time Costs:
- Domain (.com.np): NPR 1,000-2,000/year
- Documents/Paperwork: NPR 0-500

### Monthly Costs:
- **Railway Free Tier**: NPR 0 (500 hours/month)
- **Railway Paid**: NPR 650/month ($5) for unlimited
- **MongoDB Atlas Free**: NPR 0 (512MB)
- **Vercel Free**: NPR 0

**Total to Start**: NPR 1,000-2,000 (just domain!)

---

## Alternative Hosting Options for Nepal

### Option 1: Nepal-Based Hosting
**AGM Web Hosting** (https://www.agm.com.np)
- Shared hosting: NPR 2,000-5,000/year
- VPS: NPR 15,000-30,000/year
- Pros: Local support, faster for Nepal users
- Cons: Need to setup Node.js yourself

### Option 2: DigitalOcean + CloudFlare
**DigitalOcean Droplet**:
- Basic: $6/month (~NPR 800/month)
- Setup: SSH, install Node.js, MongoDB, Nginx
- Pros: Full control
- Cons: Manual setup required

**Steps**:
```bash
# SSH to droplet
ssh root@your_droplet_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install MongoDB (or use Atlas)
# Install Nginx as reverse proxy
# Setup PM2 for process management
# Configure SSL with Let's Encrypt
```

---

## Troubleshooting

### Issue: Domain not resolving
- Wait 24 hours for DNS propagation
- Check DNS: `nslookup hotelgrilldurbar.com.np`
- Verify DNS records in registrar panel

### Issue: SSL certificate error
- Railway: Auto-renews, wait 5 minutes
- Check domain is properly connected

### Issue: Backend can't connect to frontend
- Check FRONTEND_URL in Railway variables
- Update CORS settings in backend

### Issue: Database connection fails
- Verify MongoDB Atlas IP whitelist: 0.0.0.0/0
- Check connection string in Railway variables
- Ensure password doesn't have special characters (or URL encode them)

---

## Quick Command Reference

```powershell
# Deploy backend
cd server
railway up

# Deploy frontend
cd ..
npm run build
vercel --prod

# Check logs
railway logs

# Update environment variables
railway variables set KEY=value

# Restart service
railway restart
```

---

## Support Contacts

**Domain Issues**:
- Mercantile: 01-5970172
- WebSurfer: 01-5970044

**Hosting Support**:
- Railway: https://railway.app/help
- Vercel: https://vercel.com/support

**Technical Help**:
- Your developer or freelancer platforms in Nepal

---

## Next Steps After Deployment

1. **Setup Google Analytics**
2. **Configure backup strategy**
3. **Setup monitoring (UptimeRobot - free)**
4. **Test booking flow end-to-end**
5. **Train staff on admin panel**
6. **Add payment gateway (eSewa/Khalti for Nepal)**

---

**Estimated Total Time**: 3-5 days (including domain approval)

**Monthly Cost**: NPR 0-2,000 (can start completely free!)
