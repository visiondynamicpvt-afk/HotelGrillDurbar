import { motion } from 'framer-motion';
import { Heart, Facebook, Instagram } from 'lucide-react';
import { Music } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '@/images/Logo.jpeg';

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    const target = href;
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 120);
    } else {
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="relative py-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-jade flex items-center justify-center overflow-hidden">
                <img 
                  src={logo} 
                  alt="Hotel Grill Durbar Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="font-display text-2xl font-semibold text-pale-white">Hotel Grill Durbar</span>
                <span className="block text-xs text-jade-bright uppercase tracking-widest">Chitwan, Nepal</span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-md mb-6">
              Experience the perfect blend of luxury hospitality and Nepali warmth at Hotel Grill Durbar, 
              your gateway to unforgettable Chitwan adventures.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {[
                { icon: <Facebook size={20} />, href: 'https://facebook.com/hotelgrilldurbar' },
                { icon: <Music size={20} />, href: 'https://tiktok.com/hotelgrilldurbar' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-jade-bright transition-colors"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg text-pale-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Rooms', 'Facilities', 'Gallery', 'Contact'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={(e) => handleNavClick(e, `#${link.toLowerCase()}`)}
                    className="text-muted-foreground hover:text-jade-bright transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-display text-lg text-pale-white mb-4">Contact</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>Sauraha, Chitwan</li>
              <li>Nepal</li>
              <li className="text-jade-bright">056-494295, 9811236030</li>
              <li>hotelgrilldurbar@gmail.com</li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Hotel Grill Durbar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
