import Room from '../models/Room.js';
import Content from '../models/Content.js';
import Admin from '../models/Admin.js';

const ROOMS = [
  {
    roomType: 'Deluxe Room',
    pricePerPerson: 2000,
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
    description: 'Spacious room with stunning jungle views, perfect for couples seeking romance and tranquility.',
    isAvailable: true,
  },
  {
    roomType: 'Deluxe Room',
    pricePerPerson: 2000,
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
    description: 'Spacious room with stunning jungle views, perfect for couples seeking romance and tranquility.',
    isAvailable: true,
  },
  {
    roomType: 'Deluxe Room',
    pricePerPerson: 2000,
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
    description: 'Spacious room with stunning jungle views, perfect for couples seeking romance and tranquility.',
    isAvailable: true,
  },
];

const CONTENT_SECTIONS = [
  {
    section: 'home',
    title: 'Hotel Grill Durbar',
    subtitle: 'Experience Tranquility in the Heart of Chitwan',
    description: 'Escape to nature\'s embrace at Hotel Grill Durbar, where modern comfort meets wilderness adventure.',
  },
  {
    section: 'facilities',
    title: 'Our Facilities',
    subtitle: 'Everything you need for a comfortable stay',
    description: 'We offer a range of modern amenities to make your stay memorable.',
  },
  {
    section: 'contact',
    title: 'Get in Touch',
    address: 'Sauraha, Chitwan, Nepal',
    phone: '+977 9845098450',
    email: 'info@grilldurbar.com',
    hours: 'Open 24/7',
  },
];

export const initializeDatabase = async () => {
  try {
    // Initialize rooms
    const existingRooms = await Room.countDocuments();
    if (existingRooms === 0) {
      console.log('📝 Initializing rooms...');
      await Room.insertMany(ROOMS);
      console.log(`✅ Created ${ROOMS.length} rooms`);
    } else {
      console.log(`ℹ️ Rooms already exist (${existingRooms} found)`);
    }

    // Initialize content
    for (const sectionContent of CONTENT_SECTIONS) {
      const existing = await Content.findOne({ sectionName: sectionContent.section });
      if (!existing) {
        await Content.create({
          sectionName: sectionContent.section,
          content: {
            title: sectionContent.title,
            subtitle: (sectionContent as any).subtitle,
            description: sectionContent.description,
            address: (sectionContent as any).address,
            phone: (sectionContent as any).phone,
            email: (sectionContent as any).email,
            hours: (sectionContent as any).hours,
          },
          images: [],
        });
        console.log(`✅ Created ${sectionContent.section} content`);
      }
    }

    // Initialize admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@grilldurbar.com').toLowerCase();
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (!existingAdmin) {
      await Admin.create({
        username: process.env.ADMIN_USERNAME || 'admin',
        email: adminEmail,
        role: 'admin',
        password: process.env.ADMIN_PASSWORD || 'admin123',
      });
      console.log('✅ Created default admin');
    }

    console.log('✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    // Don't throw - allow server to start even if initialization fails
  }
};
