import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Save, Lock, User, Mail, Key } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const Settings = () => {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadAdminUser();
  }, []);

  const loadAdminUser = () => {
    try {
      const userStr = localStorage.getItem('admin_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setAdminUser(user);
        setProfileData({
          username: user.username || '',
          email: user.email || '',
        });
      }
    } catch (error) {
      console.error('Failed to load admin user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Note: This would require a backend endpoint to update admin profile
      // For now, we'll just update local storage
      const updatedUser = {
        ...adminUser,
        username: profileData.username,
        email: profileData.email,
      };
      localStorage.setItem('admin_user', JSON.stringify(updatedUser));
      setAdminUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      // Note: This would require a backend endpoint to change password
      toast.info('Password change feature requires backend implementation');
      // Reset form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-jade-bright" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-display text-pale-white mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Change Password</TabsTrigger>
          <TabsTrigger value="system">System Settings</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-display text-pale-white mb-6 flex items-center gap-2">
              <User className="text-jade-bright" size={24} />
              Profile Information
            </h2>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-pale-white/80 mb-2 block">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-pale-white/80 mb-2 block">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="bg-jade-bright hover:bg-jade-deep">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </GlassCard>
        </TabsContent>

        {/* Password Tab */}
        <TabsContent value="password">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-display text-pale-white mb-6 flex items-center gap-2">
              <Lock className="text-jade-bright" size={24} />
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <Label htmlFor="currentPassword" className="text-pale-white/80 mb-2 block">
                  Current Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword" className="text-pale-white/80 mb-2 block">
                  New Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-pale-white/80 mb-2 block">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-jade-bright" size={18} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="bg-charcoal-deep/50 border-border text-pale-white pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="bg-jade-bright hover:bg-jade-deep">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </GlassCard>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system">
          <GlassCard className="p-6">
            <h2 className="text-2xl font-display text-pale-white mb-6">System Settings</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Check-in Time</p>
                <p className="text-pale-white">12:30 PM</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Check-out Time</p>
                <p className="text-pale-white">12:00 PM</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Rooms</p>
                <p className="text-pale-white">8 Rooms</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">System Version</p>
                <p className="text-pale-white">v1.0.0</p>
              </div>
            </div>
          </GlassCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
