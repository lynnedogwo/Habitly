'use client';

import { useState, useEffect, useCallback } from 'react';
import { Flame, CheckCircle2, Trophy, Sparkles, PlusCircle, ChevronUp } from 'lucide-react';
import { Header } from '@/components/Header';
import { AddHabitForm } from '@/components/AddHabitForm';
import { HabitCard, HabitItem } from '@/components/HabitCard';

export default function DashboardPage() {
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

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

  // Derived dashboard statistics
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) => h.doneToday).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const completionPercentage = totalHabits > 0 ? Math.round((completedTodayCount / totalHabits) * 100) : 0;

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
      {/* Top Header with Notification Bell & Profile Icon */}
      <Header
        title="Dashboard"
        subtitle="Track daily streaks and habit progress overview"
      />

      {/* Overview Stats Bar including Today's Completion Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="light-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Completed Today</p>
            <p className="text-xl font-black text-slate-900">
              {completedTodayCount} <span className="text-xs text-slate-500 font-medium">/ {totalHabits}</span>
            </p>
          </div>
        </div>

        <div className="light-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-200">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500">Best Current Streak</p>
            <p className="text-xl font-black text-amber-700">
              {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>

        {/* Today's Completion Progress Indicator */}
        <div className="light-panel p-5 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-[#8B3DFF] rounded-xl border border-purple-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <p className="text-xs font-bold text-slate-500">Today&apos;s Progress</p>
              <p className="text-xs font-black text-[#8B3DFF]">
                {totalHabits > 0 ? `${completedTodayCount} of ${totalHabits} done (${completionPercentage}%)` : '0 habits'}
              </p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#8B3DFF] h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Action Header & Add Habit Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#8B3DFF]" />
          <span>Daily Streak Overview</span>
          {totalHabits > 0 && (
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
              {totalHabits} {totalHabits === 1 ? 'habit' : 'habits'} active
            </span>
          )}
        </h2>

        {/* Visible Add Habit Button on Dashboard (Reuses existing AddHabitForm logic) */}
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
        >
          {showAddForm ? (
            <>
              <ChevronUp className="w-4 h-4 text-white" />
              <span>Hide Form</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Add Habit</span>
            </>
          )}
        </button>
      </div>

      {/* Collapsible Add Habit Form on Dashboard (reusing existing AddHabitForm component) */}
      {showAddForm && (
        <div className="mb-6 animate-pop-in">
          <AddHabitForm
            onHabitAdded={() => {
              fetchHabits();
              setShowAddForm(false);
            }}
          />
        </div>
      )}

      {/* Habit List */}
      <section>
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
            <h3 className="text-lg font-bold text-slate-900 mb-1">No habits found</h3>
            <p className="text-sm text-slate-500 max-w-sm mb-4">
              Get started by adding your first habit using the button above!
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-white" />
              <span>Add Your First Habit</span>
            </button>
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
