'use client';

import { Bell, User, Calendar, Check, Sparkles } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onNotificationChange?: () => void;
}

export function Header({ title = 'Dashboard', subtitle }: HeaderProps) {
  const [formattedDate, setFormattedDate] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<{ displayName: string | null; profilePicture: string | null } | null>(null);

  const fetchUserProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUserProfile({
            displayName: data.user.displayName,
            profilePicture: data.user.profilePicture,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching user profile in header:', err);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    // Listen for custom event when profile updates in settings
    const handleProfileUpdate = () => fetchUserProfile();
    window.addEventListener('user-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('user-profile-updated', handleProfileUpdate);
  }, [fetchUserProfile]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 4000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications', { method: 'PATCH' });
      if (res.ok) {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  return (
    <header className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6 mb-8 pt-2">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm font-medium text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Date Display Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-white border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 shadow-2xs">
          <Calendar className="w-4 h-4 text-[#8B3DFF]" />
          <span>{formattedDate || 'Today'}</span>
        </div>

        {/* Notifications & Profile controls */}
        <div className="relative flex items-center gap-2 pl-2 sm:border-l sm:border-slate-200">
          {/* Notification Bell with Real Unread Count Badge */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              title="Notifications"
              className={`relative p-2.5 rounded-xl bg-white border transition-all cursor-pointer shadow-2xs group ${
                isOpen
                  ? 'border-[#8B3DFF] text-[#8B3DFF] ring-2 ring-[#8B3DFF]/20'
                  : 'border-slate-200 text-slate-600 hover:text-[#8B3DFF] hover:border-purple-200'
              }`}
            >
              <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-[#8B3DFF] text-white text-[10px] font-black shadow-md shadow-purple-500/30 animate-pop-in">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-88 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-pop-in">
                <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8B3DFF]" />
                    <h3 className="text-xs font-extrabold text-slate-900">Notifications</h3>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-[11px] font-bold text-[#8B3DFF] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Mark read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 font-medium">
                      No notifications yet. Add a habit to trigger your first notification!
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3.5 flex items-start gap-3 transition-colors ${
                          !n.read ? 'bg-purple-50/50' : 'bg-white'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? 'bg-[#8B3DFF]' : 'bg-slate-300'}`} />
                        <div className="flex-1">
                          <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                            {n.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Display Header Badge */}
          <div
            className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-white border border-slate-200 shadow-2xs group"
          >
            {userProfile?.profilePicture ? (
              <img
                src={userProfile.profilePicture}
                alt="Profile"
                className="w-7 h-7 rounded-lg object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#8B3DFF] flex items-center justify-center font-bold text-xs group-hover:bg-[#8B3DFF] group-hover:text-white transition-colors">
                <User className="w-4 h-4" />
              </div>
            )}
            <span className="text-xs font-bold text-slate-700 group-hover:text-[#8B3DFF] transition-colors hidden md:inline">
              {userProfile?.displayName || 'User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
