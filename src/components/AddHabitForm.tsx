'use client';

import { useState } from 'react';
import { PlusCircle, AlertCircle } from 'lucide-react';

interface AddHabitFormProps {
  onHabitAdded: () => void;
}

export function AddHabitForm({ onHabitAdded }: AddHabitFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Please enter a habit name.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create habit');
      }

      setName('');
      onHabitAdded();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred while creating the habit';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="glass-panel p-4 md:p-6 rounded-2xl">
        <label htmlFor="habit-name-input" className="block text-sm font-semibold text-slate-300 mb-2">
          Add New Habit
        </label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="habit-name-input"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g., Morning Exercise, Read 20 mins, Drink 2L Water..."
            disabled={isSubmitting}
            className="glass-input flex-1 px-4 py-3 rounded-xl text-sm placeholder-slate-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-violet-500/25 active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{isSubmitting ? 'Adding...' : 'Add Habit'}</span>
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-3 text-rose-400 text-xs font-medium animate-pop-in">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
}
