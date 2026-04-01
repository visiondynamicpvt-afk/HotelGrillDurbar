import { Navigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      // Optimistically set as authenticated if token exists
      // This allows immediate navigation after login
      setIsAuthenticated(true);

      // Verify token in background
      try {
        const result = await api.verifyToken(token);
        console.log('Verify result:', result);
        if (result && result.success !== false) {
          setIsAuthenticated(true);
        } else {
          // If verification fails, clear and redirect
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setIsAuthenticated(false);
        }
      } catch (error: any) {
        console.error('Auth verification error:', error);
        
        // Check if it's a network error (backend not running)
        const errorMessage = error.message || '';
        const isNetworkError = errorMessage.includes('Failed to fetch') || 
                              errorMessage.includes('NetworkError') ||
                              errorMessage.includes('ERR_CONNECTION_REFUSED') ||
                              errorMessage.includes('Network request failed');
        
        // Check status code if available
        const statusCode = error.status;
        
        if (isNetworkError) {
          // Backend might not be running - keep authenticated state
          // User can still use the app if backend comes online
          console.warn('Backend server might not be running. Keeping authenticated state.');
          setIsAuthenticated(true);
        } else if (statusCode === 401 || statusCode === 403) {
          // Clear token on auth errors (401 Unauthorized, 403 Forbidden)
          console.warn('Token invalid or expired. Clearing authentication.');
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setIsAuthenticated(false);
        } else {
          // Other errors (500, etc.) - might be temporary, keep authenticated
          console.warn('Verification error, but keeping authenticated state:', error);
          setIsAuthenticated(true);
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-jade-bright" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
