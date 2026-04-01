# Admin Panel - Quick Reference Card

## Login
- **URL**: `http://localhost:8080/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

---

## Main Features

### 1️⃣ Rooms Management
**URL**: `/admin/dashboard/rooms`

**What it controls**: Hotel room listings on booking page and website

**Actions**:
- ✅ Create new rooms
- ✅ Edit room details
- ✅ Delete rooms
- ✅ Toggle availability (on/off)
- ✅ Set pricing and capacity

**Room Fields**:
- Room Type (e.g., "Deluxe Double Room")
- Price Per Person (NPR)
- Max Occupancy (number of guests)
- Description
- Features (comma-separated: AC, WiFi, TV, etc.)

---

### 2️⃣ Content Management
**URL**: `/admin/dashboard/content`

**What it controls**: All text and images on main website

**5 Sections** (click tabs):

| Tab | Controls | Where it shows |
|-----|----------|-----------------|
| **Homepage** | Main title, subtitle, intro text | Home page hero section |
| **About Us** | Hotel story and history | About page |
| **Facilities** | Amenities descriptions | Facilities section |
| **Restaurant** | Restaurant info and menu | Restaurant section |
| **Contact** | Address, phone, email, hours | Contact section & footer |

**Features**:
- ✅ Edit text in each section
- ✅ Upload multiple images
- ✅ Remove images (click X)
- ✅ Save changes instantly

---

## How Changes Work

```
You make changes in Admin Panel
              ↓
Data saved to Database
              ↓
Website automatically updates
              ↓
Users see new content
```

**No restart needed!**
**Changes are LIVE immediately after saving**

---

## Sample Data to Create

### Create These 3 Rooms:

**Room 1:**
- Type: Deluxe Double Room
- Price: 2500/person
- Occupancy: 2
- Features: AC, WiFi, Bed, Balcony, Hot Water, Room Service

**Room 2:**
- Type: Deluxe Twin Room
- Price: 2200/person
- Occupancy: 2
- Features: AC, WiFi, Twin Beds, Desk, Balcony, Hot Water, Room Service

**Room 3:**
- Type: Standard Room
- Price: 1500/person
- Occupancy: 2
- Features: AC, WiFi, Bed, Bathroom, Hot Water, Room Service

### Update These Content Sections:

**Homepage:**
```
Title: Welcome to Hotel Grill Durbar
Subtitle: Experience Luxury in Paradise
Description: Nestled in Sauraha, enjoy world-class hospitality...
```

**Contact:**
```
Address: Sauraha, Chitwan, Nepal
Phone: +977 56-580123
Email: info@grilldurbar.com
Hours: 6 AM - 10 PM Daily
```

---

## Workflow Tips

### ✅ To Create a Room:
1. Go to Rooms Management
2. Click **"+ Add Room"** button
3. Fill in the form
4. Click **"Create"**
5. Room appears in list

### ✅ To Edit Content:
1. Go to Content Management
2. Click the tab (e.g., "Homepage")
3. Edit text fields
4. (Optional) Upload images
5. Click **"Save Changes"**
6. Check website - it's updated!

### ✅ To Upload Images:
1. In any content section
2. Click **"Upload Image"**
3. Select file (PNG/JPG)
4. Image preview appears
5. Done! (auto-saves with section)

---

## How Admin Links to Website

### Rooms You Create → Booking Page
```
Admin creates "Deluxe Double Room"
                    ↓
User goes to booking page
                    ↓
Sees "Deluxe Double Room" in dropdown
                    ↓
Can select & book it
```

### Content You Edit → Website Sections
```
You edit "Homepage" content
                    ↓
User visits http://localhost:8080/
                    ↓
Sees your new title & description
                    ↓
Sees your uploaded images
```

### Facilities You Update → Website Display
```
You update "Facilities" section
                    ↓
Add "Swimming Pool" feature
                    ↓
Upload pool photo
                    ↓
User sees new facility on website
```

---

## Common Tasks

| Task | Steps |
|------|-------|
| **Add a new room** | Rooms → + Add Room → Fill form → Create |
| **Change room price** | Rooms → Edit room → Update price → Update |
| **Disable a room** | Rooms → Click eye icon (becomes red) |
| **Update welcome message** | Content → Homepage tab → Edit title → Save |
| **Update contact number** | Content → Contact tab → Edit phone → Save |
| **Add facility photo** | Content → Facilities tab → Upload Image |
| **Delete a room** | Rooms → Click trash icon → Confirm |

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Changes not showing | Hard refresh (Ctrl+F5) or clear cache |
| Can't save content | Check all fields filled, reload page, try again |
| Images not uploading | Check file type (PNG/JPG), size < 5MB |
| Room not in booking | Check room `isAvailable` (green eye icon) |
| Page very slow | Clear browser cache, restart server |

---

## Important Notes

⚠️ **Always Save Before Leaving**
- If you edit content, click "Save Changes"
- If you edit room, click "Update" or "Create"
- Unsaved changes are lost!

✅ **Changes are Instant**
- No need to restart server
- Website updates automatically
- Users see changes immediately

📱 **Mobile-Responsive**
- All changes appear on mobile too
- Test on different devices

---

## Quick Links

| Page | URL |
|------|-----|
| Admin Login | `http://localhost:8080/admin/login` |
| Admin Dashboard | `http://localhost:8080/admin/dashboard` |
| Rooms Manager | `http://localhost:8080/admin/dashboard/rooms` |
| Content Manager | `http://localhost:8080/admin/dashboard/content` |
| Website Home | `http://localhost:8080/` |
| Booking Page | `http://localhost:8080/book` |

---

## Contact Info to Update

Replace with actual hotel details:
- **Address**: Sauraha, Chitwan District, Nepal
- **Phone**: +977 56-580123
- **Email**: info@grilldurbar.com
- **Hours**: 6:00 AM - 10:00 PM Daily

---

**Admin Panel is fully functional and ready to use!** 🚀
