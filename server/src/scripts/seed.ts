import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import Admin from '../models/Admin.js';
import Room from '../models/Room.js';
import Content from '../models/Content.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Create default admin
    const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'admin' });
    
    if (!adminExists) {
      const admin = await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
        email: process.env.ADMIN_EMAIL || 'admin@grilldurbar.com',
        role: 'admin',
      });
      console.log('✅ Default admin created:', admin.username);
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // Clear existing rooms to update the setup
    await Room.deleteMany({});
    
    const rooms = await Room.insertMany([
        {
          roomType: 'Premium Room',
          pricePerPerson: 3500,
          features: [
            'Air Conditioning (AC)',
            'TV',
            'Fridge',
            'Personal Balcony',
            'Personal Bathroom',
            'Dining with snacks',
            'Free High-Speed Wi-Fi',
            'King Size Bed',
            'Hot & Cold Water',
            'Room Service',
          ],
          maxOccupancy: 2,
          description: 'Spacious premium room with stunning jungle views and enhanced comforts. (4 units available).',
          isAvailable: true,
          images: [],
        },
        {
          roomType: 'Deluxe Room',
          pricePerPerson: 2500,
          features: [
            'Air Conditioning (AC)',
            'Free High-Speed Wi-Fi',
            'Comfortable Bed',
            'Table & Seating Area',
            'Separate Balcony',
            'Hot & Cold Water',
            'Room Service',
          ],
          maxOccupancy: 2,
          description: 'Comfortable air-conditioned deluxe room perfect for couples seeking romance and tranquility. (8 units available).',
          isAvailable: true,
          images: [],
        },
        {
          roomType: 'Hall Room',
          pricePerPerson: 5500,
          features: [
            'Air Conditioning (AC)',
            'TV',
            'Personal Bathroom',
            'Balcony',
            'Group table dining with snacks',
            'Spacious Hall',
            'Free High-Speed Wi-Fi',
            'Projector Support',
            'Hot & Cold Water',
            'Room Service',
          ],
          maxOccupancy: 10,
          description: 'Large Hall Room perfect for group stays, meetings, or family gatherings. (1 unit available).',
          isAvailable: true,
          images: [],
        },
      ]);

      console.log(`✅ Created ${rooms.length} default rooms`);

    // Create default content sections if none exist
    const contentCount = await Content.countDocuments();
    
    if (contentCount === 0) {
      const contentSections = await Content.insertMany([
        {
          sectionName: 'home',
          content: {
            title: 'Hotel Grill Durbar',
            subtitle: 'Experience Paradise in Chitwan',
            description: 'Discover luxury accommodation and fine dining in the heart of nature',
          },
          images: [],
        },
        {
          sectionName: 'about',
          content: {
            title: 'About Hotel Grill Durbar',
            description: 'Welcome to Hotel Grill Durbar, your ultimate destination for luxury and adventure.',
            history: 'Established as a premier hospitality destination in Chitwan, we combine modern comfort with natural beauty.',
          },
          images: [],
        },
        {
          sectionName: 'facilities',
          content: {
            title: 'Our Facilities',
            description: 'Experience world-class amenities and services',
            facilities: [
              { title: 'Grill Restaurant', description: 'Signature grilled dishes and authentic Nepali cuisine' },
              { title: 'Bar & Lounge', description: 'Premium spirits and cocktails' },
              { title: 'Safari Tours', description: 'Guided jungle safaris' },
              { title: 'Cultural Shows', description: 'Traditional performances' },
              { title: 'Garden Retreat', description: 'Lush tropical gardens' },
              { title: 'Free Parking', description: 'Secure parking with 24/7 surveillance' },
              { title: 'High-Speed WiFi', description: 'Complimentary internet' },
              { title: 'Room Service', description: '24-hour room service' },
              { title: 'Laundry Service', description: 'Professional laundry services' },
            ],
          },
          images: [],
        },
        {
          sectionName: 'restaurant',
          content: {
            title: 'Our Restaurant',
            description: 'Experience culinary excellence with our expert chefs',
            menu: 'Available upon request',
          },
          images: [],
        },
        {
          sectionName: 'contact',
          content: {
            address: 'Sauraha, Chitwan, Nepal',
            phone: '056-494295, 9811236030',
            email: 'hotelgrilldurbar@gmail.com',
            hours: '24/7 Available for reservations',
          },
          images: [],
        },
      ]);

      console.log(`✅ Created ${contentSections.length} default content sections`);
    } else {
      console.log('ℹ️ Content sections already exist');
    }

    console.log('✅ Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
