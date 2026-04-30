import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, Users, Mail, Phone, FileText, Loader2, Upload, QrCode, Globe } from 'lucide-react';
import { api, BookingData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const COUNTRY_CODES = [
  { code: '+977', country: 'Nepal' },
  { code: '+91', country: 'India' },
  { code: '+44', country: 'United Kingdom' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+61', country: 'Australia' },
  { code: '+86', country: 'China' },
  { code: '+81', country: 'Japan' },
  { code: '+82', country: 'South Korea' },
  { code: '+66', country: 'Thailand' },
  { code: '+65', country: 'Singapore' },
];

const bookingSchema = z.object({
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  countryCode: z.string().min(1, 'Select country code'),
  phoneNumber: z.string().min(6, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().min(1, 'Check-out date is required'),
  numberOfGuests: z.number().min(1, 'At least 1 guest required').max(20, 'Maximum 20 guests'),
  numberOfRooms: z.number().min(1, 'At least 1 room required').max(13, 'Maximum 13 rooms'),
  specialRequests: z.string().optional(),
}).refine((data) => {
  const checkIn = new Date(data.checkInDate);
  const checkOut = new Date(data.checkOutDate);
  return checkOut > checkIn;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  initialData?: Partial<BookingFormData>;
  onSuccess?: (bookingId: string) => void;
}

const BookingForm = ({ initialData, onSuccess }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [countryCode, setCountryCode] = useState('+977');
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Initialize form before any conditional returns (must be at top)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numberOfGuests: 2,
      numberOfRooms: 1,
      countryCode: '+977',
      ...initialData,
    },
  });

  useEffect(() => {
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate('/login');
    }
  }, [user, navigate, authLoading]);

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-jade-bright" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const checkInDate = watch('checkInDate');
  const checkOutDate = watch('checkOutDate');
  const numberOfRooms = watch('numberOfRooms');
  const numberOfGuests = watch('numberOfGuests');

  // Calculate estimated price
  const calculatePrice = () => {
    if (!checkInDate || !checkOutDate || !numberOfRooms) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    // Price per room per night
    const pricePerRoomPerNight = 2000; // This should match server logic
    return pricePerRoomPerNight * numberOfRooms * nights;
  };

  const estimatedPrice = calculatePrice();

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate || !numberOfRooms) {
      toast.error('Please fill in check-in, check-out dates and number of rooms');
      return;
    }

    setIsCheckingAvailability(true);
    try {
      const availability = await api.checkAvailability(
        checkInDate,
        checkOutDate,
        numberOfRooms
      );

      if (availability.isAvailable) {
            toast.success(availability.message || 'Rooms available');
      } else {
        toast.error(availability.message || 'Rooms not available for selected dates');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to check availability');
    } finally {
      setIsCheckingAvailability(false);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    // Require payment file before booking
    if (!paymentFile) {
      toast.error('Please upload your payment receipt to proceed with booking');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check availability first
      const availability = await api.checkAvailability(
        data.checkInDate,
        data.checkOutDate,
        data.numberOfRooms
      );

      if (!availability.isAvailable) {
        toast.error(availability.message || 'Rooms not available for selected dates');
        setIsSubmitting(false);
        return;
      }

      // Create booking
      const bookingData: BookingData = {
        guestName: data.guestName,
        phoneNumber: `${data.countryCode}${data.phoneNumber}`,
        email: data.email || user?.email || undefined,
        checkInDate: data.checkInDate,
        checkOutDate: data.checkOutDate,
        numberOfGuests: data.numberOfGuests,
        numberOfRooms: data.numberOfRooms,
        specialRequests: data.specialRequests || undefined,
        totalAmount: estimatedPrice,
        userId: user.uid,
      };

      const { booking, message } = await api.createBooking(bookingData);

      // Upload payment proof (required now)
      try {
        await api.uploadPaymentProof(booking.bookingId, paymentFile);
        toast.success('Booking confirmed! Payment uploaded and admin has been notified via WhatsApp.');
      } catch (uploadErr: any) {
        toast.error(uploadErr.message || 'Booking created, but failed to upload payment proof');
        setIsSubmitting(false);
        return;
      }
      
      if (onSuccess) {
        onSuccess(booking.bookingId);
      } else {
        navigate(`/booking/${booking.bookingId}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Guest Name */}
        <div>
          <Label htmlFor="guestName" className="text-pale-white/80 mb-2 block">
            Full Name *
          </Label>
          <Input
            id="guestName"
            {...register('guestName')}
            placeholder="John Doe"
            className="bg-charcoal-deep/50 border-border text-pale-white"
          />
          {errors.guestName && (
            <p className="text-red-400 text-sm mt-1">{errors.guestName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email" className="text-pale-white/80 mb-2 block">
            Email (Optional)
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="john@example.com"
              className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
            />
          </div>
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Country Code and Phone Number */}
        <div className="md:col-span-2">
          <Label htmlFor="phoneNumber" className="text-pale-white/80 mb-2 block">
            Phone Number *
          </Label>
          <div className="flex gap-3 items-end">
            <div className="w-32">
              <Select defaultValue="+977" onValueChange={(value) => setCountryCode(value)}>
                <SelectTrigger className="bg-charcoal-deep/50 border-border text-pale-white">
                  <Globe className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-charcoal-deep border-border">
                  {COUNTRY_CODES.map((item) => (
                    <SelectItem key={item.code} value={item.code} className="text-pale-white">
                      {item.code} {item.country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
                <Input
                  id="phoneNumber"
                  {...register('phoneNumber')}
                  placeholder="98XXXXXXXX"
                  className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
                />
              </div>
            </div>
          </div>
          {errors.phoneNumber && (
            <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Check-in and Check-out Dates Side by Side */}
        <div>
          <Label htmlFor="checkInDate" className="text-pale-white/80 mb-2 block">
            Check-in Date *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
            <Input
              id="checkInDate"
              type="date"
              {...register('checkInDate')}
              min={today}
              className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
            />
          </div>
          {errors.checkInDate && (
            <p className="text-red-400 text-sm mt-1">{errors.checkInDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="checkOutDate" className="text-pale-white/80 mb-2 block">
            Check-out Date *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
            <Input
              id="checkOutDate"
              type="date"
              {...register('checkOutDate')}
              min={checkInDate || today}
              className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
            />
          </div>
          {errors.checkOutDate && (
            <p className="text-red-400 text-sm mt-1">{errors.checkOutDate.message}</p>
          )}
        </div>

        {/* Number of Guests */}
        <div>
          <Label htmlFor="numberOfGuests" className="text-pale-white/80 mb-2 block">
            Number of Guests *
          </Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
            <Input
              id="numberOfGuests"
              type="number"
              {...register('numberOfGuests', { valueAsNumber: true })}
              min={1}
              max={20}
              className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
            />
          </div>
          {errors.numberOfGuests && (
            <p className="text-red-400 text-sm mt-1">{errors.numberOfGuests.message}</p>
          )}
        </div>

        {/* Number of Rooms */}
        <div>
          <Label htmlFor="numberOfRooms" className="text-pale-white/80 mb-2 block">
            Number of Rooms *
          </Label>
          <Input
            id="numberOfRooms"
            type="number"
            {...register('numberOfRooms', { valueAsNumber: true })}
            min={1}
            max={8}
            className="bg-charcoal-deep/50 border-border text-pale-white"
          />
          {errors.numberOfRooms && (
            <p className="text-red-400 text-sm mt-1">{errors.numberOfRooms.message}</p>
          )}
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <Label htmlFor="specialRequests" className="text-pale-white/80 mb-2 block">
          Special Requests (Optional)
        </Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-jade-bright" size={18} />
          <Textarea
            id="specialRequests"
            {...register('specialRequests')}
            placeholder="Any special requests or requirements..."
            rows={4}
            className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
          />
        </div>
      </div>

      {/* Price Summary */}
      {estimatedPrice > 0 && (
        <div className="p-4 rounded-lg border border-jade-bright/50 bg-jade-bright/15 space-y-3">
          <h3 className="text-lg font-semibold text-jade-bright">💰 Price Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-pale-white">Rate per Room per Night:</span>
              <span className="font-semibold text-pale-white">NPR 2,000</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pale-white">Number of Rooms:</span>
              <span className="font-semibold text-pale-white">{numberOfRooms} room{numberOfRooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-pale-white">Number of Nights:</span>
              <span className="font-semibold text-pale-white">
                {checkInDate && checkOutDate
                  ? Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
                  : 0}
              </span>
            </div>
            <div className="border-t border-jade-bright/30 pt-2 mt-2 flex justify-between">
              <span className="text-pale-white font-semibold">Total Amount:</span>
              <span className="text-xl font-bold text-jade-bright">NPR {estimatedPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method & Proof */}
      <div className="p-4 rounded-lg border border-jade-deep/50 bg-charcoal-deep/50 space-y-4">
        <div className="flex items-center gap-2 text-pale-white mb-3">
          <QrCode size={18} className="text-jade-bright" />
          <p className="font-semibold">Payment Method: Fonepay QR</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-3">Please pay the amount below and upload your receipt:</p>
          {estimatedPrice > 0 && (
            <div className="bg-charcoal/80 rounded-lg p-3 mb-4 border border-jade-bright/20">
              <p className="text-xs text-muted-foreground">Amount to Pay:</p>
              <p className="text-2xl font-bold text-jade-bright">NPR {estimatedPrice.toLocaleString()}</p>
            </div>
          )}
          <img
            src="/fonepay-qr.png"
            alt="Fonepay QR"
            className="w-64 h-auto border border-jade-bright/30 rounded-md mx-auto"
          />
        </div>
        <div>
          <Label className="text-pale-white/80 mb-2 block flex items-center gap-2">
            <Upload size={16} />
            Upload Payment Receipt *
          </Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setPaymentFile(e.target.files ? e.target.files[0] : null)}
            className="bg-charcoal-deep/50 border-border text-pale-white file:bg-jade-bright/20 file:text-jade-bright file:border-0"
          />
          {paymentFile && (
            <p className="text-xs text-green-400 mt-1">✓ Receipt selected: {paymentFile.name}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Accepted formats: JPG, PNG, PDF</p>
        </div>
      </div>

      {/* Availability Check Button */}
      {checkInDate && checkOutDate && numberOfRooms && (
        <Button
          type="button"
          variant="outline"
          onClick={handleCheckAvailability}
          disabled={isCheckingAvailability}
          className="w-full"
        >
          {isCheckingAvailability ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Availability'
          )}
        </Button>
      )}

      {/* Submit Button - Only show "Book" when payment file is uploaded */}
      {paymentFile ? (
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-jade-bright hover:bg-jade-deep text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Booking...
            </>
          ) : (
            'Book'
          )}
        </Button>
      ) : (
        <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
          <p className="text-sm text-yellow-200 text-center">
            Please upload your payment receipt to proceed with booking.
          </p>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
