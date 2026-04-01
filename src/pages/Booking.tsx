import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, Booking } from '@/lib/api';
import { Loader2, CheckCircle2, Clock, XCircle, Upload, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import Navigation from '@/components/Navigation';
import Footer from '@/components/sections/Footer';
import Invoice from '@/components/Invoice';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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

const BookingPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (bookingId) {
      loadBooking();
    }
  }, [bookingId]);

  useEffect(() => {
    if (booking && booking.totalAmount) {
      generateDynamicQRCode();
    }
  }, [booking]);

  const loadBooking = async () => {
    if (!bookingId) return;
    
    try {
      const data = await api.getBooking(bookingId);
      setBooking(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load booking');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const generateDynamicQRCode = async () => {
    if (!booking) return;

    try {
      // Generate Fonepay-compatible QR code with embedded payment data
      // Format: fonepay://pay?terminal=222214001136 4157&amount=AMOUNT&ref=BOOKING_ID&merchant=HOTEL GRILL DURBAR
      const qrData = `fonepay://pay?terminal=2222140011364157&amount=${booking.totalAmount}&reference=${booking.bookingId}&merchant=HOTEL GRILL DURBAR&bank=SAURAHA`;

      const qrUrl = await QRCode.toDataURL(qrData, {
        width: 350,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });

      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
    }
  };

  const handleUploadPayment = async () => {
    if (!paymentFile || !booking) {
      toast.error('Please select a payment proof image');
      return;
    }

    setUploading(true);
    try {
      const updatedBooking = await api.uploadPaymentProof(booking.bookingId, paymentFile);
      setBooking(updatedBooking);
      toast.success('Payment proof uploaded successfully!');
      setPaymentFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload payment proof');
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    const input = document.getElementById('invoice-capture');
    if (!input) {
      toast.error('Invoice element not found');
      return;
    }
    
    setDownloadingInvoice(true);
    try {
      // Small delay to ensure styles are applied
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Hotel-Grill-Durbar-Invoice-${booking?.bookingId}.pdf`);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-green-400';
      case 'Payment Submitted':
        return 'text-yellow-400';
      case 'Rejected':
      case 'Cancelled':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 className="text-green-400" size={20} />;
      case 'Payment Submitted':
        return <Clock className="text-yellow-400" size={20} />;
      case 'Rejected':
      case 'Cancelled':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <Clock className="text-blue-400" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-jade-bright" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-display text-pale-white mb-2">Booking Not Found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.checkOutDate).getTime() - new Date(booking.checkInDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Added top padding to clear navigation */}
      <div className="container mx-auto px-4 sm:px-6 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Header - Better spacing */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-display text-pale-white mb-4">Booking Details</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Booking ID: <span className="font-mono text-jade-bright">{booking.bookingId}</span></p>
          </div>

          {/* Status Card - Increased spacing */}
          <div className="glass-card p-6 sm:p-8 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(booking.bookingStatus)}
                <div>
                  <p className="text-sm text-muted-foreground">Booking Status</p>
                  <p className={`font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                    {booking.bookingStatus}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Payment Status</p>
                <p className={`font-semibold ${getStatusColor(booking.paymentStatus)}`}>
                  {booking.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {/* Booking Information */}
            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-display text-pale-white mb-6 pb-3 border-b border-jade-bright/20">Booking Information</h2>
              <div className="space-y-5">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Guest Name</p>
                  <p className="text-pale-white font-medium text-base sm:text-lg">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Phone Number</p>
                  <p className="text-pale-white font-medium text-base sm:text-lg">{booking.phoneNumber}</p>
                </div>
                {booking.email && (
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-pale-white font-medium">{booking.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Check-in Date</p>
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
                  <p className="text-sm text-muted-foreground">Check-out Date</p>
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
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-pale-white font-medium">{nights} {nights === 1 ? 'night' : 'nights'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Guests</p>
                  <p className="text-pale-white font-medium">{booking.numberOfGuests}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Rooms</p>
                  <p className="text-pale-white font-medium">{booking.numberOfRooms}</p>
                </div>
                {booking.specialRequests && (
                  <div>
                    <p className="text-sm text-muted-foreground">Special Requests</p>
                    <p className="text-pale-white font-medium">{booking.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="glass-card p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-display text-pale-white mb-6 pb-3 border-b border-jade-bright/20">Payment Information</h2>
              
              <div className="space-y-5 mb-8">
                <div className="p-4 bg-jade-bright/5 rounded-lg border border-jade-bright/20">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">Total Amount</p>
                  <p className="text-3xl sm:text-4xl font-display text-jade-bright">
                    NPR {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Payment Method</p>
                  <p className="text-pale-white font-medium text-base">FonePay QR Code</p>
                </div>
              </div>

              {/* Fonepay QR Code */}
              {booking.paymentStatus === 'Pending' && (
                <div className="mb-8">
                  {/* Amount Display - Large and Prominent */}
                  <div className="mb-6 p-5 sm:p-6 bg-jade-bright/10 border-2 border-jade-bright rounded-lg text-center">
                    <p className="text-sm sm:text-base text-pale-white mb-2">Total Amount to Pay</p>
                    <p className="text-4xl sm:text-5xl font-bold text-jade-bright">NPR {booking.totalAmount.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-2">Booking ID: <span className="font-mono">{booking.bookingId}</span></p>
                  </div>

                  {/* QR Code */}
                  <div className="p-6 sm:p-8 bg-white rounded-lg mb-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan to Pay with Fonepay</h3>
                      <img 
                        src="/fonepay-qr.png" 
                        alt="Fonepay QR Code" 
                        className="w-full max-w-md mx-auto"
                      />
                      <div className="mt-4">
                        <p className="text-xs text-gray-600">HOTEL GRILL DURBAR</p>
                        <p className="text-xs text-gray-600">Terminal: 222214001136 4157</p>
                        <p className="text-xs text-gray-600">Bank Branch: SAURAHA</p>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-5 sm:p-6 bg-charcoal-deep/50 rounded-lg space-y-3">
                    <h4 className="text-jade-bright font-semibold text-base sm:text-lg mb-4">💳 Payment Instructions:</h4>
                    <p className="text-sm sm:text-base text-pale-white flex items-start gap-2">
                      <span className="font-bold text-jade-bright">1.</span>
                      <span>Open Fonepay / Mobile Banking App</span>
                    </p>
                    <p className="text-sm sm:text-base text-pale-white flex items-start gap-2">
                      <span className="font-bold text-jade-bright">2.</span>
                      <span>Scan the QR code above</span>
                    </p>
                    <p className="text-sm sm:text-base text-pale-white flex items-start gap-2">
                      <span className="font-bold text-jade-bright">3.</span>
                      <span><span className="text-jade-bright font-semibold">Enter amount: NPR {booking.totalAmount.toLocaleString()}</span></span>
                    </p>
                    <p className="text-sm sm:text-base text-pale-white flex items-start gap-2">
                      <span className="font-bold text-jade-bright">4.</span>
                      <span>Add reference: <span className="font-mono text-jade-bright">{booking.bookingId}</span></span>
                    </p>
                    <p className="text-sm sm:text-base text-pale-white flex items-start gap-2">
                      <span className="font-bold text-jade-bright">5.</span>
                      <span>Complete payment and take screenshot</span>
                    </p>
                    <p className="text-sm sm:text-base text-pale-white flex items-start gap-2">
                      <span className="font-bold text-jade-bright">6.</span>
                      <span>Upload payment proof below</span>
                    </p>
                  </div>
                </div>
              )}

              {/* Payment Upload */}
              {booking.paymentStatus === 'Pending' && (
                <div className="space-y-4 mt-6">
                  <div>
                    <Label className="text-pale-white/80 mb-3 block text-sm sm:text-base font-medium">
                      Upload Payment Proof
                    </Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="bg-charcoal-deep/50 border-border text-pale-white"
                    />
                  </div>
                  {paymentFile && (
                    <Button
                      onClick={handleUploadPayment}
                      disabled={uploading}
                      className="w-full bg-jade-bright hover:bg-jade-deep"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Payment Proof
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}

              {/* Payment Proof Display */}
              {booking.paymentProof && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Payment Proof</p>
                  <img
                    src={booking.paymentProof.startsWith('http') || booking.paymentProof.startsWith('data:') ? booking.paymentProof : `${uploadsBaseUrl}${booking.paymentProof}`}
                    alt="Payment Proof"
                    className="w-full rounded-lg border border-border"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="glass-card p-6 sm:p-8 flex flex-wrap gap-4 justify-center">
            {booking.bookingStatus === 'Approved' && (
              <Button 
                variant="outline" 
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                className="min-w-[200px] border-jade-bright text-jade-bright hover:bg-jade-bright/10"
              >
                {downloadingInvoice ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download Invoice
                  </>
                )}
              </Button>
            )}
            <Button 
              variant="default" 
              onClick={() => navigate('/book')}
              className="min-w-[200px]"
            >
              Book Another Room
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="min-w-[200px]"
            >
              Return Home
            </Button>
          </div>

          {/* Instructions */}
          <div className="glass-card p-6 sm:p-8 mt-8">
            <h3 className="text-xl sm:text-2xl font-display text-pale-white mb-6">Important Information</h3>
            <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
              <li className="flex items-start gap-2">
                <span className="text-jade-bright mt-1">•</span>
                <span>Check-in time: 12:30 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jade-bright mt-1">•</span>
                <span>Check-out time: 12:00 PM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jade-bright mt-1">•</span>
                <span>Please upload payment proof after making the payment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jade-bright mt-1">•</span>
                <span>Your booking will be confirmed after payment verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-jade-bright mt-1">•</span>
                <span>For any queries, contact us at +977 056-580123</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
      <Invoice booking={booking} />
    </div>
  );
};

export default BookingPage;
