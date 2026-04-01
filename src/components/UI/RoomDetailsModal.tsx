import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Calendar, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedButton from './AnimatedButton';

interface RoomFeature {
  name: string;
  icon: React.ReactNode;
}

interface Room {
  id: number;
  name: string;
  description: string;
  pricePerPerson: number;
  capacity: number;
  image: string;
  features: RoomFeature[];
}

interface RoomDetailsModalProps {
  room: Room;
  onClose: () => void;
}

const RoomDetailsModal = ({ room, onClose }: RoomDetailsModalProps) => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    onClose();
    navigate('/book');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-charcoal-deep/95 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-y-auto glass-card rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-charcoal/80 hover:bg-charcoal flex items-center justify-center text-pale-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="grid md:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative h-96 md:h-auto min-h-[400px] overflow-hidden">
              <motion.img
                src={room.image}
                alt={room.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
              
              {/* Price Badge on Image */}
              <div className="absolute bottom-6 left-6 glass-card px-4 py-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-display font-semibold text-jade-bright">
                    NPR {room.pricePerPerson.toLocaleString()}
                  </span>
                  <span className="text-sm text-muted-foreground">per person</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={18} className="text-jade-bright" />
                  <span className="text-sm text-muted-foreground">{room.capacity} Guests</span>
                </div>
                <h2 className="font-display text-4xl md:text-5xl text-pale-white mb-3">
                  {room.name}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Room Features */}
              <div className="mb-8">
                <h3 className="font-display text-xl text-pale-white mb-4 flex items-center gap-2">
                  <CheckCircle2 size={20} className="text-jade-bright" />
                  Room Features
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {room.features.map((feature, index) => (
                    <motion.div
                      key={feature.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-jade-deep/20 border border-jade/20 hover:bg-jade-deep/30 transition-colors"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-jade-deep/40 flex items-center justify-center text-jade-bright">
                        {feature.icon}
                      </div>
                      <span className="text-pale-white font-medium">{feature.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Availability & Booking */}
              <div className="mt-auto space-y-4">
                <div className="flex items-center gap-2 text-jade-bright">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-medium">Available for booking</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <AnimatedButton 
                    variant="primary" 
                    className="flex-1 justify-center"
                    onClick={handleBookNow}
                  >
                    Book Now
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="ghost" 
                    className="flex-1 justify-center"
                    onClick={onClose}
                  >
                    Close
                  </AnimatedButton>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RoomDetailsModal;
