'use client';

import { useState, useEffect, useCallback } from 'react';
import { Flame, Calendar, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { AddHabitForm } from '@/components/AddHabitForm';
import { HabitCard, HabitItem } from '@/components/HabitCard';

export default function HomePage() {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedDate, setFormattedDate] = useState('');

  // Format local date for header
  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    setFormattedDate(today.toLocaleDateString(undefined, options));
  }, []);

  // Fetch habits from API
  const fetchHabits = useCallback(async () => {
    try {
      // Pass local date ISO string YYYY-MM-DD
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

  // Derived dashboard statistics
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) => h.doneToday).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const completionPercentage = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  return (
    <main className="min-h-screen pb-16 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <header className="max-w-4xl mx-auto pt-8 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-gradient-to-tr from-amber-500 to-violet-600 rounded-xl shadow-lg shadow-violet-500/20">
                <Flame className="w-6 h-6 text-white animate-flame" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Habit<span className="text-violet-400">ly</span>
              </h1>
            </div>
            <p className="text-sm text-slate-400">
              Track daily habits and build consistent long-term streaks.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-800/60 border border-slate-700/50 px-4 py-2 rounded-xl text-xs font-medium text-slate-300">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span>{formattedDate || 'Today'}</span>
          </div>
        </div>

        {/* Overview Stats Bar */}
        {totalHabits > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Completed Today</p>
                <p className="text-lg font-bold text-white">
                  {completedTodayCount} <span className="text-xs text-slate-400 font-normal">/ {totalHabits}</span>
                </p>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Best Current Streak</p>
                <p className="text-lg font-bold text-amber-300">
                  {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
                </p>
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl flex items-center gap-3">
              <div className="p-2.5 bg-violet-500/10 text-violet-400 rounded-xl border border-violet-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium text-slate-400">Today&apos;s Progress</p>
                  <p className="text-xs font-bold text-violet-400">{completionPercentage}%</p>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-violet-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto">
        {/* Add Habit Form */}
        <AddHabitForm onHabitAdded={fetchHabits} />

        {/* Habit List */}
        <section>
          <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center justify-between">
            <span>Your Daily Habits</span>
            {totalHabits > 0 && (
              <span className="text-xs font-medium text-slate-400">
                {totalHabits} {totalHabits === 1 ? 'habit' : 'habits'} total
              </span>
            )}
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-panel h-24 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : habits.length === 0 ? (
            <div className="glass-panel p-10 rounded-2xl text-center flex flex-col items-center justify-center border-dashed border-slate-700/80">
              <div className="p-4 bg-violet-500/10 text-violet-400 rounded-2xl mb-4 border border-violet-500/20">
                <Flame className="w-8 h-8 animate-flame" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No habits added yet</h3>
              <p className="text-sm text-slate-400 max-w-sm">
                Start tracking your daily progress today. Add your first habit using the form above!
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
      </div>
    </main>
  );
}
