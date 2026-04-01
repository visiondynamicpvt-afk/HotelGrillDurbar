import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { adminApi, Booking } from '@/lib/api';
import { ArrowLeft, CheckCircle, XCircle, Clock, Upload, Download, Mail, Phone } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const getUploadsBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl) {
    const trimmed = envUrl.replace(/\/api\/?$/, '');
    if (trimmed) return trimmed;
  }
  if (import.meta.env.DEV) return 'http://localhost:5001';
  return typeof window !== 'undefined' ? window.location.origin.replace(/\/$/, '') : '';
};

const uploadsBaseUrl = getUploadsBaseUrl();

const BookingDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadBooking();
    }
  }, [id]);

  const loadBooking = async () => {
    try {
      const data = await adminApi.getBooking(id!);
      setBooking(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load booking');
      navigate('/admin/dashboard/bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true);
    try {
      const updated = await adminApi.updateBookingStatus(id!, status);
      setBooking(updated);
      toast.success('Booking status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentUpdate = async (paymentStatus: string) => {
    setUpdating(true);
    try {
      const updated = await adminApi.updatePaymentStatus(id!, paymentStatus);
      setBooking(updated);
      toast.success('Payment status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update payment status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    try {
      await adminApi.deleteBooking(id!);
      toast.success('Booking deleted');
      navigate('/admin/dashboard/bookings');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete booking');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-jade-bright" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Booking not found</p>
        <Button onClick={() => navigate('/admin/dashboard/bookings')}>Back to Bookings</Button>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard/bookings')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-4xl font-display text-pale-white mb-2">Booking Details</h1>
          <p className="text-muted-foreground">Booking ID: {booking.bookingId}</p>
        </div>
      </div>

      {/* Quick Summary for Approval */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-2xl font-display text-pale-white mb-4">Booking Summary</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="bg-charcoal-deep/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Guest</p>
            <p className="text-pale-white font-medium">{booking.guestName}</p>
            <p className="text-sm text-jade-bright">{booking.phoneNumber}</p>
          </div>
          <div className="bg-charcoal-deep/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Stay Duration</p>
            <p className="text-pale-white font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</p>
            <p className="text-sm text-muted-foreground">
              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
            </p>
          </div>
          <div className="bg-charcoal-deep/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Booking Amount</p>
            <p className="text-2xl font-display text-jade-bright">
              NPR {booking.totalAmount.toLocaleString()}
            </p>
          </div>
          <div className="bg-charcoal-deep/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Current Status</p>
            <div className="flex flex-col gap-1">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                  booking.bookingStatus === 'Approved'
                    ? 'bg-green-400/20 text-green-400'
                    : booking.bookingStatus === 'Payment Submitted'
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : booking.bookingStatus === 'Rejected'
                    ? 'bg-red-400/20 text-red-400'
                    : 'bg-blue-400/20 text-blue-400'
                }`}
              >
                {booking.bookingStatus}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                  booking.paymentStatus === 'Verified'
                    ? 'bg-green-400/20 text-green-400'
                    : booking.paymentStatus === 'Submitted'
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : booking.paymentStatus === 'Failed'
                    ? 'bg-red-400/20 text-red-400'
                    : 'bg-blue-400/20 text-blue-400'
                }`}
              >
                Payment: {booking.paymentStatus}
              </span>
            </div>
          </div>
        </div>
        {booking.specialRequests && (
          <div className="mt-4 p-3 bg-blue-400/10 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
            <p className="text-pale-white">{booking.specialRequests}</p>
          </div>
        )}
      </GlassCard>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Guest Information */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-display text-pale-white mb-6">Guest Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="text-pale-white font-medium">{booking.guestName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
              <div className="flex items-center gap-2">
                <Phone className="text-jade-bright" size={16} />
                <p className="text-pale-white font-medium">{booking.phoneNumber}</p>
              </div>
            </div>
            {booking.email && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="text-jade-bright" size={16} />
                  <p className="text-pale-white font-medium">{booking.email}</p>
                </div>
              </div>
            )}
            {booking.specialRequests && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Special Requests</p>
                <p className="text-pale-white">{booking.specialRequests}</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Booking Details */}
        <GlassCard className="p-6">
          <h2 className="text-2xl font-display text-pale-white mb-6">Booking Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Check-in Date</p>
              <p className="text-pale-white font-medium">
                {new Date(booking.checkInDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Check-out Date</p>
              <p className="text-pale-white font-medium">
                {new Date(booking.checkOutDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="text-pale-white font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Number of Guests</p>
              <p className="text-pale-white font-medium">{booking.numberOfGuests}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Number of Rooms</p>
              <p className="text-pale-white font-medium">{booking.numberOfRooms}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-2xl font-display text-jade-bright">
                NPR {booking.totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Status Management */}
      <GlassCard className="p-6 mb-6">
        <h2 className="text-2xl font-display text-pale-white mb-6">Status Management</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Booking Status</label>
            <Select
              value={booking.bookingStatus}
              onValueChange={handleStatusUpdate}
              disabled={updating}
            >
              <SelectTrigger className="bg-charcoal-deep/50 border-border text-pale-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Payment Submitted">Payment Submitted</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Payment Status</label>
            <Select
              value={booking.paymentStatus}
              onValueChange={handlePaymentUpdate}
              disabled={updating}
            >
              <SelectTrigger className="bg-charcoal-deep/50 border-border text-pale-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Payment Proof - Show prominently for approval */}
      {booking.paymentProof && (
        <GlassCard className="p-6 mb-6 border-2 border-jade-bright/30">
          <h2 className="text-2xl font-display text-pale-white mb-4 flex items-center gap-2">
            <Upload className="text-jade-bright" size={24} />
            Payment Proof - Ready for Review
          </h2>
          <div className="bg-charcoal-deep/50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Amount</p>
                <p className="text-2xl font-display text-jade-bright">
                  NPR {booking.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.paymentStatus === 'Verified'
                      ? 'bg-green-400/20 text-green-400'
                      : booking.paymentStatus === 'Submitted'
                      ? 'bg-yellow-400/20 text-yellow-400'
                      : 'bg-red-400/20 text-red-400'
                  }`}
                >
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-col md:flex-row">
              <img
                src={booking.paymentProof.startsWith('http') || booking.paymentProof.startsWith('data:') ? booking.paymentProof : `${uploadsBaseUrl}${booking.paymentProof}`}
                alt="Payment Proof"
                className="max-w-md rounded-lg border-2 border-border shadow-lg"
              />
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (booking.paymentProof.startsWith('data:')) {
                      // Download base64 image
                      const link = document.createElement('a');
                      link.href = booking.paymentProof;
                      link.download = `payment-proof-${booking.bookingId}.jpg`;
                      link.click();
                    } else {
                      // Download from URL
                      const link = document.createElement('a');
                      link.href = booking.paymentProof.startsWith('http') ? booking.paymentProof : `${uploadsBaseUrl}${booking.paymentProof}`;
                      link.download = `payment-proof-${booking.bookingId}.jpg`;
                      link.click();
                    }
                  }}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Image
                </Button>
                <div className="text-xs text-muted-foreground mt-2">
                  <p>• Review payment proof carefully</p>
                  <p>• Verify amount matches booking total</p>
                  <p>• Check payment date and reference</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Approval Decision Section */}
      {booking.bookingStatus === 'Payment Submitted' && (
        <GlassCard className="p-6 mb-6 border-2 border-yellow-400/30">
          <h2 className="text-2xl font-display text-pale-white mb-4">Approval Decision Required</h2>
          <div className="bg-yellow-400/10 p-4 rounded-lg mb-4">
            <p className="text-pale-white mb-2">
              <strong>Booking {booking.bookingId}</strong> has a payment proof submitted and is pending approval.
            </p>
            <p className="text-sm text-muted-foreground">
              Please review the payment proof above and the booking details to make your approval decision.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => handleStatusUpdate('Approved')}
              disabled={updating}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Approve Booking
            </Button>
            <Button
              onClick={() => handleStatusUpdate('Rejected')}
              disabled={updating}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Reject Booking
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete Booking
        </Button>
      </div>
    </div>
  );
};

export default BookingDetail;
