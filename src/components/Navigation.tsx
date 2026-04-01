import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AnimatedButton from './ui/AnimatedButton';
import { useAuth } from '../contexts/AuthContext';
import logo from '@/images/Logo.jpeg';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Rooms', href: '#rooms' },
  { name: 'Facilities', href: '#facilities' },
  { name: 'Gallery', href: '#gallery' },
  { name: 'Contact', href: '#contact' },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookNow = () => {
    const target = '#rooms';

    // If not on home, go there first then scroll to rooms
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }

    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll to section
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // We're already on home page, just scroll
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`glass-card px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between transition-all duration-500 min-h-[70px] ${
            isScrolled ? 'backdrop-blur-xl' : 'backdrop-blur-md'
          } bg-charcoal/80 sm:bg-charcoal/70`}> 
            {/* Logo */}
            <motion.a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center gap-3 flex-shrink-0"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-jade flex items-center justify-center overflow-hidden">
                <img 
                  src={logo} 
                  alt="Hotel Grill Durbar Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-display text-xl font-semibold text-pale-white">Grill Durbar</span>
                <span className="block text-xs text-jade-bright uppercase tracking-widest">Hotel & Restaurant</span>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="nav-link text-sm"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>

            {/* CTA & Mobile Menu */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 ml-auto flex-shrink-0">
              {user ? (
                <>
                  <AnimatedButton size="sm" variant="ghost" onClick={() => navigate('/profile')} className="hidden md:flex whitespace-nowrap gap-2">
                    <User size={14} />
                    <span>Profile</span>
                  </AnimatedButton>
                  <AnimatedButton size="sm" variant="ghost" onClick={handleLogout} className="hidden md:flex whitespace-nowrap gap-2">
                    <LogOut size={14} />
                    <span>Logout</span>
                  </AnimatedButton>
                </>
              ) : (
                <>
                  <AnimatedButton size="sm" variant="ghost" onClick={() => navigate('/login')} className="hidden sm:flex whitespace-nowrap">
                    Login
                  </AnimatedButton>
                  <AnimatedButton size="sm" variant="ghost" onClick={() => navigate('/signup')} className="hidden md:flex whitespace-nowrap">
                    Sign Up
                  </AnimatedButton>
                </>
              )}
              <AnimatedButton variant="primary" size="sm" onClick={handleBookNow} className="whitespace-nowrap flex-shrink-0">
                <Phone size={16} />
                <span className="hidden sm:inline">Book Now</span>
                <span className="sm:hidden">Book</span>
              </AnimatedButton>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-pale-white flex-shrink-0"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/90 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md glass-card rounded-none"
            >
              <div className="p-6">
                <div className="flex justify-end mb-12">
                  <button
                    className="p-2 text-pale-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleNavClick(e, link.href)}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="block text-3xl font-display text-pale-white hover:text-jade-bright transition-colors"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-12 space-y-4"
                >
                  {user ? (
                    <>
                      <AnimatedButton className="w-full justify-center" onClick={() => navigate('/profile')}>
                        <User size={16} />
                        Profile
                      </AnimatedButton>
                      <AnimatedButton variant="outline" className="w-full justify-center" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </AnimatedButton>
                    </>
                  ) : (
                    <>
                      <AnimatedButton variant="outline" className="w-full justify-center" onClick={() => navigate('/login')}>
                        Login
                      </AnimatedButton>
                      <AnimatedButton variant="outline" className="w-full justify-center" onClick={() => navigate('/signup')}>
                        Sign Up
                      </AnimatedButton>
                    </>
                  )}
                  <AnimatedButton className="w-full justify-center" onClick={handleBookNow}>
                    <Phone size={16} />
                    Book Now
                  </AnimatedButton>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
