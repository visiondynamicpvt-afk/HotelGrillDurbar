import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import GlassCard from '../ui/GlassCard';
import SectionHeader from '../ui/SectionHeader';
import AnimatedButton from '../ui/AnimatedButton';
import { api } from '@/lib/api';
import { getResponseMessage, parseJsonResponse } from '@/lib/http';
import { toast } from 'sonner';

interface ContactContent {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;
}

const defaultContactInfo = [
  {
    icon: <Phone size={24} />,
    title: 'Phone',
    value: '056-494295, 9811236030',
    subtitle: 'Call us anytime',
  },
  {
    icon: <Mail size={24} />,
    title: 'Email',
    value: 'hotelgrilldurbar@gmail.com',
    subtitle: 'We reply within 24 hours',
  },
  {
    icon: <MapPin size={24} />,
    title: 'Location',
    value: 'Sauraha, Chitwan',
    subtitle: 'Nepal',
  },
  {
    icon: <Clock size={24} />,
    title: 'Hours',
    value: '24/7 Available',
    subtitle: 'For reservations',
  },
];

const Contact = () => {
  const [showHotelLocation, setShowHotelLocation] = useState(false);
  const [contactContent, setContactContent] = useState<ContactContent>({});
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const WEB3FORMS_ACCESS_KEY = '7c5108c1-8ffd-4415-ac5b-362f7da44ce5';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          from_name: 'Hotel Grill Durbar Contact Form',
          redirect: false,
        }),
      });

      const result = await parseJsonResponse<{ success?: boolean; message?: string }>(response);

      if (!response.ok) {
        throw new Error(getResponseMessage(response, result, 'Failed to send message. Please try again.'));
      }

      if (result?.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(result?.message || 'Failed to send message. Please try again.');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactContent();
  }, []);

  const loadContactContent = async () => {
    try {
      const response = await api.getContent('contact');
      if (response?.content) {
        setContactContent(response.content);
        // Update contact info with loaded data
        const updatedInfo = defaultContactInfo.map((info) => {
          if (info.title === 'Phone' && response.content.phone) {
            return { ...info, value: response.content.phone };
          }
          if (info.title === 'Email' && response.content.email) {
            return { ...info, value: response.content.email };
          }
          if (info.title === 'Location' && response.content.address) {
            return { ...info, value: response.content.address };
          }
          if (info.title === 'Hours' && response.content.hours) {
            return { ...info, value: response.content.hours };
          }
          return info;
        });
        setContactInfo(updatedInfo);
      }
    } catch (error) {
      console.error('Failed to load contact content:', error);
    }
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden scroll-mt-32">
      {/* Background */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-jade-deep/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader
          subtitle="Get in Touch"
          title="Contact Us"
          description="We're here to help you plan your perfect stay. Reach out to us anytime."
        />
        
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <GlassCard key={info.title} delay={index * 0.1} className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-jade-deep/50 text-jade-bright">
                    {info.icon}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{info.title}</span>
                    <p className="text-pale-white font-medium">{info.value}</p>
                    <p className="text-sm text-muted-foreground">{info.subtitle}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
            
            {/* Interactive Map */}
            <div className="space-y-4">
              <motion.div
                animate={{ height: showHotelLocation ? 'auto' : 256 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <GlassCard delay={0.4} className="h-64 overflow-hidden p-0">
                  {!showHotelLocation ? (
                    // Nepal Map - Wide view
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d885735.0416779899!2d84.124!3d28.3949!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2snp!4v1704067200000"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    />
                  ) : (
                    // Hotel Location - Zoomed in
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.1354911323892!2d84.49353187505017!3d27.589328676250457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994ef38bb61f3bb%3A0x7c2474d9c92d0aa4!2sHotel%20Grill%20durbar!5e0!3m2!1sen!2snp!4v1769324521113!5m2!1sen!2snp"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    />
                  )}
                </GlassCard>
              </motion.div>

              {/* Toggle Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowHotelLocation(!showHotelLocation)}
                className="w-full py-3 px-4 rounded-xl bg-jade-deep/30 hover:bg-jade-deep/50 border border-jade-bright/30 hover:border-jade-bright/60 text-jade-bright font-medium transition-all flex items-center justify-center gap-2"
              >
                <MapPin size={18} />
                {showHotelLocation ? 'View Nepal Map' : 'View Hotel Location'}
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${showHotelLocation ? 'rotate-180' : ''}`}
                />
              </motion.button>
            </div>
          </div>
          
          {/* Contact Form */}
          <GlassCard delay={0.2} className="p-8">
            <h3 className="font-display text-2xl text-pale-white mb-6">Send us a Message</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-charcoal-deep/50 border border-border text-pale-white placeholder:text-muted-foreground focus:outline-none focus:border-jade-bright focus:ring-1 focus:ring-jade-bright transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-charcoal-deep/50 border border-border text-pale-white placeholder:text-muted-foreground focus:outline-none focus:border-jade-bright focus:ring-1 focus:ring-jade-bright transition-all"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-deep/50 border border-border text-pale-white placeholder:text-muted-foreground focus:outline-none focus:border-jade-bright focus:ring-1 focus:ring-jade-bright transition-all"
                  placeholder="Booking Inquiry"
                />
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Message</label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-charcoal-deep/50 border border-border text-pale-white placeholder:text-muted-foreground focus:outline-none focus:border-jade-bright focus:ring-1 focus:ring-jade-bright transition-all resize-none"
                  placeholder="Tell us about your plans..."
                />
              </div>
              
              <AnimatedButton
                onClick={() => {}}
                className="w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                {loading ? 'Sending...' : 'Send Message'}
              </AnimatedButton>
            </form>
          </GlassCard>
        </div>
      </div>
      
      {/* WhatsApp Button */}
      <motion.a
        href="https://wa.me/9779811236030"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg pulse-glow"
      >
        <MessageCircle size={28} className="text-white" />
      </motion.a>
    </section>
  );
};

export default Contact;
