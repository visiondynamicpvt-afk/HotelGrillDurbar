import { motion } from 'framer-motion';
import { 
  Wifi, Car, UtensilsCrossed, Wine, TreePine, Sparkles,
  Music, Mountain, Shirt, Image
} from 'lucide-react';
import { useState, useEffect } from 'react';
import GlassCard from '../UI/GlassCard';
import SectionHeader from '../UI/SectionHeader';
import { api } from '@/lib/api';
import barImage from '@/images/Bar.png';
import safariImage from '@/images/Safari 2.png';
import grillImage from '@/images/Grill.png';
import culturalImage from '@/images/Tharu dance 2.png';
import gardenImage from '@/images/Garden.png';
import building4Image from '@/images/Building 4.png';
import room1Image from '@/images/Room 1.png';
import room2Image from '@/images/Room 2.png';
import laundryImage from '@/images/Laundry.jpg';
import parkingImage from '@/images/parking.jpeg';
import wifiImage from '@/images/wifi.png';

const defaultFacilities = [
  {
    icon: <UtensilsCrossed size={32} />,
    title: 'Grill Restaurant',
    description: 'Signature grilled dishes and authentic Nepali cuisine prepared by expert chefs.',
    backgroundImage: grillImage,
  },
  {
    icon: <Wine size={32} />,
    title: 'Bar & Lounge',
    description: 'Premium spirits, cocktails, and a curated wine selection in an elegant ambiance.',
    backgroundImage: barImage,
  },
  {
    icon: <Mountain size={32} />,
    title: 'Safari Tours',
    description: 'Guided jungle safaris to witness rhinos, tigers, and exotic wildlife.',
    backgroundImage: safariImage,
  },
  {
    icon: <Music size={32} />,
    title: 'Cultural Shows',
    description: 'Traditional Tharu dance performances and cultural entertainment.',
    backgroundImage: culturalImage,
  },
  {
    icon: <TreePine size={32} />,
    title: 'Garden Retreat',
    description: 'Lush tropical gardens perfect for relaxation and outdoor events.',
    backgroundImage: gardenImage,
  },
  {
    icon: <Car size={32} />,
    title: 'Free Parking',
    description: 'Secure parking space for all guests with 24/7 surveillance.',
    backgroundImage: parkingImage,
  },
  {
    icon: <Wifi size={32} />,
    title: 'High-Speed WiFi',
    description: 'Complimentary high-speed internet throughout the property.',
    backgroundImage: wifiImage,
  },

  {
    icon: <Sparkles size={32} />,
    title: 'Room Service',
    description: '24-hour room service to cater to your every need.',
    backgroundImage: room1Image,
  },
  {
    icon: <Shirt size={32} />,
    title: 'Laundry Service',
    description: 'Professional laundry and dry cleaning services for your convenience.',
    backgroundImage: laundryImage,
  },
];

interface FacilitiesContent {
  title?: string;
  description?: string;
  facilities?: Array<{
    title: string;
    description: string;
  }>;
}

const Facilities = () => {
  const [facilities, setFacilities] = useState(defaultFacilities);
  const [facilitiesContent, setFacilitiesContent] = useState<FacilitiesContent>({});

  useEffect(() => {
    loadFacilitiesContent();
  }, []);

  const loadFacilitiesContent = async () => {
    try {
      const response = await api.getContent('facilities');
      if (response?.content) {
        setFacilitiesContent(response.content);
        // If facilities list is provided in content, use it
        if (response.content.facilities && Array.isArray(response.content.facilities)) {
          const updatedFacilities = response.content.facilities.map((fac, index) => ({
            ...defaultFacilities[index],
            title: fac.title || defaultFacilities[index].title,
            description: fac.description || defaultFacilities[index].description,
          }));
          setFacilities(updatedFacilities);
        }
      }
    } catch (error) {
      console.error('Failed to load facilities content:', error);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section id="facilities" className="relative py-24 overflow-hidden scroll-mt-32">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-charcoal-deep to-charcoal" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial-jade opacity-30" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          subtitle="Amenities"
          title="World-Class Facilities"
          description="Immerse yourself in luxury with our comprehensive range of amenities designed for your comfort and pleasure."
        />
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {facilities.map((facility, index) => (
            <motion.div key={facility.title} variants={item}>
              <GlassCard 
                className={`text-center h-full relative overflow-hidden ${facility.backgroundImage ? 'p-0' : ''}`}
                hover={true}
                delay={0}
              >
                {facility.backgroundImage ? (
                  <>
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      <motion.img
                        src={facility.backgroundImage}
                        alt={facility.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/80 to-charcoal/70" />
                    </div>
                    
                    {/* Content Overlay */}
                    <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-jade-deep/70 backdrop-blur-sm text-jade-bright mb-4 mx-auto"
                      >
                        {facility.icon}
                      </motion.div>
                      <h3 className="font-display text-xl text-pale-white mb-2">{facility.title}</h3>
                      <p className="text-sm text-pale-white/80 leading-relaxed">{facility.description}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-jade-deep/50 text-jade-bright mb-4"
                    >
                      {facility.icon}
                    </motion.div>
                    <h3 className="font-display text-xl text-pale-white mb-2">{facility.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{facility.description}</p>
                  </>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Facilities;
