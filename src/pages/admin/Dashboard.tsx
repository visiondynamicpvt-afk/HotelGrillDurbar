import { useEffect, useState } from 'react';
import { adminApi, Booking } from '@/lib/api';
import { Calendar, Users, DollarSign, Clock, TrendingUp } from 'lucide-react';
import GlassCard from '@/components/UI/GlassCard';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingApprovals: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [allBookings, pendingBookings] = await Promise.all([
        adminApi.getAllBookings(),
        adminApi.getAllBookings({ status: 'Payment Submitted' }),
      ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayCheckIns = allBookings.data.filter((booking) => {
        const checkIn = new Date(booking.checkInDate);
        checkIn.setHours(0, 0, 0, 0);
        return checkIn.getTime() === today.getTime() && booking.bookingStatus === 'Approved';
      });

      const todayCheckOuts = allBookings.data.filter((booking) => {
        const checkOut = new Date(booking.checkOutDate);
        checkOut.setHours(0, 0, 0, 0);
        return checkOut.getTime() === today.getTime() && booking.bookingStatus === 'Approved';
      });

      setStats({
        totalBookings: allBookings.count,
        pendingApprovals: pendingBookings.count,
        todayCheckIns: todayCheckIns.length,
        todayCheckOuts: todayCheckOuts.length,
      });

      setRecentBookings(allBookings.data.slice(0, 5));
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
    },
    {
      title: "Today's Check-ins",
      value: stats.todayCheckIns,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
    },
    {
      title: "Today's Check-outs",
      value: stats.todayCheckOuts,
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-display text-pale-white mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-display text-pale-white">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Recent Bookings */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display text-pale-white">Recent Bookings</h2>
          <Link to="/admin/dashboard/bookings">
            <Button variant="ghost">View All</Button>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No bookings yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Guest</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-border/50 hover:bg-charcoal-deep/30">
                    <td className="py-3 px-4">
                      <Link
                        to={`/admin/dashboard/bookings/${booking._id}`}
                        className="text-jade-bright hover:underline"
                      >
                        {booking.bookingId}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-pale-white">{booking.guestName}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-pale-white">
                      NPR {booking.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.bookingStatus === 'Approved'
                            ? 'bg-green-400/20 text-green-400'
                            : booking.bookingStatus === 'Payment Submitted'
                            ? 'bg-yellow-400/20 text-yellow-400'
                            : 'bg-blue-400/20 text-blue-400'
                        }`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Dashboard;
