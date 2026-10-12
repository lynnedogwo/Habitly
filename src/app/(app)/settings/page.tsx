'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import {
  Sun,
  Moon,
  Bell,
  User,
  Upload,
  Trash2,
  Check,
  AlertCircle,
  ShieldAlert,
  Send,
  Sparkles,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Header } from '@/components/Header';
import { ResetDataModal } from '@/components/ResetDataModal';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function SettingsPage() {
  // Feature 1: Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Feature 2: Notification Preferences & User Profile
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Status & Feedback states
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSuccess, setImageSuccess] = useState(false);
  const [notifSaving, setNotifSaving] = useState(false);

  // Feature 5: Web Push States
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [pushLoading, setPushLoading] = useState(false);
  const [pushMessage, setPushMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [testPushLoading, setTestPushLoading] = useState(false);

  // Feature 6: Reset Data Modal State
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // 1. Initialize Theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Toggle Theme Function
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 2. Load User Profile & Preferences from DB
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setDisplayName(data.user.displayName || '');
            setProfilePicture(data.user.profilePicture || null);
            setNotificationsEnabled(data.user.notificationsEnabled ?? true);
          }
        }
      } catch (err) {
        console.error('Failed to load user settings:', err);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  // Check Web Push Permission Status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermission(Notification.permission);
    } else {
      setPushPermission('unsupported');
    }
  }, []);

  // 3. Save Display Name
  const handleSaveDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameSaving(true);
    setNameSuccess(false);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName }),
      });
      if (res.ok) {
        setNameSuccess(true);
        window.dispatchEvent(new Event('user-profile-updated'));
        setTimeout(() => setNameSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setNameSaving(false);
    }
  };

  // 4. Handle Profile Picture Upload (<1MB, PNG/JPG validation)
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError(null);
    setImageSuccess(false);

    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setImageError('Invalid file type. Please upload a JPG or PNG image.');
      return;
    }

    // Validate size (max 1MB = 1,048,576 bytes)
    const MAX_SIZE = 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setImageError('File size exceeds 1MB limit. Please select a smaller image.');
      return;
    }

    setImageUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Data = reader.result as string;
        const res = await fetch('/api/user', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profilePicture: base64Data }),
        });

        if (res.ok) {
          setProfilePicture(base64Data);
          setImageSuccess(true);
          window.dispatchEvent(new Event('user-profile-updated'));
          setTimeout(() => setImageSuccess(false), 3000);
        } else {
          setImageError('Failed to save profile picture.');
        }
        setImageUploading(false);
      };
      reader.onerror = () => {
        setImageError('Failed to read image file.');
        setImageUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setImageError('An unexpected error occurred during image upload.');
      setImageUploading(false);
    }
  };

  // Remove Profile Picture
  const handleRemovePicture = async () => {
    setImageUploading(true);
    setImageError(null);
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profilePicture: null }),
      });
      if (res.ok) {
        setProfilePicture(null);
        window.dispatchEvent(new Event('user-profile-updated'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImageUploading(false);
    }
  };

  // 2. Toggle Notifications Preference
  const handleToggleNotifications = async () => {
    const nextVal = !notificationsEnabled;
    setNotificationsEnabled(nextVal);
    setNotifSaving(true);
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationsEnabled: nextVal }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setNotifSaving(false);
    }
  };

  // 5. Enable Web Push Notifications
  const handleEnablePush = async () => {
    setPushLoading(true);
    setPushMessage(null);

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setPushMessage({ type: 'error', text: 'Web Push is not supported in this browser.' });
      setPushLoading(false);
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);

      if (permission !== 'granted') {
        setPushMessage({
          type: 'error',
          text: 'Push notification permission was denied or dismissed.',
        });
        setPushLoading(false);
        return;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        setPushMessage({ type: 'error', text: 'VAPID public key not configured.' });
        setPushLoading(false);
        return;
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      // Subscribe user
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
      }

      // Send subscription to server
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      });

      if (res.ok) {
        setPushMessage({
          type: 'success',
          text: 'Web Push Notifications successfully enabled and subscribed!',
        });
      } else {
        setPushMessage({ type: 'error', text: 'Failed to save push subscription on server.' });
      }
    } catch (err: any) {
      console.error('Error enabling push:', err);
      setPushMessage({ type: 'error', text: err.message || 'Failed to enable push notifications.' });
    } finally {
      setPushLoading(false);
    }
  };

  // Trigger Test Push
  const handleSendTestPush = async () => {
    setTestPushLoading(true);
    setPushMessage(null);
    try {
      const res = await fetch('/api/push/send-test', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        setPushMessage({
          type: 'success',
          text: 'Test push notification sent! Check your desktop notifications.',
        });
      } else {
        setPushMessage({
          type: 'error',
          text: data.error || 'Failed to send test push notification.',
        });
      }
    } catch (err: any) {
      setPushMessage({ type: 'error', text: 'Error sending test push notification.' });
    } finally {
      setTestPushLoading(false);
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-5">
      {/* Header */}
      <Header
        breadcrumb="Settings"
        title="Settings"
        subtitle="Customize your display preferences, notification channels, and account data"
      />

      {resetSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl flex items-center gap-3 animate-pop-in text-sm font-semibold">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>All habit data has been reset successfully. App returned to initial empty state.</span>
        </div>
      )}

      {/* Settings Grid Sections */}
      <div className="space-y-4">
        {/* SECTION 1: PROFILE (DISPLAY NAME & DISPLAY PICTURE - NOW AT TOP) */}
        <section className="light-panel p-5 sm:p-6 rounded-2xl shadow-2xs border border-slate-200/90">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 bg-purple-50 dark:bg-purple-950/60 text-[#8B3DFF] rounded-lg shrink-0">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Profile</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-4">
            Manage your display picture and user display name.
          </p>

          <div className="flex flex-col sm:flex-row sm:items-start gap-6 pt-1">
            {/* Avatar Column (Left) */}
            <div className="flex flex-col items-center sm:items-start gap-2.5 shrink-0">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-purple-200 dark:border-purple-800 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-950/80 text-[#8B3DFF] flex items-center justify-center font-bold text-2xl border-2 border-purple-200 dark:border-purple-800">
                  <User className="w-9 h-9" />
                </div>
              )}

              <div className="flex flex-col items-center sm:items-start gap-1.5">
                <div className="flex items-center gap-2">
                  <label className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{imageUploading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                      className="hidden"
                    />
                  </label>

                  {profilePicture && (
                    <button
                      type="button"
                      onClick={handleRemovePicture}
                      disabled={imageUploading}
                      className="px-2.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Supported formats: PNG, JPG (Max 1MB)
                </span>
              </div>

              {imageError && (
                <div className="p-2.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-pop-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{imageError}</span>
                </div>
              )}

              {imageSuccess && (
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-pop-in">
                  <Check className="w-4 h-4" /> Profile picture updated!
                </p>
              )}
            </div>

            {/* Display Name Column (Right) */}
            <div className="flex-1 w-full space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Display Name
              </label>
              <form onSubmit={handleSaveDisplayName} className="flex items-center gap-2.5 max-w-md">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  disabled={isLoadingUser}
                  className="light-input flex-1 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 focus:ring-2 focus:ring-[#8B3DFF]/20 focus:border-[#8B3DFF] outline-none"
                />
                <button
                  type="submit"
                  disabled={nameSaving || isLoadingUser}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                >
                  {nameSaving ? 'Saving...' : 'Save Name'}
                </button>
              </form>

              {nameSuccess && (
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-pop-in pt-1">
                  <Check className="w-4 h-4" /> Display name updated!
                </p>
              )}
            </div>
          </div>
        </section>

        {/* SECTION 2: THEME PREFERENCES (ACTIVATED BY TOGGLE) */}
        <section className="light-panel p-5 sm:p-6 rounded-2xl shadow-2xs border border-slate-200/90">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-1.5 bg-purple-50 dark:bg-purple-950/60 text-[#8B3DFF] rounded-lg shrink-0">
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Theme</h2>
              </div>
              <p className="text-xs text-slate-500 font-medium max-w-lg">
                Choose your preferred visual appearance across the app ({theme === 'dark' ? 'Dark Mode' : 'Light Mode'}).
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                type="button"
                onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  theme === 'dark' ? 'bg-[#8B3DFF]' : 'bg-slate-300 dark:bg-slate-600'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: NOTIFICATION PREFERENCES */}
        <section className="light-panel p-5 sm:p-6 rounded-2xl shadow-2xs border border-slate-200/90">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-1.5 bg-purple-50 dark:bg-purple-950/60 text-[#8B3DFF] rounded-lg shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Notification Preferences</h2>
              </div>
              <p className="text-xs text-slate-500 font-medium max-w-lg">
                Master switch for all notifications. When off, no in-app alerts or push messages will be generated. Stored on your User record.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleNotifications}
              disabled={notifSaving || isLoadingUser}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notificationsEnabled ? 'bg-[#8B3DFF]' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </section>

        {/* SECTION 4: REAL PUSH NOTIFICATIONS */}
        <section className="light-panel p-5 sm:p-6 rounded-2xl shadow-2xs border border-slate-200/90">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 bg-purple-50 dark:bg-purple-950/60 text-[#8B3DFF] rounded-lg shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Real Web Push Notifications</h2>
          </div>
          <p className="text-xs text-slate-500 font-medium mb-3.5">
            Receive browser push notifications using Web Push API & VAPID keys even when app tab is closed.
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Browser Permission Status:</span>
              <span
                className={`font-extrabold uppercase px-2.5 py-0.5 rounded-lg text-[10px] ${
                  pushPermission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : pushPermission === 'denied'
                    ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {pushPermission}
              </span>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={pushLoading || pushPermission === 'granted'}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                <Bell className="w-4 h-4" />
                <span>
                  {pushPermission === 'granted'
                    ? 'Push Notifications Active'
                    : pushLoading
                    ? 'Requesting Permission...'
                    : 'Enable Push Notifications'}
                </span>
              </button>

              {pushPermission === 'granted' && (
                <button
                  type="button"
                  onClick={handleSendTestPush}
                  disabled={testPushLoading || !notificationsEnabled}
                  className="px-4 py-2 rounded-xl border border-purple-300 text-[#8B3DFF] hover:bg-purple-50 dark:hover:bg-purple-950/30 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testPushLoading ? 'Sending...' : 'Send Test Push Notification'}</span>
                </button>
              )}
            </div>

            {!notificationsEnabled && pushPermission === 'granted' && (
              <p className="text-xs font-semibold text-amber-600 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notifications are turned off in Preference #2. Push notifications are currently blocked.</span>
              </p>
            )}

            {pushMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pop-in ${
                  pushMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {pushMessage.type === 'success' ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{pushMessage.text}</span>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 5: DANGER ZONE - DELETE ALL HABIT DATA */}
        <section className="bg-red-50/50 dark:bg-red-950/20 border border-red-200/80 dark:border-red-900/40 p-5 sm:p-6 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="p-1.5 bg-red-100 dark:bg-red-950/60 text-red-600 rounded-lg shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-extrabold text-red-950 dark:text-red-400 tracking-tight">Delete All Data (Reset App)</h2>
              </div>
              <p className="text-xs text-red-700/80 dark:text-red-400/80 font-medium max-w-lg">
                Permanently remove all habits and entry history. Your profile and settings will not be affected. Requires confirmation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All Data</span>
            </button>
          </div>
        </section>
      </div>

      {/* Reset Confirmation Modal */}
      <ResetDataModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onResetComplete={() => {
          setResetSuccess(true);
          setTimeout(() => setResetSuccess(false), 5000);
        }}
      />
    </main>
  );
}
