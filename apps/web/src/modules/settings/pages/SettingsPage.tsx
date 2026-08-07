import React, { useState } from 'react';
import { User, Bell, Shield, Database, Globe, Moon, Sun, Check, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { usersApi } from '@/api/users.api';
import { useToast } from '@/components/ui/Toast';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & RBAC', icon: Shield },
  { id: 'system', label: 'System', icon: Database },
];

const DEFAULT_NOTIFICATIONS = [
  { label: 'License Expiry Alerts', desc: 'Get notified when driver licenses are about to expire', enabled: true },
  { label: 'Vehicle In-Shop Alerts', desc: 'Notify when a vehicle enters or exits maintenance', enabled: true },
  { label: 'Trip Completion Updates', desc: 'Receive updates when trips are completed or cancelled', enabled: false },
  { label: 'Expense Approval Requests', desc: 'Get alerts when new expenses are submitted for review', enabled: true },
  { label: 'Fleet Utilization Reports', desc: 'Weekly summary of fleet performance metrics', enabled: false },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { success, error: toastError } = useToast();

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const { register: registerProfile, handleSubmit: handleProfileSubmit } = useForm({
    defaultValues: {
      firstName: user?.firstName || 'Alex',
      lastName: user?.lastName || 'Morgan',
      email: user?.email || 'alex@transitops.com',
      phone: '+91 98765 43210'
    }
  });

  const onProfileSubmit = async (data: any) => {
    setIsSavingProfile(true);
    try {
      await usersApi.updateProfile(data);
      success('Profile updated', 'Your changes have been saved successfully.');
    } catch {
      toastError('Update failed', 'Could not save your profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const toggleNotification = (index: number) => {
    setNotifications((prev) =>
      prev.map((n, i) => (i === index ? { ...n, enabled: !n.enabled } : n))
    );
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div>
          <p className="mb-1 text-sm text-muted-foreground">Configuration</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">Settings</h1>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar Tabs */}
        <nav className="lg:w-64 shrink-0 rounded-lg border border-border bg-card p-2 h-fit shadow-sm">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  active 
                    ? 'bg-secondary text-foreground' 
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}>
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
          <div className="mt-2 pt-2 border-t border-border">
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-semibold text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4 shrink-0" />
              Sign Out
            </button>
          </div>
        </nav>

        {/* Content Panel */}
        <div className="flex-1 space-y-5">
          {activeTab === 'profile' && (
            <>
              {/* Profile Card */}
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-base font-bold mb-6">Profile Information</h2>
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-border">
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xl font-bold shadow-sm">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : 'AM'}
                  </div>
                  <div>
                    <div className="font-bold text-lg">{user ? `${user.firstName} ${user.lastName}` : 'Alex Morgan'}</div>
                    <div className="text-sm text-muted-foreground">{user?.email || 'alex@transitops.com'}</div>
                    <span className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground">Fleet Manager</span>
                  </div>
                  <button type="button" className="ml-auto h-9 px-4 text-sm font-semibold rounded-md border border-input bg-background hover:bg-accent transition-colors shadow-sm">
                    Change Photo
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5">First Name</label>
                      <input {...registerProfile('firstName')} type="text"
                        className="w-full h-9 px-3 bg-muted/50 border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-ring/30 outline-none transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5">Last Name</label>
                      <input {...registerProfile('lastName')} type="text"
                        className="w-full h-9 px-3 bg-muted/50 border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-ring/30 outline-none transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5">Email Address</label>
                      <input {...registerProfile('email')} type="email"
                        className="w-full h-9 px-3 bg-muted/50 border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-ring/30 outline-none transition-shadow" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1.5">Phone Number</label>
                      <input {...registerProfile('phone')} type="tel"
                        className="w-full h-9 px-3 bg-muted/50 border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-ring/30 outline-none transition-shadow" />
                    </div>
                </div>
                <div className="flex justify-end mt-6 pt-6 border-t border-border">
                  <button type="submit" disabled={isSavingProfile} className="h-9 px-6 bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold rounded-md shadow-sm transition-opacity disabled:opacity-50">
                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>

              {/* Theme Card */}
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <h2 className="text-base font-bold mb-4">Appearance</h2>
                <div className="flex gap-3">
                  {[
                    { value: 'light', label: 'Light Mode', icon: Sun },
                    { value: 'dark', label: 'Dark Mode', icon: Moon },
                    { value: 'system', label: 'System Default', icon: Globe },
                  ].map(opt => {
                    const Icon = opt.icon;
                    const active = theme === opt.value;
                    return (
                      <button key={opt.value} onClick={() => setTheme(opt.value)}
                        className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-lg border-2 transition-colors text-sm font-semibold ${
                          active 
                            ? 'border-primary bg-secondary text-primary' 
                            : 'border-transparent bg-muted/50 text-muted-foreground hover:bg-muted'
                        }`}>
                        <Icon className="h-5 w-5" />
                        {opt.label}
                        {active && <Check className="h-4 w-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="text-base font-bold mb-6">Notification Preferences</h2>
              <div className="space-y-1">
                {notifications.map((n, i) => (
                  <div key={n.label} className={`flex items-center justify-between py-4 ${i !== 0 ? 'border-t border-border' : ''}`}>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{n.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{n.desc}</div>
                    </div>
                    <button
                      onClick={() => toggleNotification(i)}
                      aria-checked={n.enabled}
                      role="switch"
                      aria-label={`Toggle ${n.label}`}
                      className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${n.enabled ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-primary-foreground shadow transition-transform ${n.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}


          {activeTab === 'security' && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="text-base font-bold mb-6">Roles & Permissions (RBAC)</h2>
              <div className="space-y-3">
                {[
                  { role: 'Fleet Manager', users: 3, colorClass: 'text-primary', bgClass: 'bg-primary/10', perms: ['All Vehicles', 'All Drivers', 'Maintenance', 'Fleet Reports'] },
                  { role: 'Dispatcher', users: 5, colorClass: 'text-success', bgClass: 'bg-success/10', perms: ['Create Trips', 'Assign Drivers', 'View Vehicles', 'Monitor Trips'] },
                  { role: 'Driver', users: 42, colorClass: 'text-warning', bgClass: 'bg-warning/10', perms: ['View Own Trips', 'Fuel Entry', 'Expense Entry', 'Odometer Update'] },
                  { role: 'Safety Officer', users: 2, colorClass: 'text-destructive', bgClass: 'bg-destructive/10', perms: ['License Verification', 'Suspend Drivers', 'Safety Reports'] },
                  { role: 'Financial Analyst', users: 2, colorClass: 'text-[#8B5CF6]', bgClass: 'bg-[#8B5CF6]/10', perms: ['Fuel Reports', 'Expense Reports', 'ROI Analysis'] },
                ].map(r => (
                  <div key={r.role} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold ${r.bgClass} ${r.colorClass}`}>
                        {r.role[0]}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{r.role}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{r.users} users · {r.perms.slice(0, 2).join(', ')}{r.perms.length > 2 ? ` +${r.perms.length - 2} more` : ''}</div>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="text-base font-bold mb-6">System Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { label: 'Company Name', value: 'TransitOps Ltd.' },
                  { label: 'Default Currency', value: 'INR (₹)' },
                  { label: 'Timezone', value: 'Asia/Kolkata (IST)' },
                  { label: 'Date Format', value: 'DD-MM-YYYY' },
                  { label: 'Distance Unit', value: 'Kilometers (km)' },
                  { label: 'Fuel Unit', value: 'Liters (L)' },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-xs font-bold text-muted-foreground mb-1.5">{field.label}</label>
                    <input defaultValue={field.value}
                      className="w-full h-9 px-3 bg-muted/50 border border-border rounded-md text-sm text-foreground focus:ring-2 focus:ring-ring/30 outline-none transition-shadow" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6 pt-6 border-t border-border">
                <button className="h-9 px-6 bg-primary hover:opacity-90 text-primary-foreground text-sm font-semibold rounded-md shadow-sm transition-opacity">
                  Save System Settings
                </button>
              </div>
            </div>
          )}
        </div >
      </div>
    </div>
  );
}
