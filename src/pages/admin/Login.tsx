import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock, User, Shield } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { useNoIndex } from '@/hooks/useNoIndex';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  useNoIndex();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    setLoading(true);
    try {
      const result = await api.login(username, password);
      console.log('Login result:', result);
      localStorage.setItem('admin_token', result.token);
      localStorage.setItem('admin_user', JSON.stringify(result.user));
      toast.success('Login successful!');
      // Navigate immediately
      navigate('/admin/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-jade-deep/20 to-charcoal flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-jade-bright/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8 border-jade-bright/20">
          {/* Header with Icon */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-jade-bright/20 mb-4"
            >
              <Shield className="w-8 h-8 text-jade-bright" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-display text-pale-white mb-2">Admin Portal</h1>
            <p className="text-muted-foreground text-sm md:text-base">Hotel Grill Durbar Management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Label htmlFor="username" className="text-pale-white/80 mb-2 block text-sm font-medium">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="bg-charcoal-deep/50 border-jade-bright/20 focus:border-jade-bright text-pale-white pl-10 transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Label htmlFor="password" className="text-pale-white/80 mb-2 block text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="bg-charcoal-deep/50 border-jade-bright/20 focus:border-jade-bright text-pale-white pl-10 transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-jade-bright to-jade-deep hover:from-jade-bright/80 hover:to-jade-deep/80 text-white font-semibold py-2 h-auto transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Login to Admin Panel
                  </>
                )}
              </Button>
            </motion.div>
          </form>

          {/* Security Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-4 rounded-lg bg-jade-bright/5 border border-jade-bright/20"
          >
            <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
              <Shield size={14} className="text-jade-bright" />
              Secure admin access only. Unauthorized access is prohibited.
            </p>
          </motion.div>
        </GlassCard>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-xs text-muted-foreground"
        >
          <p>© 2024 Hotel Grill Durbar. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
