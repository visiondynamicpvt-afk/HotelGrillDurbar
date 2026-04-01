# Admin Panel - Room & Content Management Guide

## Access Admin Panel

1. **Login Page**: `http://localhost:8080/admin/login` or `http://localhost:8080/admin`
2. **Credentials** (from seed):
   - Username: `admin`
   - Password: `admin123`

---

## Room Management

### URL: `/admin/dashboard/rooms`

### Features:

#### **View All Rooms**
- Display all rooms in a grid format
- Shows room type, price per person, and features
- View availability status

#### **Create New Room**
1. Click **"+ Add Room"** button
2. Fill form:
   - **Room Type**: e.g., "Deluxe Double", "Single"
   - **Price Per Person**: NPR amount (e.g., 2000)
   - **Max Occupancy**: Number of guests (e.g., 2)
   - **Description**: Room details
   - **Features**: Comma-separated (AC, WiFi, TV, Hot Water, Attached Bathroom)
3. Click **"Create"**

#### **Edit Room**
1. Click **"Edit"** on any room card
2. Update form fields
3. Click **"Update"**

#### **Delete Room**
1. Click trash icon on any room card
2. Confirm deletion

#### **Toggle Availability**
- Click eye icon to enable/disable room visibility
- Green eye = Available
- Red eye = Disabled

### Example Room Data:
```
Room Type: Deluxe Double
Price Per Person: 2500
Max Occupancy: 2
Description: Spacious room with king bed, modern amenities
Features: AC, WiFi, TV, Hot Water, Attached Bathroom, Mountain View
```

---

## Content Management

### URL: `/admin/dashboard/content`

### Features:

#### **Available Sections** (Tabs):
1. **Homepage** - Main page content
2. **About Us** - Hotel information
3. **Facilities** - Hotel amenities
4. **Restaurant** - Dining information
5. **Contact** - Contact details

#### **Edit Section Content**

1. Click on section tab (e.g., "Homepage")
2. Fill text fields:
   - **Title**: Main heading
   - **Description/Subtitle**: Section description
   - **History**: (For About Us)
   - **Menu**: (For Restaurant)
   - **Address**: (For Contact)
   - **Phone**: (For Contact)
   - **Email**: (For Contact)
   - **Hours**: (For Contact)

#### **Upload Images**
1. Click **"Upload Image"** button
2. Select image file (PNG, JPG, GIF)
3. Image preview appears
4. Click **X** to remove image if needed
5. Upload multiple images per section

#### **Save Changes**
1. Make text/image changes
2. Click **"Save Changes"** button
3. Toast notification confirms save
4. Changes appear on live website

### Example Content:

**Homepage:**
```
Title: Welcome to Hotel Grill Durbar
Subtitle: Experience Luxury in Paradise
Description: Nestled in the heart of Sauraha, Hotel Grill Durbar offers world-class hospitality...
```

**About Us:**
```
Title: Our Story
Description: Hotel Grill Durbar has been serving guests since 2020...
History: Founded with a vision to provide the best hospitality experience...
```

**Facilities:**
```
Title: World-Class Facilities
Description: Enjoy premium amenities and services...
```

**Restaurant:**
```
Title: Grill Durbar Restaurant
Description: Authentic Nepali and international cuisine...
Menu: See our menu for traditional and modern dishes...
```

**Contact:**
```
Address: Sauraha, Chitwan, Nepal
Phone: +977 056-580123
Email: info@grilldurbar.com
Hours: 6 AM - 10 PM Daily
```

---

## Live Updates

All changes made in admin panel appear immediately on:
- Public website
- Booking page
- Room listings
- Contact information

---

## Working Endpoints

### Rooms API:
```
GET    /api/admin/rooms           - Get all rooms
POST   /api/admin/rooms           - Create room
PUT    /api/admin/rooms/:id       - Update room
DELETE /api/admin/rooms/:id       - Delete room
PATCH  /api/admin/rooms/:id       - Toggle availability
```

### Content API:
```
GET    /api/admin/content/:section      - Get section content
PUT    /api/admin/content/:section      - Update section
POST   /api/admin/content/upload-image  - Upload image
```

---

## Troubleshooting

### Room not showing on website?
- Check if room `isAvailable` is `true`
- Verify price and occupancy are set correctly

### Images not uploading?
- Check file format (PNG, JPG, GIF)
- Verify file size < 5MB
- Check token authentication

### Content not saving?
- Ensure all required fields are filled
- Check browser console for errors
- Verify admin authentication

### Changes not appearing on website?
- Hard refresh browser (Ctrl+F5)
- Clear browser cache
- Check if content API endpoint is working

---

## Tips & Best Practices

1. **Always save content before switching tabs**
2. **Use clear, descriptive room type names**
3. **Add high-quality images**
4. **Keep descriptions concise but informative**
5. **Update content regularly for best results**
6. **Test changes on live website after saving**

---

## Quick Links

- Admin Login: `http://localhost:8080/admin/login`
- Dashboard: `http://localhost:8080/admin/dashboard`
- Rooms: `http://localhost:8080/admin/dashboard/rooms`
- Content: `http://localhost:8080/admin/dashboard/content`
- Website: `http://localhost:8080/`
