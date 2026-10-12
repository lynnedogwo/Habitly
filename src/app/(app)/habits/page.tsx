'use client';

import { useState, useEffect, useCallback } from 'react';
import { Flame, CheckSquare } from 'lucide-react';
import { Header } from '@/components/Header';
import { AddHabitForm } from '@/components/AddHabitForm';
import { HabitCard, HabitItem } from '@/components/HabitCard';

export default function MyHabitsPage() {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch habits from API
  const fetchHabits = useCallback(async () => {
    try {
      const now = new Date();
      const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

      const res = await fetch(`/api/habits?today=${localToday}`);
      if (!res.ok) throw new Error('Failed to load habits');
      const data = await res.json();
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
      {/* Top Header */}
      <Header
        title="My Habits"
        subtitle="Manage habits with add, edit, delete, and completion controls"
      />

      {/* Add Habit Form */}
      <AddHabitForm onHabitAdded={fetchHabits} />

      {/* Habit List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#8B3DFF]" />
            <span>Your Habits</span>
          </h2>
          {habits.length > 0 && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {habits.length} {habits.length === 1 ? 'habit' : 'habits'} total
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="light-panel h-28 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="light-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center border-dashed border-slate-300">
            <div className="p-4 bg-purple-50 text-[#8B3DFF] rounded-2xl mb-4 border border-purple-100">
              <Flame className="w-8 h-8 animate-flame" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No habits added yet</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Use the form above to add your first habit and start tracking daily progress!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} onUpdate={fetchHabits} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
