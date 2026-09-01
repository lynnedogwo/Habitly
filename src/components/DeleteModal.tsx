'use client';

import { Trash2, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  habitName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export function DeleteModal({
  isOpen,
  habitName,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-pop-in">
      <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-slate-700/50 shadow-2xl relative">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 text-rose-400 mb-3">
          <div className="p-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
            <Trash2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Delete Habit</h3>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-white">&quot;{habitName}&quot;</span>? 
          This action will permanently erase this habit and all of its recorded history.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition-all active:scale-95 disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete Habit'}
          </button>
        </div>
      </div>
    </div>
  );
}
