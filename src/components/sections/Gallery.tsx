import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';

// Import all images
import barImage from '@/images/Bar.png';
import building2Image from '@/images/Building 2.png';
import building3Image from '@/images/Building 3.png';
import building1Image from '@/images/Building1.png';
import building4Image from '@/images/Building 4.png';
import gardenImage from '@/images/Garden.png';
import grillImage from '@/images/Grill.png';
import room1Image from '@/images/Room 1.png';
import room2Image from '@/images/Room 2.png';
import room3Image from '@/images/Room3.png';
import safari1Image from '@/images/Safari 1.png';
import safari2Image from '@/images/Safari 2.png';
import tharuDanceImage from '@/images/Tharu dance 2.png';
import tharuDance2Image from '@/images/Tharu dance 2.png';
import diningImage from '@/images/Dining.png';
import img1Image from '@/images/Img 1.jpeg';
import img2Image from '@/images/Img 2.jpeg';
import img3Image from '@/images/Img 3.jpeg';
import img4Image from '@/images/Img 4.jpeg';
import img5Image from '@/images/Img 5.png';
import lightImage from '@/images/Light  (1).jpg';
import orderImage from '@/images/Order.png';
import order4Image from '@/images/Order 4.png';
import order5Image from '@/images/Order 5.png';

const galleryImages = [
  // Hotel category images
  {
    id: 1,
    src: building1Image,
    alt: 'Hotel Building 1',
    category: 'Hotel',
  },
  {
    id: 2,
    src: building2Image,
    alt: 'Hotel Building 2',
    category: 'Hotel',
  },
  {
    id: 3,
    src: building3Image,
    alt: 'Hotel Building 3',
    category: 'Hotel',
  },
  {
    id: 4,
    src: building4Image,
    alt: 'Hotel Building 4',
    category: 'Hotel',
  },
  {
    id: 5,
    src: barImage,
    alt: 'Bar & Lounge',
    category: 'Hotel',
  },
  {
    id: 6,
    src: room1Image,
    alt: 'Deluxe Room 1',
    category: 'Hotel',
  },
  {
    id: 7,
    src: room2Image,
    alt: 'Deluxe Room 2',
    category: 'Hotel',
  },
  {
    id: 8,
    src: room3Image,
    alt: 'Deluxe Room 3',
    category: 'Hotel',
  },
  {
    id: 9,
    src: tharuDanceImage,
    alt: 'Cultural Dance Performance',
    category: 'Hotel',
  },
  {
    id: 10,
    src: tharuDance2Image,
    alt: 'Cultural Dance Performance 2',
    category: 'Hotel',
  },
  // Safari category images
  {
    id: 11,
    src: safari1Image,
    alt: 'Safari Adventure 1',
    category: 'Safari',
  },
  {
    id: 12,
    src: safari2Image,
    alt: 'Safari Adventure 2',
    category: 'Safari',
  },
  {
    id: 14,
    src: img5Image,
    alt: 'Safari Experience',
    category: 'Safari',
  },
  // Dining category images
  {
    id: 15,
    src: img1Image,
    alt: 'Dining Experience 1',
    category: 'Dining',
  },
  {
    id: 16,
    src: img2Image,
    alt: 'Dining Experience 2',
    category: 'Dining',
  },
  {
    id: 17,
    src: img3Image,
    alt: 'Dining Experience 3',
    category: 'Dining',
  },
  {
    id: 18,
    src: lightImage,
    alt: 'Restaurant Lighting',
    category: 'Dining',
  },
  {
    id: 19,
    src: orderImage,
    alt: 'Food Order',
    category: 'Dining',
  },

  {
    id: 21,
    src: order4Image,
    alt: 'Food Order 4',
    category: 'Dining',
  },
  {
    id: 22,
    src: order5Image,
    alt: 'Food Order 5',
    category: 'Dining',
  },
  {
    id: 23,
    src: diningImage,
    alt: 'Dining Setting',
    category: 'Dining',
  },
  // Additional images for "All" category
  {
    id: 24,
    src: grillImage,
    alt: 'Grill Restaurant',
    category: 'All',
  },
  {
    id: 25,
    src: gardenImage,
    alt: 'Garden Retreat',
    category: 'All',
  },
  {
    id: 26,
    src: img4Image,
    alt: 'Hotel Image 4',
    category: 'All',
  },
];

const categories = ['All', 'Hotel', 'Safari', 'Dining'];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  
  const filteredImages = selectedCategory === 'All' 
    ? galleryImages // Show all images in "All" category
    : galleryImages.filter(img => img.category === selectedCategory);
  
  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage);
    if (direction === 'prev') {
      const newIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
      setSelectedImage(filteredImages[newIndex].id);
    } else {
      const newIndex = currentIndex === filteredImages.length - 1 ? 0 : currentIndex + 1;
      setSelectedImage(filteredImages[newIndex].id);
    }
  };

  return (
    <section id="gallery" className="relative py-24 overflow-hidden scroll-mt-32">
      <div className="container mx-auto px-6">
        <SectionHeader
          subtitle="Gallery"
          title="Captured Moments"
          description="Glimpses of unforgettable experiences awaiting you at Hotel Grill Durbar."
        />
        
        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-jade-bright text-charcoal-deep'
                  : 'glass-card text-pale-white hover:text-jade-bright'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>
        
        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => setSelectedImage(image.id)}
                className={`relative overflow-hidden rounded-2xl cursor-pointer group ${
                  index === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <motion.img
                  src={image.src}
                  alt={image.alt}
                  className={`w-full object-cover ${
                    index === 0 ? 'h-full min-h-[400px]' : 'h-48 md:h-64'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
      
      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/95 backdrop-blur-xl p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 p-2 text-pale-white hover:text-jade-bright transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X size={32} />
            </button>
            
            <button
              className="absolute left-4 md:left-8 p-2 text-pale-white hover:text-jade-bright transition-colors"
              onClick={(e) => { e.stopPropagation(); navigateImage('prev'); }}
            >
              <ChevronLeft size={40} />
            </button>
            
            <motion.img
              key={selectedImage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={filteredImages.find(img => img.id === selectedImage)?.src}
              alt=""
              className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              className="absolute right-4 md:right-8 p-2 text-pale-white hover:text-jade-bright transition-colors"
              onClick={(e) => { e.stopPropagation(); navigateImage('next'); }}
            >
              <ChevronRight size={40} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
