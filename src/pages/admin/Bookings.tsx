import { useEffect, useState } from 'react';
import { adminApi, Booking } from '@/lib/api';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, ImageIcon } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

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

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });
  const [receiptBooking, setReceiptBooking] = useState<Booking | null>(null);

  const navigate = useNavigate();

  // Date formatter helper
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

  useEffect(() => {
    loadBookings();
  }, [filters]);

  const loadBookings = async () => {
    try {
      const result = await adminApi.getAllBookings({
        status: filters.status || undefined,
        search: filters.search || undefined,
      });
      const sorted = [...result.data].sort((a, b) => {
        const aTime = new Date(a.createdAt || a.checkInDate).getTime();
        const bTime = new Date(b.createdAt || b.checkInDate).getTime();
        return (isNaN(bTime) ? 0 : bTime) - (isNaN(aTime) ? 0 : aTime);
      });
      setBookings(sorted);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminApi.updateBookingStatus(id, status);
      toast.success('Booking status updated');
      loadBookings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handlePaymentUpdate = async (id: string, paymentStatus: string) => {
    try {
      await adminApi.updatePaymentStatus(id, paymentStatus);
      toast.success('Payment status updated');
      loadBookings();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update payment status');
    }
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    try {
      const blob = await adminApi.exportBookings(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookings.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Bookings exported as ${format.toUpperCase()}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to export bookings');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display text-pale-white mb-2">Bookings Management</h1>
          <p className="text-muted-foreground">Manage all hotel bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-6 mb-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
              <Input
                placeholder="Search by name, ID, phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
              />
            </div>
          </div>
          <div>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? '' : value })}
            >
              <SelectTrigger className="bg-charcoal-deep/50 border-border text-pale-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Payment Submitted">Payment Submitted</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button onClick={loadBookings} variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Bookings Table */}
      <GlassCard className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={(booking as any)._id || booking.bookingId || Math.random().toString()}
                className="p-4 rounded-lg border border-border/50 bg-charcoal-deep/40 hover:bg-charcoal-deep/60 transition-colors"
              >
                {/* Header row: Booking ID and Status */}
                <div className="flex justify-between items-start mb-4 pb-3 border-b border-border/30">
                  <div>
                    <Link
                      to={`/admin/dashboard/bookings/${(booking as any)._id || booking.bookingId}`}
                      className="text-jade-bright hover:underline font-semibold"
                    >
                      #{booking.bookingId}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(booking.createdAt || '')}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.bookingStatus === 'Approved'
                        ? 'bg-green-400/20 text-green-400'
                        : booking.bookingStatus === 'Payment Submitted'
                        ? 'bg-yellow-400/20 text-yellow-400'
                        : booking.bookingStatus === 'Rejected' || booking.bookingStatus === 'Cancelled'
                        ? 'bg-red-400/20 text-red-400'
                        : 'bg-blue-400/20 text-blue-400'
                    }`}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                {/* Content grid with proper column alignment */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Column 1: Guest Info */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Guest</p>
                    <p className="text-sm text-pale-white font-medium">{booking.guestName}</p>
                    <p className="text-xs text-muted-foreground mt-1">{booking.phoneNumber}</p>
                  </div>

                  {/* Column 2: Dates */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Check-in / Check-out</p>
                    <p className="text-sm text-pale-white">
                      {formatDate(booking.checkInDate)}
                    </p>
                    <p className="text-sm text-pale-white">
                      {formatDate(booking.checkOutDate)}
                    </p>
                  </div>

                  {/* Column 3: Details (Rooms & Guests) */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Details</p>
                    <p className="text-sm text-pale-white">{booking.numberOfRooms} room(s)</p>
                    <p className="text-sm text-pale-white">{booking.numberOfGuests} guest(s)</p>
                  </div>

                  {/* Column 4: Payment & Amount */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Amount</p>
                    <p className="text-sm text-jade-bright font-semibold mb-2">NPR {booking.totalAmount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mb-1">Payment</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          booking.paymentStatus === 'Verified'
                            ? 'bg-green-400/20 text-green-400'
                            : booking.paymentStatus === 'Submitted'
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : booking.paymentStatus === 'Failed'
                            ? 'bg-red-400/20 text-red-400'
                            : 'bg-blue-400/20 text-blue-400'
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                      {booking.paymentProof && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReceiptBooking(booking)}
                          className="text-xs text-jade-bright hover:text-jade-bright/80 p-0 h-auto"
                        >
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons footer */}
                <div className="mt-4 pt-3 border-t border-border/30 flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/admin/dashboard/bookings/${(booking as any)._id || booking.bookingId}`)}
                    className="text-xs text-jade-bright hover:bg-jade-bright/10"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  {booking.bookingStatus === 'Payment Submitted' && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate((booking as any)._id || booking.bookingId, 'Approved')}
                        className="text-xs text-green-400 hover:bg-green-400/10"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStatusUpdate((booking as any)._id || booking.bookingId, 'Rejected')}
                        className="text-xs text-red-400 hover:bg-red-400/10"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Payment Receipt Preview Modal */}
      <Dialog open={!!receiptBooking} onOpenChange={() => setReceiptBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ImageIcon className="text-jade-bright" size={20} />
              Payment Receipt - {receiptBooking?.bookingId}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Payment receipt preview for booking {receiptBooking?.bookingId}
            </DialogDescription>
          </DialogHeader>
          {receiptBooking && (
            <div className="space-y-4">
              <div className="bg-charcoal-deep/50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Guest Name</p>
                    <p className="text-pale-white font-medium">{receiptBooking.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="text-pale-white font-medium">NPR {receiptBooking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        receiptBooking.paymentStatus === 'Verified'
                          ? 'bg-green-400/20 text-green-400'
                          : receiptBooking.paymentStatus === 'Submitted'
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : 'bg-red-400/20 text-red-400'
                      }`}
                    >
                      {receiptBooking.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Status</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        receiptBooking.bookingStatus === 'Approved'
                          ? 'bg-green-400/20 text-green-400'
                          : receiptBooking.bookingStatus === 'Payment Submitted'
                          ? 'bg-yellow-400/20 text-yellow-400'
                          : receiptBooking.bookingStatus === 'Rejected' || receiptBooking.bookingStatus === 'Cancelled'
                          ? 'bg-red-400/20 text-red-400'
                          : 'bg-blue-400/20 text-blue-400'
                      }`}
                    >
                      {receiptBooking.bookingStatus}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <img
                    src={
                      receiptBooking.paymentProof.startsWith('http') || receiptBooking.paymentProof.startsWith('data:')
                        ? receiptBooking.paymentProof
                        : `${uploadsBaseUrl}${receiptBooking.paymentProof}`
                    }
                    alt="Payment Receipt"
                    className="max-w-full max-h-96 rounded-lg border-2 border-border shadow-lg"
                  />
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement('a');
                      if (receiptBooking.paymentProof.startsWith('http') || receiptBooking.paymentProof.startsWith('data:')) {
                        link.href = receiptBooking.paymentProof;
                      } else {
                        link.href = `${uploadsBaseUrl}${receiptBooking.paymentProof}`;
                      }
                      link.download = `payment-receipt-${receiptBooking.bookingId}.jpg`;
                      link.click();
                    }}
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Receipt
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Bookings;
