# Admin Panel - Room & Content Sync Guide

## Overview

The admin panel manages all content that appears on the main website:

```
Main Website (Index.tsx)
    ↓
    ├── Hero Section (Banner)
    ├── Rooms Section (from admin Rooms Management)
    ├── Facilities Section (from admin Content Management)
    ├── Gallery Section (from admin Content Management)
    ├── Contact Section (from admin Content Management)
    └── Footer

Admin Panel
    ├── Rooms Management (CRUD for hotel rooms)
    └── Content Management (Edit website sections)
```

---

## Room Management Setup

### Main Website Rooms Display
**File**: `src/components/sections/Rooms.tsx`
- Shows 3 room cards
- Each card displays: Image, Name, Price/person, Capacity, Features
- Links to "Book Now" button

### Admin Panel Rooms
**URL**: `/admin/dashboard/rooms`

### How it Works:
1. Admin creates/edits rooms in admin panel
2. Data is stored in MongoDB
3. When user visits main page → rooms are fetched from database
4. Display updates automatically

### Required Room Data:

```json
{
  "roomType": "Deluxe Double Room",
  "pricePerPerson": 2500,
  "maxOccupancy": 2,
  "description": "Spacious room with stunning jungle views",
  "features": [
    "Air Conditioning (AC)",
    "Free High-Speed Wi-Fi",
    "Comfortable Bed",
    "Hot & Cold Water"
  ],
  "isAvailable": true
}
```

### Sample Rooms to Create:

**Room 1: Deluxe Double**
```
Room Type: Deluxe Double Room
Price: 2500 NPR/person
Occupancy: 2 guests
Description: Spacious room with stunning jungle views, perfect for couples
Features: AC, WiFi, Bed, Table & Seating, Balcony, Hot Water, Room Service
```

**Room 2: Deluxe Twin**
```
Room Type: Deluxe Twin Room
Price: 2200 NPR/person
Occupancy: 2 guests
Description: Twin bed room with garden views and modern amenities
Features: AC, WiFi, Twin Beds, Work Desk, Balcony, Hot Water, Room Service
```

**Room 3: Standard Room**
```
Room Type: Standard Room
Price: 1500 NPR/person
Occupancy: 1-2 guests
Description: Cozy room ideal for budget-conscious travelers
Features: AC, WiFi, Comfortable Bed, Bathroom, Hot Water, Room Service
```

---

## Content Management Setup

### Main Website Content Sections
**File**: `src/pages/Index.tsx`

Displays:
1. **Hero** - Main banner (static)
2. **Rooms** - From admin Rooms Management
3. **Facilities** - From admin Content (Facilities section)
4. **Gallery** - From admin Content (images)
5. **Contact** - From admin Content (Contact section)
6. **Footer** - From admin Content (Contact section)

### Admin Panel Content
**URL**: `/admin/dashboard/content`

**5 Tabs** (all sync to live website):

#### 1. **Homepage**
Updates the main landing page text.

**Fields:**
- **Title**: Main heading (e.g., "Welcome to Hotel Grill Durbar")
- **Subtitle**: Sub-heading (e.g., "Experience Luxury in Paradise")
- **Description**: Long description text

**Example:**
```
Title: Welcome to Hotel Grill Durbar
Subtitle: Experience Luxury in Paradise
Description: Nestled in the heart of Sauraha, Hotel Grill Durbar offers world-class hospitality combined with authentic Nepali culture. Enjoy luxury accommodations, fine dining, and unforgettable jungle safari experiences in the beauty of Chitwan National Park.
```

---

#### 2. **About Us**
Tells the hotel's story and history.

**Fields:**
- **Title**: Section heading (e.g., "Our Story")
- **Description**: Current information about hotel
- **History**: Background and founding story

**Example:**
```
Title: Our Story

Description: Hotel Grill Durbar is a premier hospitality destination in Sauraha, Chitwan. We pride ourselves on offering exceptional service, luxury accommodations, and authentic cultural experiences to guests from around the world.

History: Founded in 2020, Hotel Grill Durbar was established with a vision to provide world-class hospitality in the heart of nature. We have grown from a small property to one of Sauraha's most sought-after destinations, consistently delivering memorable experiences to our guests.
```

---

#### 3. **Facilities**
Describes all hotel amenities and services.

**Fields:**
- **Title**: Section heading (e.g., "World-Class Facilities")
- **Description**: Brief overview of amenities

**Facilities Listed on Main Page:**
- Grill Restaurant
- Bar & Lounge
- Safari Tours
- Cultural Shows
- Garden Retreat
- Free Parking
- High-Speed WiFi
- Room Service
- Laundry Service

**Example:**
```
Title: World-Class Facilities & Amenities

Description: Our hotel features state-of-the-art facilities designed to ensure your comfort and convenience. From our signature grill restaurant to thrilling safari tours, we offer everything you need for an unforgettable stay.
```

**Optional: Upload facility images** (displayed in facilities section)

---

#### 4. **Restaurant**
Describes dining options and cuisine.

**Fields:**
- **Title**: Restaurant name (e.g., "Grill Durbar Restaurant")
- **Description**: Overview of restaurant
- **Menu**: Descriptions of dishes/cuisine

**Example:**
```
Title: Grill Durbar Restaurant

Description: Our signature restaurant is renowned for authentic Nepali cuisine and international dishes. Expert chefs prepare every meal with fresh ingredients and traditional cooking methods.

Menu: 
- Grilled specialties (Momo, Sekuwa, BBQ)
- Nepali curries and dal
- International cuisine
- Fresh salads and appetizers
- Desserts and beverages
```

---

#### 5. **Contact**
Important contact information and hours.

**Fields:**
- **Address**: Full address
- **Phone**: Contact numbers
- **Email**: Hotel email
- **Hours**: Operating hours

**Example:**
```
Address: Sauraha, Chitwan District, Nepal

Phone: +977 56-580123
       +977 98-XXXXXXXX

Email: info@grilldurbar.com

Hours: Open Daily 6:00 AM - 10:00 PM
       Reservations: Available 24/7
```

---

## Image Management

### Upload Images
Each content section (except Contact) can have images:

1. Click **"Upload Image"** in content section
2. Select image file (PNG, JPG, GIF - max 5MB)
3. Image preview appears
4. Click **X** to remove if needed
5. Multiple images supported
6. Click **"Save Changes"** to finalize

### Image Guidelines:
- **Format**: PNG, JPG, GIF
- **Size**: < 5MB
- **Dimensions**: 
  - Facilities: Square (500x500px recommended)
  - Hotel: Landscape (1200x600px recommended)
- **Quality**: High resolution for better display

---

## Live Sync Workflow

### Step-by-Step:

1. **Create/Edit Content in Admin Panel**
   - Go to `/admin/dashboard/content`
   - Select section (Homepage, About, etc.)
   - Edit text fields
   - Upload images (optional)
   - Click **"Save Changes"**

2. **Changes Apply Immediately**
   - Website updates in real-time
   - No republish needed
   - Cache cleared automatically

3. **View on Main Website**
   - Go to `http://localhost:8080/`
   - Scroll to relevant section
   - See your changes live

### Test Workflow:
```
1. Edit Homepage title → Save → Refresh home page → See new title ✓
2. Add Room → Save → Refresh booking page → Room shows in list ✓
3. Update Contact info → Save → Refresh → New number shows ✓
```

---

## Troubleshooting

### Content not saving?
1. Check browser console for errors
2. Verify all required fields are filled
3. Check admin token is valid
4. Try refreshing and saving again

### Changes not appearing on website?
1. Hard refresh browser (Ctrl+F5 on Windows, Cmd+Shift+R on Mac)
2. Clear browser cache
3. Check if content was actually saved
4. Verify API endpoint is working

### Images not uploading?
1. Check file format (must be PNG, JPG, GIF)
2. Check file size (must be < 5MB)
3. Try refreshing page and uploading again
4. Check browser console for network errors

### Rooms not showing on booking page?
1. Verify room `isAvailable` is enabled (green eye icon)
2. Check room has correct pricing and occupancy
3. Hard refresh booking page
4. Check MongoDB has room data

---

## API Endpoints (Reference)

### Rooms API
```
GET    /api/rooms              - Get all available rooms
GET    /api/admin/rooms        - Get all rooms (admin)
POST   /api/admin/rooms        - Create room (admin)
PUT    /api/admin/rooms/:id    - Update room (admin)
DELETE /api/admin/rooms/:id    - Delete room (admin)
PATCH  /api/admin/rooms/:id    - Toggle availability (admin)
```

### Content API
```
GET    /api/admin/content/:section      - Get section (admin)
PUT    /api/admin/content/:section      - Update section (admin)
POST   /api/admin/content/upload-image  - Upload image (admin)
```

---

## Quick Reference

### Admin Panel URLs
| Feature | URL |
|---------|-----|
| Login | `/admin/login` |
| Dashboard | `/admin/dashboard` |
| Rooms | `/admin/dashboard/rooms` |
| Content | `/admin/dashboard/content` |

### Main Website URLs
| Section | URL |
|---------|-----|
| Home | `/` (shows Hero + Rooms + Facilities + Gallery + Contact) |
| Booking | `/book` (shows rooms from admin) |
| Profile | `/profile` (user bookings) |

### Credentials
- Username: `admin`
- Password: `admin123`

---

## Best Practices

1. **Always save before navigating away** from content sections
2. **Use clear, professional descriptions** for all sections
3. **Upload high-quality images** (screenshots affect user experience)
4. **Keep room prices updated** to reflect current rates
5. **Test changes on main website** after saving
6. **Update contact info regularly** (phone, email, hours)
7. **Use consistent formatting** across all text
8. **Review spelling and grammar** before saving

---

## Examples of Live Sync

### Scenario 1: Update Contact Info
```
1. Admin changes phone: +977 56-580123 → +977 56-999999
2. Clicks "Save Changes"
3. User visits website contact section
4. Sees new phone number immediately
```

### Scenario 2: Add New Room
```
1. Admin creates "Family Suite" room
2. Sets price 3500 NPR/person, capacity 4
3. Clicks "Create"
4. User goes to booking page
5. "Family Suite" appears in room dropdown
6. Can book the new room
```

### Scenario 3: Update Facilities Description
```
1. Admin edits Facilities content
2. Adds new feature: "Swimming Pool"
3. Uploads pool image
4. Clicks "Save Changes"
5. Website displays new facility immediately
```

---

## Support

For issues or questions:
- Check browser console (F12) for errors
- Verify network requests in DevTools
- Check admin authentication is valid
- Review server logs for backend errors
- Contact developer if API not responding
