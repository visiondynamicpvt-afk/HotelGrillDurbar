import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import BookingForm from '@/components/BookingForm';
import GlassCard from '@/components/UI/GlassCard';
import SectionHeader from '@/components/UI/SectionHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

const BookingFormPage = () => {
  const [showInfo, setShowInfo] = useState(true); // Auto-open on page load
  const [hasSeenInfo, setHasSeenInfo] = useState(false);

  const handleInfoClose = () => {
    setShowInfo(false);
    setHasSeenInfo(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Added top padding to clear navigation */}
      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-16">
        <div className="max-w-3xl mx-auto">
          {/* Header Section - Better spacing */}
          <div className="mb-12">
            <SectionHeader
              subtitle="Reservation"
              title="Book Your Stay"
              description="Fill in the details below to make a reservation at Hotel Grill Durbar"
            />
          </div>

          {/* Info Button - Always visible for manual access */}
          {hasSeenInfo && (
            <div className="mb-6 flex justify-center">
              <Button
                onClick={() => setShowInfo(true)}
                variant="outline"
                className="flex items-center gap-2 text-jade-bright border-jade-bright/30 hover:bg-jade-bright/10"
              >
                <Info size={18} />
                View Important Information
              </Button>
            </div>
          )}

          {/* Booking Form - Increased padding */}
          <GlassCard className="p-6 sm:p-8 md:p-10">
            <BookingForm />
          </GlassCard>
        </div>
      </div>

      {/* Important Information Dialog - Auto-opens on page load */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="max-w-md bg-charcoal-deep border-border">
          <DialogHeader>
            <DialogTitle className="text-pale-white flex items-center gap-2">
              <Info className="text-jade-bright" size={20} />
              Important Information
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Please read these important details before making your booking
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <ul className="space-y-3 text-muted-foreground text-sm">
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Check-in time:</strong> 12:30 PM</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Check-out time:</strong> 12:00 PM</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Payment Required:</strong> Payment is required to confirm your booking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Payment Upload:</strong> You can upload payment proof after booking creation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Room Limit:</strong> Maximum 8 rooms available per booking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Guest Limit:</strong> Maximum 20 guests per booking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Cancellation:</strong> Cancellations must be made 48 hours before check-in for a full refund</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Support Contact:</strong> For assistance, call us at +977 056-580123</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-jade-bright mt-1 font-bold">•</span>
                <span><strong className="text-pale-white">Admin Approval:</strong> Your booking requires admin approval before confirmation</span>
              </li>
            </ul>
          </div>
          <Button
            onClick={handleInfoClose}
            className="w-full bg-jade-bright hover:bg-jade-deep text-white mt-4"
          >
            I Understand - Proceed to Booking Form
          </Button>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default BookingFormPage;
