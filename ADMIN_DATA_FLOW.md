# Admin Panel Data Flow - Visual Guide

## 🔄 Complete Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HOTEL GRILL DURBAR                       │
│                   Admin Panel Data Flow                      │
└─────────────────────────────────────────────────────────────┘

                    ADMIN PANEL (You)
                          ↓
        ┌─────────────────────────────────┐
        │   Rooms Management              │
        │   - Create/Edit/Delete rooms    │
        │   - Set pricing                 │
        │   - Manage availability         │
        └─────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────┐
        │   Content Management            │
        │   - Edit website text           │
        │   - Upload facility images      │
        │   - Update contact info         │
        │   - Manage all 5 sections       │
        └─────────────────────────────────┘
                          ↓
                    MongoDB Database
                 (All data stored here)
                          ↓
        ┌─────────────────────────────────┐
        │   Express.js Backend API        │
        │   - Serves room data            │
        │   - Serves content data         │
        │   - Handles bookings            │
        └─────────────────────────────────┘
                          ↓
                    WEBSITE (Visitors See)
        ┌─────────────────────────────────┐
        │   Main Page (Index.tsx)         │
        │                                 │
        │   ┌─ Hero Section               │
        │   ├─ Rooms Section              │ ← Uses rooms from admin
        │   ├─ Facilities Section         │ ← Uses content from admin
        │   ├─ Gallery Section            │ ← Uses images from admin
        │   └─ Contact Section            │ ← Uses contact from admin
        │                                 │
        │   Booking Page                  │
        │   ├─ Room dropdown              │ ← Lists admin rooms
        │   └─ Booking form               │
        │                                 │
        │   User Profile Page             │
        │   └─ Their bookings             │
        └─────────────────────────────────┘
```

---

## 🏠 ROOMS - Data Flow

### Step 1: Create Room in Admin
```
Admin Panel
    ↓
[Rooms Management]
    ├─ Room Type: "Deluxe Double"
    ├─ Price: 2500 NPR/person
    ├─ Occupancy: 2 guests
    └─ Features: AC, WiFi, etc.
    ↓
Click "Create"
```

### Step 2: Save to Database
```
MongoDB Database
    ↓
rooms collection
    ├─ _id: ObjectId
    ├─ roomType: "Deluxe Double"
    ├─ pricePerPerson: 2500
    ├─ maxOccupancy: 2
    ├─ features: ["AC", "WiFi", ...]
    └─ isAvailable: true
```

### Step 3: Display on Website
```
When user visits booking page:

GET /api/rooms
    ↓
Backend fetches all rooms from MongoDB
    ↓
Returns room data as JSON
    ↓
React renders room list
    ↓
User sees: "Deluxe Double - 2500 NPR/person"
    ↓
User can select & book the room
```

### Full Room Flow Diagram
```
┌──────────────────────┐
│   Create/Edit Room   │
│   in Admin Panel     │
└──────────┬───────────┘
           │
           ↓
    ┌──────────────────────────────────┐
    │  Room Data Saved to MongoDB      │
    │  • roomType: "Deluxe Double"     │
    │  • pricePerPerson: 2500          │
    │  • maxOccupancy: 2               │
    │  • features: [...]               │
    │  • isAvailable: true             │
    └──────────┬───────────────────────┘
               │
               ↓
    ┌──────────────────────────────────┐
    │  API Endpoint                    │
    │  GET /api/rooms                  │
    │  Returns all rooms               │
    └──────────┬───────────────────────┘
               │
               ↓
    ┌──────────────────────────────────┐
    │  Booking Page (user sees)        │
    │  Room Dropdown:                  │
    │  • Deluxe Double - 2500 NPR      │
    │  • Deluxe Twin - 2200 NPR        │
    │  • Standard - 1500 NPR           │
    └──────────┬───────────────────────┘
               │
               ↓
    ┌──────────────────────────────────┐
    │  User Books Room                 │
    │  POST /api/bookings              │
    │  Creates booking record          │
    └──────────────────────────────────┘
```

---

## 📝 CONTENT - Data Flow

### Step 1: Edit Content in Admin
```
Admin Panel
    ↓
[Content Management]
    ├─ Select Tab (e.g., "Homepage")
    ├─ Edit Title: "Welcome to Hotel Grill Durbar"
    ├─ Edit Subtitle: "Experience Luxury"
    ├─ Edit Description: "Nestled in Sauraha..."
    └─ Upload Images (optional)
    ↓
Click "Save Changes"
```

### Step 2: Save to Database
```
MongoDB Database
    ↓
content collection
    ├─ sectionName: "home"
    ├─ content:
    │   ├─ title: "Welcome to Hotel Grill Durbar"
    │   ├─ subtitle: "Experience Luxury"
    │   └─ description: "Nestled in Sauraha..."
    └─ images: ["url1", "url2", ...]
```

### Step 3: Display on Website (INSTANT!)
```
When user visits website:

GET /api/admin/content/home
    ↓
Backend fetches homepage content from MongoDB
    ↓
Returns content as JSON
    ↓
React renders Hero section with:
    ├─ Your title
    ├─ Your subtitle
    ├─ Your description
    └─ Your images
    ↓
User sees updated homepage
```

### Full Content Flow Diagram
```
┌──────────────────────┐
│  Edit Homepage Text  │
│  in Admin Panel      │
│  - Change title      │
│  - Change subtitle   │
│  - Add images        │
└──────────┬───────────┘
           │
           ↓
    ┌──────────────────────────────────┐
    │  Content Data Saved to MongoDB   │
    │  • sectionName: "home"           │
    │  • content: {...}                │
    │  • images: [...]                 │
    └──────────┬───────────────────────┘
               │
               ↓
    ┌──────────────────────────────────┐
    │  API Endpoint                    │
    │  GET /api/admin/content/home     │
    │  Returns homepage content        │
    └──────────┬───────────────────────┘
               │
               ↓
    ┌──────────────────────────────────┐
    │  Website Homepage (user sees)    │
    │                                  │
    │  ┌──────────────────────────────┐│
    │  │ Welcome to Hotel Grill       ││
    │  │ Durbar                       ││
    │  └──────────────────────────────┘│
    │  ┌──────────────────────────────┐│
    │  │ Experience Luxury            ││
    │  └──────────────────────────────┘│
    │  ┌──────────────────────────────┐│
    │  │ Nestled in Sauraha...        ││
    │  └──────────────────────────────┘│
    │  ┌──────────────────────────────┐│
    │  │  [Your Images Display]       ││
    │  └──────────────────────────────┘│
    └──────────────────────────────────┘
```

---

## 🎯 All 5 Content Sections

```
┌─────────────────────────────────────────────────────────┐
│            Admin Content Management (5 Tabs)            │
└────────┬──────────┬─────────┬──────────┬────────────────┘
         │          │         │          │
         ↓          ↓         ↓          ↓
    ┌─────────┐ ┌──────┐ ┌──────────┐ ┌──────────┐
    │Homepage │ │About │ │Facilities│ │Restaurant│
    └────┬────┘ └──┬───┘ └────┬─────┘ └────┬─────┘
         │         │          │           │
         ↓         ↓          ↓           ↓
    Website    Website    Website    Website
    Hero Text  Company    Amenities  Dining Info
              Story      & Descriptions
    
         ↓
    ┌──────────────┐
    │   Contact    │
    │ (5th Tab)    │
    └──────┬───────┘
           │
           ↓
    Website Footer
    & Contact Page
```

---

## ⚡ Real-Time Update Example

### Timeline: Updating Contact Info

**12:00 PM - Admin Action**
```
Admin goes to Content → Contact tab
Sees: Phone: "+977 56-580123"
Changes to: "+977 56-999999"
Clicks: "Save Changes"
```

**12:00:01 PM - Database Update**
```
MongoDB receives update
contact collection updated immediately
```

**12:00:02 PM - User Sees Change**
```
User refreshes website
Sees new phone number: "+977 56-999999"
```

**Total Time**: < 2 seconds! ⚡

---

## 🔗 Content ↔ Website Mapping

```
Admin Content Section  →  Website Display
───────────────────────────────────────
Homepage          →  Hero section heading
About Us          →  About page / Company info
Facilities        →  Facilities section cards
Restaurant        →  Restaurant section text
Contact           →  Footer + Contact section
```

---

## 📊 Database Schema

### Rooms Collection
```json
{
  "_id": ObjectId,
  "roomType": "Deluxe Double",
  "pricePerPerson": 2500,
  "maxOccupancy": 2,
  "description": "Spacious room...",
  "features": ["AC", "WiFi", "Bed"],
  "isAvailable": true,
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

### Content Collection
```json
{
  "_id": ObjectId,
  "sectionName": "home",
  "content": {
    "title": "Welcome to Hotel Grill Durbar",
    "subtitle": "Experience Luxury",
    "description": "Nestled in Sauraha..."
  },
  "images": [
    "/uploads/images/home-1.jpg",
    "/uploads/images/home-2.jpg"
  ],
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

---

## 🌐 How Website Fetches Data

### On Page Load
```
1. User visits http://localhost:8080/
   ↓
2. React loads (Index.tsx)
   ↓
3. Sections mount:
   ├─ Hero
   ├─ Rooms (fetches from GET /api/rooms)
   ├─ Facilities (fetches from GET /api/admin/content/facilities)
   ├─ Gallery
   └─ Contact (fetches from GET /api/admin/content/contact)
   ↓
4. All data loaded from MongoDB via API
   ↓
5. Page renders with admin data
   ↓
6. User sees complete website
```

---

## ✅ Verification

### To verify data flow is working:

**1. Create a room in admin:**
```
✅ Go to /admin/dashboard/rooms
✅ Create new room
✅ Go to /book
✅ Room appears in dropdown
```

**2. Update content in admin:**
```
✅ Go to /admin/dashboard/content
✅ Edit Homepage title
✅ Click "Save Changes"
✅ Go to / (home page)
✅ Refresh browser (Ctrl+F5)
✅ See new title
```

**3. Upload image in admin:**
```
✅ Go to /admin/dashboard/content
✅ Select a section
✅ Click "Upload Image"
✅ Select image file
✅ Click "Save Changes"
✅ Go to website
✅ Refresh page
✅ See image displayed
```

---

## 🎓 Summary

The admin panel creates/manages data that flows to the website:

```
You Create Data in Admin
        ↓
Data stored in MongoDB
        ↓
Website fetches from MongoDB via API
        ↓
Displays to users
        ↓
Users see your content!
```

**No manual uploads needed.**
**No file editing needed.**
**Just use the admin panel!**

---

**Everything is connected and working!** ✅
