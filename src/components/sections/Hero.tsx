import { motion } from 'framer-motion';
import { ArrowDown, MapPin, Star, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from '@/components/UI/AnimatedButton';
import building1 from '@/images/Building1.png';
import building2 from '@/images/Building 2.png';
import building3 from '@/images/Building 3.png';
import logo from '@/images/Logo.jpeg';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const images = [building1, building2, building3];

interface HomeContent {
  title?: string;
  subtitle?: string;
  description?: string;
}

const Hero = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [content, setContent] = useState<HomeContent>({
    title: 'Hotel Grill Durbar',
    subtitle: 'Experience Paradise in Chitwan',
    description: 'Discover luxury accommodation and fine dining in the heart of nature',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadHomeContent();
  }, []);

  const loadHomeContent = async () => {
    try {
      const response = await api.getContent('home');
      if (response?.content) {
        setContent({
          title: response.content.title || content.title,
          subtitle: response.content.subtitle || content.subtitle,
          description: response.content.description || content.description,
        });
      }
    } catch (error) {
      console.error('Failed to load home content:', error);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image Slideshow */}
      {images.map((img, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: currentImage === index ? 1 : 0,
            scale: currentImage === index ? 1 : 1.1
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <img 
            src={img} 
            alt="Hotel Grill Durbar" 
            className="w-full h-full object-cover"
          />
        </motion.div>
      ))}
      
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-charcoal/70 z-5" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal z-10" />
      
      {/* Decorative jade accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-jade-bright/10 rounded-full blur-3xl z-5" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl z-5" />
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-8"
          >
            <MapPin size={14} className="text-jade-bright" />
            <span className="text-sm text-pale-white/80">Chitwan, Nepal</span>
            <span className="w-1 h-1 rounded-full bg-jade-bright" />
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="text-gold fill-gold" />
              ))}
            </div>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <img 
              src={logo} 
              alt="Hotel Grill Durbar Logo" 
              className="w-32 h-32 md:w-40 md:h-40 mx-auto rounded-full object-cover border-4 border-jade-bright/30 shadow-lg"
            />
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-pale-white mb-6"
          >
            <span className="block text-lg md:text-xl tracking-[0.3em] text-jade-bright/80 uppercase mb-4">Welcome to</span>
            <span className="jade-gradient-text font-semibold">{content.title || 'Grill Durbar'}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-pale-white/80 mb-4 font-light"
          >
            {content.subtitle || 'Where Luxury Meets the Wild Heart of Nepal'}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            {content.description || 'Experience unparalleled hospitality in the gateway to Chitwan National Park. Indulge in exquisite dining, luxurious accommodations, and unforgettable safari adventures.'}
          </motion.p>

          {/* Quick Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="glass-card p-6 md:p-8 max-w-4xl mx-auto mb-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="text-left">
                <label className="text-sm text-pale-white/60 mb-2 block">Check-in</label>
                <div className="flex items-center gap-2 bg-charcoal/50 border border-jade/30 rounded-lg px-4 py-3">
                  <Calendar size={18} className="text-jade-bright" />
                  <input 
                    type="date" 
                    className="bg-transparent text-pale-white outline-none w-full"
                  />
                </div>
              </div>
              <div className="text-left">
                <label className="text-sm text-pale-white/60 mb-2 block">Check-out</label>
                <div className="flex items-center gap-2 bg-charcoal/50 border border-jade/30 rounded-lg px-4 py-3">
                  <Calendar size={18} className="text-jade-bright" />
                  <input 
                    type="date" 
                    className="bg-transparent text-pale-white outline-none w-full"
                  />
                </div>
              </div>
              <div className="text-left">
                <label className="text-sm text-pale-white/60 mb-2 block">Guests</label>
                <div className="flex items-center gap-2 bg-charcoal/50 border border-jade/30 rounded-lg px-4 py-3">
                  <Users size={18} className="text-jade-bright" />
                  <select className="bg-transparent text-pale-white outline-none w-full">
                    <option value="1" className="bg-charcoal">1 Guest</option>
                    <option value="2" className="bg-charcoal">2 Guests</option>
                    <option value="3" className="bg-charcoal">3 Guests</option>
                    <option value="4" className="bg-charcoal">4+ Guests</option>
                  </select>
                </div>
              </div>
              <AnimatedButton 
                variant="primary" 
                className="w-full h-[50px]"
                onClick={() => navigate('/book')}
              >
                Book Now
              </AnimatedButton>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            {[
              { value: '15+', label: 'Luxury Rooms' },
              { value: '10+', label: 'Years Legacy' },
              { value: '5★', label: 'Experience' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <span className="block text-3xl md:text-4xl font-display font-semibold jade-gradient-text">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentImage === index 
                ? 'bg-jade-bright w-8' 
                : 'bg-pale-white/30 hover:bg-pale-white/50'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.a
          href="#rooms"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-pale-white/50 hover:text-jade-bright transition-colors cursor-pointer"
        >
          <span className="text-xs uppercase tracking-widest">Discover</span>
          <ArrowDown size={20} />
        </motion.a>
      </motion.div>
    </section>
  );
};

export default Hero;
