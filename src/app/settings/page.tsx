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
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl w-full mx-auto space-y-6">
      {/* Header */}
      <Header
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
      <div className="space-y-6">
        {/* SECTION 1: THEME PREFERENCES */}
        <section className="light-panel p-6 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-50 text-[#8B3DFF] rounded-xl">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">1. Theme (Light / Dark Mode)</h2>
              <p className="text-xs text-slate-500 font-medium">
                Choose your preferred visual appearance across the app. Stored in your browser.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all cursor-pointer ${
                theme === 'light'
                  ? 'border-[#8B3DFF] bg-purple-50/70 text-[#8B3DFF] ring-2 ring-[#8B3DFF]/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>Light Mode</span>
              {theme === 'light' && <Check className="w-3.5 h-3.5 ml-auto" />}
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`p-3.5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-xs transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#8B3DFF] bg-purple-950/40 text-[#8B3DFF] ring-2 ring-[#8B3DFF]/20 shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>Dark Mode</span>
              {theme === 'dark' && <Check className="w-3.5 h-3.5 ml-auto" />}
            </button>
          </div>
        </section>

        {/* SECTION 2: NOTIFICATION PREFERENCES */}
        <section className="light-panel p-6 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-purple-50 text-[#8B3DFF] rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">2. Notification Preferences</h2>
                <p className="text-xs text-slate-500 font-medium max-w-lg">
                  Master switch for all notifications. When off, no in-app alerts or push messages will be generated. Stored on your User record.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleNotifications}
              disabled={notifSaving || isLoadingUser}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                notificationsEnabled ? 'bg-[#8B3DFF]' : 'bg-slate-300'
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

        {/* SECTION 3: DISPLAY NAME */}
        <section className="light-panel p-6 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-50 text-[#8B3DFF] rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">3. Display Name</h2>
              <p className="text-xs text-slate-500 font-medium">
                Set a label to personalize your dashboard header.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveDisplayName} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              disabled={isLoadingUser}
              className="light-input flex-1 px-4 py-2.5 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#8B3DFF]/20"
            />
            <button
              type="submit"
              disabled={nameSaving || isLoadingUser}
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {nameSaving ? 'Saving...' : 'Save Name'}
            </button>
          </form>

          {nameSuccess && (
            <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-pop-in">
              <Check className="w-4 h-4" /> Display name updated!
            </p>
          )}
        </section>

        {/* SECTION 4: DISPLAY PICTURE */}
        <section className="light-panel p-6 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-50 text-[#8B3DFF] rounded-xl">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">4. Display Picture</h2>
              <p className="text-xs text-slate-500 font-medium">
                Upload a custom avatar (PNG or JPG, max 1MB). Stored directly in database.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile Preview"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-purple-100 text-[#8B3DFF] flex items-center justify-center font-bold text-xl border-2 border-purple-200">
                <User className="w-8 h-8" />
              </div>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <label className="btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-2">
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
                    className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Supported formats: PNG, JPG (Max 1MB)
              </span>
            </div>
          </div>

          {imageError && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pop-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{imageError}</span>
            </div>
          )}

          {imageSuccess && (
            <p className="mt-2 text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-pop-in">
              <Check className="w-4 h-4" /> Profile picture updated!
            </p>
          )}
        </section>

        {/* SECTION 5: REAL PUSH NOTIFICATIONS */}
        <section className="light-panel p-6 rounded-2xl shadow-xs border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-purple-50 text-[#8B3DFF] rounded-xl">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">5. Real Web Push Notifications</h2>
              <p className="text-xs text-slate-500 font-medium">
                Receive browser push notifications using Web Push API & VAPID keys even when app tab is closed.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
              <span className="font-semibold text-slate-700">Browser Permission Status:</span>
              <span
                className={`font-extrabold uppercase px-2.5 py-1 rounded-lg text-[10px] ${
                  pushPermission === 'granted'
                    ? 'bg-emerald-100 text-emerald-800'
                    : pushPermission === 'denied'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {pushPermission}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={pushLoading || pushPermission === 'granted'}
                className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
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
                  className="px-4 py-2.5 rounded-xl border border-purple-300 text-[#8B3DFF] hover:bg-purple-50 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testPushLoading ? 'Sending...' : 'Send Test Push Notification'}</span>
                </button>
              )}
            </div>

            {!notificationsEnabled && pushPermission === 'granted' && (
              <p className="text-xs font-semibold text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Notifications are turned off in Preference #2. Push notifications are currently blocked.</span>
              </p>
            )}

            {pushMessage && (
              <div
                className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 animate-pop-in ${
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

        {/* SECTION 6: DANGER ZONE - DELETE ALL HABIT DATA */}
        <section className="bg-red-50/50 border border-red-200/80 p-6 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-red-950">6. Delete All Habit Data (Reset App)</h2>
                <p className="text-xs text-red-700/80 font-medium max-w-lg">
                  Permanently remove all habits and entry history. Your profile and settings will not be affected. Requires confirmation.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer"
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
