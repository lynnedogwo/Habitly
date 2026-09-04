'use client';

import { useState } from 'react';
import { Check, Edit2, Trash2, Flame, X, AlertCircle } from 'lucide-react';
import { DeleteModal } from './DeleteModal';

export interface DayStatus {
  date: string;
  dayLabel: string;
  dayNumber: number;
  isToday: boolean;
  done: boolean;
}

export interface HabitItem {
  id: string;
  name: string;
  createdAt: string;
  doneToday: boolean;
  streak: number;
  recentDays?: DayStatus[];
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
        className={`light-panel rounded-2xl p-5 transition-all duration-200 ${
          habit.doneToday
            ? 'border-emerald-300 bg-emerald-50/40'
            : 'hover:border-slate-300'
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
                    className="light-input px-3 py-1.5 rounded-lg text-sm font-medium w-full max-w-xs"
                  />
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    title="Save name"
                    className="p-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors cursor-pointer"
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
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {editError && (
                  <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{editError}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <h3
                  className={`text-base font-bold transition-all ${
                    habit.doneToday ? 'text-slate-800 line-through opacity-85' : 'text-slate-900'
                  }`}
                >
                  {habit.name}
                </h3>

                <button
                  onClick={() => setIsEditing(true)}
                  title="Edit habit name"
                  className="opacity-50 hover:opacity-100 text-slate-500 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Streak Counter Badge & 7-Day Streak History Row */}
            <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-100">
              {/* Existing Streak Badge */}
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  habit.streak > 0
                    ? 'bg-amber-50 border-amber-300 text-amber-800'
                    : 'bg-slate-100 border-slate-200 text-slate-500'
                }`}
              >
                <Flame
                  className={`w-3.5 h-3.5 ${
                    habit.streak > 0 ? 'text-amber-500 fill-amber-500 animate-flame' : 'text-slate-400'
                  }`}
                />
                <span>
                  {habit.streak} {habit.streak === 1 ? 'day' : 'days'} streak
                </span>
              </div>

              {/* 7-Day Visual Row */}
              {habit.recentDays && habit.recentDays.length > 0 && (
                <div className="flex items-center gap-1.5 bg-slate-50/90 p-1.5 rounded-xl border border-slate-200/70">
                  {habit.recentDays.map((day) => (
                    <div
                      key={day.date}
                      title={`${day.date} (${day.dayLabel}): ${day.done ? 'Done' : 'Not done'}`}
                      className={`flex flex-col items-center justify-center w-7 h-8 rounded-lg text-[10px] font-bold transition-all ${
                        day.done
                          ? 'bg-[#8B3DFF] text-white shadow-xs shadow-purple-500/20'
                          : 'bg-slate-100 text-slate-400 border border-slate-200/80'
                      } ${day.isToday ? 'ring-2 ring-[#8B3DFF]/40 ring-offset-1 font-black' : ''}`}
                    >
                      <span className="uppercase text-[8px] opacity-80 leading-none">{day.dayLabel.slice(0, 1)}</span>
                      <span className="leading-tight mt-0.5">{day.dayNumber}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons: Toggle Done & Delete */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleToggleDone}
              disabled={isToggling}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50 ${
                habit.doneToday
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'btn-primary shadow-purple-500/20'
              }`}
            >
              <Check className="w-4 h-4 text-white" />
              <span className="text-white font-semibold">{habit.doneToday ? 'Done Today' : 'Mark Done'}</span>
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              title="Delete habit"
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
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
