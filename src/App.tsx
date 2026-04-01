import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Booking from "./pages/Booking";
import BookingFormPage from "./pages/BookingFormPage";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Profile from "./pages/user/Profile";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Bookings from "./pages/admin/Bookings";
import BookingDetail from "./pages/admin/BookingDetail";
import Settings from "./pages/admin/Settings";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const LegacyAdminBookingRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/admin/dashboard/bookings/${id ?? ''}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/book" element={<BookingFormPage />} />
            <Route path="/booking/:bookingId" element={<Booking />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/bookings" element={<Navigate to="/admin/dashboard/bookings" replace />} />
            <Route path="/admin/bookings/:id" element={<LegacyAdminBookingRedirect />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/bookings"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Bookings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/bookings/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <BookingDetail />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard/settings"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Settings />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;