import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Users, Wifi, Wind, Bed, Table, DoorOpen, Droplets, Bell, Tv, Refrigerator, Bath, Utensils } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';
import AnimatedButton from '../ui/AnimatedButton';
import RoomDetailsModal from '../ui/RoomDetailsModal';
import { api, Room as DBRoom } from '@/lib/api';
import room2Image from '@/images/Room 2.png';
import room1Image from '@/images/Room 1.png';
import room3Image from '@/images/Room3.png';

const featureIcons: { [key: string]: React.ReactNode } = {
  'WiFi': <Wifi size={20} />,
  'Wi-Fi': <Wifi size={20} />,
  'AC': <Wind size={20} />,
  'Air Conditioning': <Wind size={20} />,
  'Bed': <Bed size={20} />,
  'Table': <Table size={20} />,
  'Balcony': <DoorOpen size={20} />,
  'Water': <Droplets size={20} />,
  'Service': <Bell size={20} />,
  'TV': <Tv size={20} />,
  'Fridge': <Refrigerator size={20} />,
  'Bathroom': <Bath size={20} />,
  'Dining': <Utensils size={20} />,
  'Hall': <Users size={20} />,
};

const getIconForFeature = (featureName: string) => {
  const lowercaseFeature = featureName.toLowerCase();
  for (const [key, icon] of Object.entries(featureIcons)) {
    if (lowercaseFeature.includes(key.toLowerCase())) {
      return icon;
    }
  }
  return <Bell size={20} />;
};

const roomImages = [room2Image, room1Image, room3Image];

interface DisplayRoom extends DBRoom {
  image?: string;
  features: { name: string; icon: React.ReactNode }[];
}

const Rooms = () => {
  const [rooms, setRooms] = useState<DisplayRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<DisplayRoom | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const dbRooms = await api.getRooms();
      const formattedRooms = dbRooms.map((room, index) => ({
        ...room,
        name: room.roomType,
        capacity: room.maxOccupancy,
        image: roomImages[index % roomImages.length],
        features: (room.features || []).map((feature) => ({
          name: feature,
          icon: getIconForFeature(feature),
        })),
      }));
      setRooms(formattedRooms);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      // Fallback to static rooms if API fails
      const staticRooms = [
        {
          id: '1',
          roomType: 'Premium Room',
          name: 'Premium Room',
          description: 'Spacious premium room with stunning jungle views and enhanced comforts. (4 units available).',
          pricePerPerson: 3500,
          maxOccupancy: 2,
          capacity: 2,
          image: roomImages[0],
          features: [
            { name: 'Air Conditioning (AC)', icon: <Wind size={20} /> },
            { name: 'TV', icon: <Wifi size={20} /> },
            { name: 'Fridge', icon: <Droplets size={20} /> },
            { name: 'Personal Bathroom', icon: <DoorOpen size={20} /> },
            { name: 'Personal Balcony', icon: <DoorOpen size={20} /> },
            { name: 'Dining with snacks', icon: <Table size={20} /> },
          ],
          isAvailable: true,
        },
        {
          id: '2',
          roomType: 'Deluxe Room',
          name: 'Deluxe Room',
          description: 'Comfortable air-conditioned deluxe room perfect for couples seeking romance and tranquility. (8 units available).',
          pricePerPerson: 2500,
          maxOccupancy: 2,
          capacity: 2,
          image: roomImages[1],
          features: [
            { name: 'Air Conditioning (AC)', icon: <Wind size={20} /> },
            { name: 'Free High-Speed Wi-Fi', icon: <Wifi size={20} /> },
            { name: 'Comfortable Bed', icon: <Bed size={20} /> },
          ],
          isAvailable: true,
        },
        {
          id: '3',
          roomType: 'Hall Room',
          name: 'Hall Room',
          description: 'Large Hall Room perfect for group stays, meetings, or family gatherings. (1 unit available).',
          pricePerPerson: 5500,
          maxOccupancy: 10,
          capacity: 10,
          image: roomImages[0], // Reuse first image
          features: [
            { name: 'Air Conditioning (AC)', icon: <Wind size={20} /> },
            { name: 'TV', icon: <Wifi size={20} /> },
            { name: 'Fridge', icon: <Droplets size={20} /> },
            { name: 'Personal Bathroom', icon: <DoorOpen size={20} /> },
            { name: 'Personal Balcony', icon: <DoorOpen size={20} /> },
            { name: 'Group table dining with snacks', icon: <Table size={20} /> },
            { name: 'Spacious Hall', icon: <DoorOpen size={20} /> },
          ],
          isAvailable: true,
        },
      ] as unknown as DisplayRoom[];
      setRooms(staticRooms);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section id="rooms" className="relative py-24 overflow-hidden scroll-mt-32">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-jade-bright/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader
            subtitle="Accommodations"
            title="Luxurious Rooms & Suites"
            description="Each room is thoughtfully designed to provide comfort, elegance, and a connection to nature's beauty."
          />
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin">
                <div className="w-12 h-12 border-4 border-jade-bright border-t-transparent rounded-full"></div>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {rooms.map((room, index) => (
                <GlassCard key={room._id || room.id} delay={index * 0.1} className="p-0 overflow-hidden group">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 glass-card px-3 py-1.5">
                      <span className="text-jade-bright font-semibold">NPR {room.pricePerPerson.toLocaleString()}</span>
                      <span className="text-muted-foreground text-sm">/person</span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-jade-bright" />
                      <span className="text-sm text-muted-foreground">{room.capacity} Guests</span>
                    </div>
                    
                    <h3 className="font-display text-2xl text-pale-white mb-2">{room.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{room.description}</p>
                    
                    {/* Features */}
                    <div className="flex flex-col gap-2 mb-6">
                      {room.features.slice(0, 4).map((feature, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1.5 text-sm text-pale-white/80"
                        >
                          {feature.icon}
                          {feature.name}
                        </span>
                      ))}
                    </div>
                    
                    <AnimatedButton 
                      variant="ghost" 
                      className="w-full justify-center py-3"
                      onClick={() => setSelectedRoom(room)}
                    >
                      View Details
                    </AnimatedButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedRoom && (
          <RoomDetailsModal room={selectedRoom as any} onClose={() => setSelectedRoom(null)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Rooms;
