'use client';

import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useState } from 'react';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetComplete: () => void;
}

export function ResetDataModal({ isOpen, onClose, onResetComplete }: ResetDataModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch('/api/user/reset', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to delete habit data');
      }

      onResetComplete();
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting data');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-pop-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Delete All Habit Data?</h3>
            <p className="text-xs text-slate-500 font-medium">This action cannot be undone.</p>
          </div>
        </div>

        <div className="bg-red-50/80 border border-red-100 rounded-xl p-3.5 mb-5 text-xs text-red-800 space-y-1">
          <p className="font-semibold">What will be deleted:</p>
          <ul className="list-disc list-inside space-y-0.5 text-red-700">
            <li>All your tracked habits</li>
            <li>All daily habit completion entries & streaks</li>
          </ul>
          <p className="mt-2 text-[11px] text-red-600 font-medium">
            Note: Your display name, profile picture, and notification settings will be preserved.
          </p>
        </div>

        {error && (
          <div className="mb-4 text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete All Habit Data'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
