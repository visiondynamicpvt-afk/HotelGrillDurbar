import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../lib/api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import Navigation from '../../components/Navigation';

interface Booking {
  id: string;
  bookingId: string;
  guestName: string;
  email?: string;
  phoneNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  numberOfRooms: number;
  bookingStatus: 'Pending' | 'Payment Submitted' | 'Approved' | 'Rejected' | 'Cancelled';
  paymentStatus: 'Pending' | 'Submitted' | 'Verified' | 'Failed';
  totalAmount?: number;
  createdAt: string;
}

interface UserProfile {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
}

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleCheckIn, setRescheduleCheckIn] = useState('');
  const [rescheduleCheckOut, setRescheduleCheckOut] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
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
    // Wait for auth to finish loading before checking user
    if (authLoading) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        // Assuming we have an API to get user bookings by userId
        const userBookings = await api.getUserBookings(user.uid, user.email || undefined);
        setBookings(userBookings);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    const fetchProfile = async () => {
      try {
        const userProfile = await api.getUserProfile(user.uid, user.email || undefined);
        setProfile(userProfile);
        setProfileName(userProfile.name || user.displayName || '');
        setProfilePhone(userProfile.phone || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    Promise.all([fetchBookings(), fetchProfile()]).finally(() => setLoading(false));
  }, [user, navigate, authLoading]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const updated = await api.updateUserProfile(user.uid, {
        name: profileName.trim() || undefined,
        phone: profilePhone.trim() || undefined,
        email: user.email || undefined,
      });
      setProfile(updated);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordNew || passwordNew.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }
    if (passwordNew !== passwordConfirm) {
      alert('Passwords do not match.');
      return;
    }

    try {
      setPasswordLoading(true);
      await api.changeUserPassword(user.uid, passwordCurrent, passwordNew);
      setPasswordCurrent('');
      setPasswordNew('');
      setPasswordConfirm('');
      alert('Password updated successfully.');
    } catch (error: any) {
      alert(error.message || 'Failed to update password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    setActionLoadingId(bookingId);
    try {
      await api.cancelUserBooking(user.uid, bookingId, user.email || undefined);
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId || b.bookingId === bookingId
            ? { ...b, bookingStatus: 'Cancelled' }
            : b
        )
      );
    } catch (error: any) {
      alert(error.message || 'Failed to cancel booking');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRescheduleBooking = async (booking: Booking) => {
    if (!user) return;
    if (!rescheduleCheckIn || !rescheduleCheckOut) {
      alert('Please select new check-in and check-out dates.');
      return;
    }

    setActionLoadingId(booking.id);
    try {
      const updated = await api.rescheduleUserBooking(
        user.uid,
        booking.id,
        rescheduleCheckIn,
        rescheduleCheckOut,
        user.email || undefined
      );
      setBookings((prev) => prev.map((b) => (b.id === booking.id ? updated : b)));
      setRescheduleId(null);
      setRescheduleCheckIn('');
      setRescheduleCheckOut('');
    } catch (error: any) {
      alert(error.message || 'Failed to reschedule booking');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDownloadInvoice = (booking: Booking) => {
    const invoiceHtml = `
      <html>
        <head>
          <title>Invoice - ${booking.bookingId}</title>
        </head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hotel Grill Durbar</h2>
          <p>Sauraha, Chitwan, Nepal</p>
          <hr />
          <h3>Invoice</h3>
          <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
          <p><strong>Guest Name:</strong> ${booking.guestName}</p>
          <p><strong>Phone:</strong> ${booking.phoneNumber}</p>
          <p><strong>Check-in:</strong> ${formatDate(booking.checkInDate)}</p>
          <p><strong>Check-out:</strong> ${formatDate(booking.checkOutDate)}</p>
          <p><strong>Rooms:</strong> ${booking.numberOfRooms}</p>
          <p><strong>Guests:</strong> ${booking.numberOfGuests}</p>
          <p><strong>Total Amount:</strong> NPR ${booking.totalAmount || 0}</p>
          <p><strong>Payment Status:</strong> ${booking.paymentStatus}</p>
          <p><strong>Booking Status:</strong> ${booking.bookingStatus}</p>
        </body>
      </html>
    `;

    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${booking.bookingId}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Show loading state while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-charcoal via-jade-deep to-charcoal flex items-center justify-center">
        <div className="text-pale-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-jade-deep to-charcoal">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 pt-32">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-display text-pale-white mb-2">My Profile</h1>
                <p className="text-muted-foreground">{user.displayName || profile?.name || 'Guest'}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </GlassCard>

          <div className="space-y-6">
            <GlassCard className="p-8">
              <CardHeader>
                <CardTitle className="text-pale-white">Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="mt-2 w-full rounded-md bg-charcoal-deep/50 border border-border px-3 py-2 text-pale-white"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone</label>
                    <input
                      type="text"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="mt-2 w-full rounded-md bg-charcoal-deep/50 border border-border px-3 py-2 text-pale-white"
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={handleSaveProfile} disabled={savingProfile}>
                    {savingProfile ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard className="p-8">
              <CardHeader>
                <CardTitle className="text-pale-white">Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Current Password</label>
                    <input
                      type="password"
                      value={passwordCurrent}
                      onChange={(e) => setPasswordCurrent(e.target.value)}
                      className="mt-2 w-full rounded-md bg-charcoal-deep/50 border border-border px-3 py-2 text-pale-white"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">New Password</label>
                    <input
                      type="password"
                      value={passwordNew}
                      onChange={(e) => setPasswordNew(e.target.value)}
                      className="mt-2 w-full rounded-md bg-charcoal-deep/50 border border-border px-3 py-2 text-pale-white"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Confirm Password</label>
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className="mt-2 w-full rounded-md bg-charcoal-deep/50 border border-border px-3 py-2 text-pale-white"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={handleChangePassword} disabled={passwordLoading}>
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </CardContent>
            </GlassCard>

            <GlassCard className="p-8">
              <CardHeader>
                <CardTitle className="text-pale-white">My Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading bookings...</p>
                ) : bookings.length === 0 ? (
                  <p className="text-muted-foreground">No bookings found.</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-jade-deep/30 rounded-lg p-4 bg-charcoal/30">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-pale-white">
                              Booking #{booking.bookingId}
                            </h3>
                            <p className="text-muted-foreground">
                              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <div>
                              <p className="text-xs text-muted-foreground">Booking Status</p>
                              <Badge variant={booking.bookingStatus === 'Approved' ? 'default' : booking.bookingStatus === 'Pending' ? 'secondary' : 'destructive'}>
                                {booking.bookingStatus}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Payment Status</p>
                              <Badge variant={booking.paymentStatus === 'Verified' ? 'default' : booking.paymentStatus === 'Submitted' ? 'secondary' : 'destructive'}>
                                {booking.paymentStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Guests</p>
                            <p className="text-pale-white">{booking.numberOfGuests}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Rooms</p>
                            <p className="text-pale-white">{booking.numberOfRooms}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone</p>
                            <p className="text-pale-white">{booking.phoneNumber}</p>
                          </div>
                          {booking.totalAmount && (
                            <div>
                              <p className="text-muted-foreground">Total</p>
                              <p className="text-pale-white">₹{booking.totalAmount}</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handleDownloadInvoice(booking)}
                          >
                            Download Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
