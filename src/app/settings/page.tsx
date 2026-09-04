'use client';

import { Settings, SlidersHorizontal } from 'lucide-react';
import { Header } from '@/components/Header';

export default function SettingsPage() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
      {/* Top Header */}
      <Header
        title="Settings"
        subtitle="Application configuration and user preferences"
      />

      {/* Placeholder Content */}
      <div className="light-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center max-w-xl mx-auto border-dashed border-slate-300 my-8">
        <div className="p-4 bg-purple-50 text-[#8B3DFF] rounded-2xl mb-4 border border-purple-100 shadow-xs">
          <Settings className="w-8 h-8 animate-spin-slow" />
        </div>
        
        <h2 className="text-xl font-bold text-slate-900 mb-2">Settings</h2>
        
        <p className="text-sm font-medium text-slate-600 mb-4 bg-slate-100 px-4 py-2 rounded-xl inline-flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#8B3DFF]" />
          <span>Settings coming soon.</span>
        </p>

        <p className="text-xs text-slate-400 max-w-md">
          Custom themes, notification frequencies, and account preferences will be configurable here in a future update.
        </p>
      </div>
    </main>
  );
}
