'use client';

import { useState } from 'react';
import { Check, Edit2, Trash2, Flame, X, AlertCircle } from 'lucide-react';
import { DeleteModal } from './DeleteModal';

export interface HabitItem {
  id: string;
  name: string;
  createdAt: string;
  doneToday: boolean;
  streak: number;
}

interface HabitCardProps {
  habit: HabitItem;
  onUpdate: () => void;
}

export function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(habit.name);
  const [editError, setEditError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isToggling, setIsToggling] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toggle done / unmark done for today
  const handleToggleDone = async () => {
    if (isToggling) return;
    setIsToggling(true);

    try {
      // Local ISO date (YYYY-MM-DD)
      const now = new Date();
      const localDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const res = await fetch(`/api/habits/${habit.id}/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !habit.doneToday, date: localDateStr }),
      });

      if (res.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to toggle habit status:', error);
    } finally {
      setIsToggling(false);
    }
  };

  // Save habit name edit
  const handleSaveEdit = async () => {
    const trimmed = editName.trim();
    if (!trimmed) {
      setEditError('Habit name cannot be empty');
      return;
    }

    setEditError(null);
    setIsSaving(true);

    try {
      const res = await fetch(`/api/habits/${habit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update habit');
      }

      setIsEditing(false);
      onUpdate();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error saving habit';
      setEditError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete habit
  const handleDeleteConfirm = async () => {
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/habits/${habit.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setIsDeleteModalOpen(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to delete habit:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={`glass-panel rounded-2xl p-5 transition-all duration-300 ${
          habit.doneToday
            ? 'border-emerald-500/30 bg-slate-900/60 glow-emerald'
            : 'hover:border-slate-600/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Habit Info / Edit Input */}
          <div className="flex-1 w-full sm:w-auto">
            {isEditing ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      if (editError) setEditError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') {
                        setIsEditing(false);
                        setEditName(habit.name);
                        setEditError(null);
                      }
                    }}
                    autoFocus
                    disabled={isSaving}
                    className="glass-input px-3 py-1.5 rounded-lg text-sm font-medium w-full max-w-xs"
                  />
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    title="Save name"
                    className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(habit.name);
                      setEditError(null);
                    }}
                    disabled={isSaving}
                    title="Cancel edit"
                    className="p-2 rounded-lg bg-slate-700/40 text-slate-400 hover:bg-slate-700/60 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {editError && (
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{editError}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h3
                  className={`text-base font-semibold transition-all ${
                    habit.doneToday ? 'text-white line-through opacity-90' : 'text-slate-100'
                  }`}
                >
                  {habit.name}
                </h3>

                <button
                  onClick={() => setIsEditing(true)}
                  title="Edit habit name"
                  className="opacity-60 hover:opacity-100 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800/50 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Streak Counter Badge */}
            <div className="flex items-center gap-2 mt-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  habit.streak > 0
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 glow-amber'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                }`}
              >
                <Flame
                  className={`w-3.5 h-3.5 ${
                    habit.streak > 0 ? 'text-amber-400 fill-amber-400 animate-flame' : 'text-slate-500'
                  }`}
                />
                <span>
                  {habit.streak} {habit.streak === 1 ? 'day' : 'days'} streak
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Toggle Done & Delete */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleToggleDone}
              disabled={isToggling}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 ${
                habit.doneToday
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500'
                  : 'bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700/80'
              }`}
            >
              <Check className={`w-4 h-4 ${habit.doneToday ? 'text-white' : 'text-slate-400'}`} />
              <span>{habit.doneToday ? 'Done Today' : 'Mark Done'}</span>
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              title="Delete habit"
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        habitName={habit.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
