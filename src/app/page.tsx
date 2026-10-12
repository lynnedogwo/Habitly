'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Menu,
  X,
  CheckCircle2,
  Trophy,
  Sparkles,
  Bell,
  Sliders,
  PlusCircle,
  ChevronDown,
  ArrowRight,
  Search,
  MoreHorizontal,
  Calendar,
  User,
  ExternalLink,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const faqItems = [
    {
      question: 'Do I need an account?',
      answer: 'No. Habitly has no login right now. Open the dashboard and start.',
    },
    {
      question: 'Is it free?',
      answer: 'Yes. It is free to use.',
    },
    {
      question: 'Where is my data stored?',
      answer: 'Your habits and check-ins are stored in a database, not just in your browser tab.',
    },
    {
      question: 'Does it send reminders?',
      answer: 'You can turn on push notifications in Settings. Your browser will ask for permission first, and you can turn them off any time.',
    },
    {
      question: 'Can I delete my data?',
      answer: 'Yes. Settings has a Delete All Data option that asks you to confirm before it runs.',
    },
    {
      question: 'Does it work on my phone?',
      answer: 'It runs in any modern browser, including on your phone.',
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#FEFEFE] text-slate-900 overflow-x-hidden selection:bg-[#8B3DFF]/20 selection:text-[#8B3DFF]">
      {/* =========================================================================
          SECTION 1: FLOATING NAVIGATION
          ========================================================================= */}
      <header className="fixed top-3 sm:top-6 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
        <div className="max-w-4xl mx-auto pointer-events-auto">
          <nav
            aria-label="Primary Navigation"
            className="bg-[#0F1117]/95 backdrop-blur-md border border-white/10 rounded-full py-2 sm:py-2.5 px-3.5 sm:px-6 shadow-2xl flex items-center justify-between gap-2 sm:gap-4 transition-all"
          >
            {/* Left: Flame logo + Habitly brand */}
            <Link
              href="/"
              className="flex items-center gap-2 group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 rounded-full shrink-0"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B3DFF] flex items-center justify-center shadow-md shadow-purple-500/30 group-hover:scale-105 transition-transform shrink-0">
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white animate-flame" />
              </div>
              <span className="text-white font-extrabold text-sm sm:text-base tracking-tight">
                Habit<span className="text-[#A765FF]">ly</span>
              </span>
            </Link>

            {/* Middle links (Desktop) */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
              <a
                href="#features"
                className="hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg px-1.5 py-0.5"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg px-1.5 py-0.5"
              >
                How it works
              </a>
              <a
                href="#faq"
                className="hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 rounded-lg px-1.5 py-0.5"
              >
                FAQ
              </a>
            </div>

            {/* Right: Get started button + Mobile menu button */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href="/dashboard"
                className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-full shadow-md active:scale-95 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 whitespace-nowrap shrink-0"
              >
                Get started
              </Link>

              {/* Mobile hamburger menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="md:hidden p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 cursor-pointer shrink-0"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </nav>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 p-4 bg-[#0F1117]/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl flex flex-col gap-3 text-sm font-semibold text-slate-200 animate-pop-in">
              <a
                href="#features"
                onClick={closeMobileMenu}
                className="p-2.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={closeMobileMenu}
                className="p-2.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
              >
                How it works
              </a>
              <a
                href="#faq"
                onClick={closeMobileMenu}
                className="p-2.5 rounded-xl hover:bg-white/10 hover:text-white transition-colors"
              >
                FAQ
              </a>
              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="mt-2 text-center bg-[#8B3DFF] text-white font-bold py-2.5 rounded-full shadow-md hover:bg-[#782CE6] transition-colors"
              >
                Open Dashboard
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================================
          SECTION 2: HERO
          ========================================================================= */}
      <section className="relative pt-24 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 overflow-hidden bg-gradient-to-b from-[#6522D8] via-[#8B3DFF] to-[#EDE5FA] w-full">
        {/* Soft background light blooms */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-white/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center w-full">
          {/* Main Headline */}
          <h1 className="tracking-tight text-white flex flex-col items-center justify-center">
            <span className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight sm:leading-none">
              Check in daily.
            </span>
            <span
              style={{ fontFamily: 'var(--font-instrument-serif), Georgia, serif' }}
              className="italic font-normal text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight sm:leading-none text-white/95 mt-1 sm:mt-2"
            >
              Build streaks that last.
            </span>
          </h1>

          {/* Sub text */}
          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-white/90 max-w-[700px] mx-auto font-normal leading-relaxed px-1">
            Habitly helps you track your daily habits, watch your streaks grow, and see your progress at a glance, all in one simple dashboard.
          </p>

          {/* Primary CTA button */}
          <div className="mt-6 sm:mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="bg-[#0F1117] hover:bg-slate-900 text-white font-bold text-sm sm:text-base md:text-lg px-7 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-2xl hover:shadow-purple-900/30 active:scale-95 transition-all inline-flex items-center gap-2.5 sm:gap-3 border border-white/15 hover:scale-105 group focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-white/40 shrink-0"
            >
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B3DFF] fill-[#8B3DFF] group-hover:scale-110 transition-transform animate-flame" />
              <span>Get started free</span>
            </Link>

            {/* Three small muted lines in one row */}
            <div className="flex items-center justify-center gap-x-3 sm:gap-x-8 gap-y-1 text-white/80 text-[11px] sm:text-xs md:text-sm font-medium flex-wrap mt-1 px-2">
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                Free to use
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                Works in your browser
              </span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                Push notification support
              </span>
            </div>
          </div>

          {/* Product preview at the bottom of the hero, partly cut off by the fold */}
          <div className="mt-10 sm:mt-16 -mb-24 sm:-mb-32 relative max-w-5xl mx-auto px-1 sm:px-4 w-full overflow-hidden">
            <div className="bg-[#12131A] border border-white/20 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl text-left overflow-hidden w-full max-w-full">
              {/* Preview Top Row: search bar + round icons */}
              <div className="flex items-center justify-between gap-2.5 pb-3 sm:pb-4 border-b border-white/10">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full w-full max-w-xs text-xs text-slate-400">
                  <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Search habits...</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300">
                    <MoreHorizontal className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Preview Filter Chips Row */}
              <div className="flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 overflow-x-auto no-scrollbar w-full max-w-full">
                <span className="bg-white text-slate-950 font-bold text-xs px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-xs shrink-0 cursor-default">
                  Today
                </span>
                <span className="bg-white/10 text-white/80 font-semibold text-xs px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/5 shrink-0 cursor-default">
                  Streaks
                </span>
                <span className="bg-white/10 text-white/80 font-semibold text-xs px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/5 shrink-0 cursor-default">
                  Completed
                </span>
                <span className="bg-white/10 text-white/80 font-semibold text-xs px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/5 shrink-0 cursor-default">
                  All habits
                </span>
                <span className="bg-white/10 text-white font-bold text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/5 shrink-0 cursor-default">
                  +
                </span>
              </div>

              {/* Preview Habit Cards Row (runs off right edge) */}
              <div className="flex gap-2.5 sm:gap-3 overflow-x-hidden pt-1 pb-2 w-full max-w-full">
                {/* Habit 1 */}
                <div className="min-w-[170px] sm:min-w-[230px] bg-[#1A1C26] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-md shrink-0">
                  <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                    <span className="font-bold text-xs sm:text-sm text-white truncate">Drink water</span>
                    <span className="text-[9px] sm:text-[11px] font-extrabold text-[#A765FF] bg-purple-950/60 border border-purple-800/40 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      7d streak
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-0.5 sm:gap-1 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#8B3DFF] flex items-center justify-center shadow-xs"
                      >
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Habit 2 */}
                <div className="min-w-[170px] sm:min-w-[230px] bg-[#1A1C26] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-md shrink-0">
                  <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                    <span className="font-bold text-xs sm:text-sm text-white truncate">Read 10 pages</span>
                    <span className="text-[9px] sm:text-[11px] font-extrabold text-[#A765FF] bg-purple-950/60 border border-purple-800/40 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      5d streak
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-0.5 sm:gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((day) => (
                      <div
                        key={day}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#8B3DFF] flex items-center justify-center shadow-xs"
                      >
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                      </div>
                    ))}
                    {[6, 7].map((day) => (
                      <div
                        key={day}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-white/5 border border-white/10"
                      />
                    ))}
                  </div>
                </div>

                {/* Habit 3 */}
                <div className="min-w-[170px] sm:min-w-[230px] bg-[#1A1C26] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-md shrink-0">
                  <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                    <span className="font-bold text-xs sm:text-sm text-white truncate">Morning walk</span>
                    <span className="text-[9px] sm:text-[11px] font-extrabold text-[#A765FF] bg-purple-950/60 border border-purple-800/40 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      12d streak
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-0.5 sm:gap-1 pt-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#8B3DFF] flex items-center justify-center shadow-xs"
                      >
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Habit 4 */}
                <div className="min-w-[170px] sm:min-w-[230px] bg-[#1A1C26] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-md shrink-0">
                  <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                    <span className="font-bold text-xs sm:text-sm text-white truncate">Meditate</span>
                    <span className="text-[9px] sm:text-[11px] font-extrabold text-[#A765FF] bg-purple-950/60 border border-purple-800/40 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      4d streak
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-0.5 sm:gap-1 pt-1">
                    {[1, 2, 3, 4].map((day) => (
                      <div
                        key={day}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#8B3DFF] flex items-center justify-center shadow-xs"
                      >
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                      </div>
                    ))}
                    {[5, 6, 7].map((day) => (
                      <div
                        key={day}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-white/5 border border-white/10"
                      />
                    ))}
                  </div>
                </div>

                {/* Habit 5 (Runs off edge) */}
                <div className="min-w-[170px] sm:min-w-[230px] bg-[#1A1C26] border border-white/10 rounded-2xl p-3 sm:p-4 shadow-md shrink-0 opacity-80">
                  <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
                    <span className="font-bold text-xs sm:text-sm text-white truncate">Daily coding</span>
                    <span className="text-[9px] sm:text-[11px] font-extrabold text-[#A765FF] bg-purple-950/60 border border-purple-800/40 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      9d streak
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-0.5 sm:gap-1 pt-1">
                    {[1, 2, 3, 4, 5, 6].map((day) => (
                      <div
                        key={day}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#8B3DFF] flex items-center justify-center shadow-xs"
                      >
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                      </div>
                    ))}
                    <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-white/5 border border-white/10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE PROBLEM
          ========================================================================= */}
      <section className="pt-28 sm:pt-44 pb-16 sm:pb-28 px-4 sm:px-6 w-full">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 text-[#8B3DFF] border border-purple-100 text-xs font-bold uppercase tracking-wider">
            <span>The Daily Reality</span>
          </div>
          <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
            Habits are easy to start and easy to forget.
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal">
            Most people lose track of whether they did something yesterday and lose motivation because they cannot see progress. When days blur together, even habits you care about slip through the cracks. Habitly gives you visual confirmation every day so your momentum never disappears.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FEATURES
          ========================================================================= */}
      <section id="features" className="py-16 sm:py-28 px-4 sm:px-6 bg-slate-50/70 border-y border-slate-200/80 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everything you need, nothing you don&apos;t.
            </h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Built deliberately around the simple daily rhythm of building momentum without clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-purple-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-[#8B3DFF] border border-purple-100 flex items-center justify-center mb-4 sm:mb-5">
                <PlusCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5 sm:mb-2">
                Add and manage habits
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Add, rename, and delete habits in seconds. Organize your daily routines without friction.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-purple-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4 sm:mb-5">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5 sm:mb-2">
                Daily check-ins
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Mark a habit done for today, or undo it if you tapped by mistake. Simple and forgiving.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-purple-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center mb-4 sm:mb-5">
                <Flame className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5 sm:mb-2">
                Streaks you can see
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                A streak count and a 7-day row for every habit. Watch your consistency compound every morning.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-purple-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-[#8B3DFF] border border-purple-100 flex items-center justify-center mb-4 sm:mb-5">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5 sm:mb-2">
                Today&apos;s progress
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                See how many habits you have finished today at a glance with a visual completion progress bar.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-purple-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center mb-4 sm:mb-5">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5 sm:mb-2">
                Notifications
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                In-app alerts, plus real push notifications you can turn on or off whenever you choose.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs hover:border-purple-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center mb-4 sm:mb-5">
                <Sliders className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mb-1.5 sm:mb-2">
                Made your way
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Light and dark mode, a display name, and a profile picture to make your habit tracker personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: HOW IT WORKS
          ========================================================================= */}
      <section id="how-it-works" className="py-16 sm:py-28 px-4 sm:px-6 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Three steps. That&apos;s it.
            </h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 font-normal">
              No complicated onboarding, setup wizards, or clutter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative">
            {/* Step 1 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-start relative group hover:border-[#8B3DFF]/40 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#8B3DFF] text-white font-extrabold text-base sm:text-lg flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-purple-500/20">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                Add a habit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Give it a name and it appears on your dashboard.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-start relative group hover:border-[#8B3DFF]/40 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#8B3DFF] text-white font-extrabold text-base sm:text-lg flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-purple-500/20">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                Check it off each day
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                One tap when you have done it.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col items-start relative group hover:border-[#8B3DFF]/40 transition-all">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#8B3DFF] text-white font-extrabold text-base sm:text-lg flex items-center justify-center mb-4 sm:mb-6 shadow-md shadow-purple-500/20">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1.5 sm:mb-2">
                Watch your streak grow
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                Your streak and today&apos;s progress update right away.
              </p>
            </div>
          </div>

          {/* Get started button under steps */}
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/dashboard"
              className="bg-[#8B3DFF] hover:bg-[#782CE6] text-white font-bold text-sm sm:text-base px-7 sm:px-8 py-3 sm:py-3.5 rounded-full shadow-lg shadow-purple-500/25 active:scale-95 transition-all inline-flex items-center gap-2.5 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-purple-200 shrink-0"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: SEE IT IN ACTION
          ========================================================================= */}
      <section className="py-16 sm:py-28 px-3 sm:px-6 bg-slate-50/70 border-y border-slate-200/80 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Your whole day, one screen.
            </h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 font-normal">
              A clean, focused overview that puts your current momentum front and center.
            </p>
          </div>

          {/* HTML and CSS mock of the Habitly dashboard in Light Theme */}
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 shadow-xl max-w-4xl mx-auto overflow-hidden w-full">
            {/* Header Mock */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 mb-5 sm:mb-6 border-b border-slate-200/80 gap-3 sm:gap-4">
              <div>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                  Dashboard
                </h3>
                <p className="text-xs sm:text-sm font-medium text-slate-500">
                  Track daily streaks and habit progress overview
                </p>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 self-end sm:self-auto">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-50 border border-slate-200 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl text-xs font-bold text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-[#8B3DFF]" />
                  <span>Today</span>
                </div>
                <div className="p-1.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-[#8B3DFF] flex items-center justify-center font-bold text-xs">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>
            </div>

            {/* Summary cards: Completed Today, Best Current Streak, Today's Progress */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
              {/* Completed Today */}
              <div className="bg-[#FEFEFE] p-3.5 sm:p-4.5 rounded-2xl border border-slate-200 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
                <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200 shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-500">Completed Today</p>
                  <p className="text-base sm:text-lg font-black text-slate-900">
                    3 <span className="text-xs text-slate-500 font-medium">/ 4</span>
                  </p>
                </div>
              </div>

              {/* Best Current Streak */}
              <div className="bg-[#FEFEFE] p-3.5 sm:p-4.5 rounded-2xl border border-slate-200 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
                <div className="p-2 sm:p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-200 shrink-0">
                  <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-[11px] font-bold text-slate-500">Best Current Streak</p>
                  <p className="text-base sm:text-lg font-black text-amber-700">
                    14 days
                  </p>
                </div>
              </div>

              {/* Today's Progress */}
              <div className="bg-[#FEFEFE] p-3.5 sm:p-4.5 rounded-2xl border border-slate-200 flex items-center gap-3 sm:gap-3.5 shadow-2xs">
                <div className="p-2 sm:p-2.5 bg-purple-50 text-[#8B3DFF] rounded-xl border border-purple-100 shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500">Today&apos;s Progress</p>
                    <p className="text-[10px] sm:text-[11px] font-black text-[#8B3DFF]">
                      3 of 4 done (75%)
                    </p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#8B3DFF] h-2 rounded-full w-[75%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Sample habit cards with 7-day streak rows */}
            <div className="space-y-3">
              {/* Sample Habit 1 */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-[#FEFEFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-50 border border-purple-200 text-[#8B3DFF] flex items-center justify-center font-bold shrink-0">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Drink 2L water</h4>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-[#8B3DFF] flex items-center gap-1 mt-0.5">
                      <Flame className="w-3 h-3 fill-[#8B3DFF]" /> 14 day streak
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 self-start sm:self-auto">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">{day}</span>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#8B3DFF] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Habit 2 */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-[#FEFEFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-50 border border-purple-200 text-[#8B3DFF] flex items-center justify-center font-bold shrink-0">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Read 15 pages</h4>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-[#8B3DFF] flex items-center gap-1 mt-0.5">
                      <Flame className="w-3 h-3 fill-[#8B3DFF]" /> 8 day streak
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 self-start sm:self-auto">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">{day}</span>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-md bg-[#8B3DFF] flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Habit 3 */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-[#FEFEFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-50 border border-purple-200 text-[#8B3DFF] flex items-center justify-center font-bold shrink-0">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Morning jog</h4>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-[#8B3DFF] flex items-center gap-1 mt-0.5">
                      <Flame className="w-3 h-3 fill-[#8B3DFF]" /> 5 day streak
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 self-start sm:self-auto">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">{day}</span>
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center ${
                          idx < 5 ? 'bg-[#8B3DFF]' : 'bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {idx < 5 && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Habit 4 */}
              <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 bg-[#FEFEFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-400 flex items-center justify-center font-bold shrink-0">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-300" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Evening stretch</h4>
                    <p className="text-[10px] sm:text-[11px] font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
                      <Flame className="w-3 h-3 text-slate-400" /> 4 day streak (ready for today)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-1.5 self-start sm:self-auto">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="text-[8px] sm:text-[9px] font-bold text-slate-400">{day}</span>
                      <div
                        className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md flex items-center justify-center ${
                          idx < 4 ? 'bg-[#8B3DFF]' : 'bg-slate-100 border border-slate-200'
                        }`}
                      >
                        {idx < 4 && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: FAQ
          ========================================================================= */}
      <section id="faq" className="py-16 sm:py-28 px-4 sm:px-6 w-full">
        <div className="max-w-3xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Questions, answered.
            </h2>
            <p className="mt-2.5 sm:mt-3 text-sm sm:text-base text-slate-600 font-normal">
              Direct, transparent answers about how Habitly works.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-3.5">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              const headingId = `faq-btn-${index}`;
              const panelId = `faq-panel-${index}`;

              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs transition-colors"
                >
                  <h3>
                    <button
                      type="button"
                      id={headingId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => toggleFaq(index)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 sm:gap-4 font-bold text-xs sm:text-base text-slate-900 hover:text-[#8B3DFF] transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#8B3DFF] cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#8B3DFF]' : ''
                        }`}
                      />
                    </button>
                  </h3>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headingId}
                      className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0.5 sm:pt-1 text-xs sm:text-sm text-slate-600 font-normal leading-relaxed animate-pop-in"
                    >
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="py-14 sm:py-24 px-4 sm:px-6 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl p-6 sm:p-14 lg:p-16 text-center overflow-hidden bg-gradient-to-br from-[#6522D8] via-[#8B3DFF] to-[#A765FF] shadow-2xl">
            {/* Subtle background bloom */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative max-w-2xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Start your streak today.
              </h2>
              <p className="text-white/90 text-xs sm:text-base md:text-lg font-normal max-w-lg mx-auto">
                No sign up required. Open your daily dashboard and begin building momentum right now.
              </p>
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="bg-[#0F1117] hover:bg-slate-900 text-white font-bold text-sm sm:text-base md:text-lg px-7 sm:px-10 py-3.5 sm:py-4 rounded-full shadow-2xl inline-flex items-center gap-2.5 sm:gap-3 border border-white/15 active:scale-95 transition-all hover:scale-105 group focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-white/40 shrink-0"
                >
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#8B3DFF] fill-[#8B3DFF] group-hover:scale-110 transition-transform animate-flame" />
                  <span>Get started free</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: FOOTER
          ========================================================================= */}
      <footer className="bg-[#0F1117] text-white pt-12 sm:pt-14 pb-8 sm:pb-10 border-t border-white/10 px-4 sm:px-6 w-full">
        <div className="max-w-6xl mx-auto space-y-10 sm:space-y-12">
          {/* Main Footer Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
            {/* Left Brand */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#8B3DFF] flex items-center justify-center shadow-md shadow-purple-500/30">
                  <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white fill-white" />
                </div>
                <span className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Habit<span className="text-[#A765FF]">ly</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold">
                Daily Habit Tracker
              </p>
            </div>

            {/* Middle Links */}
            <div className="flex items-center gap-5 sm:gap-8 flex-wrap text-xs sm:text-sm font-semibold text-slate-300">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="hover:text-white transition-colors">
                How it works
              </a>
              <a href="#faq" className="hover:text-white transition-colors">
                FAQ
              </a>
              <Link
                href="/dashboard"
                className="text-[#A765FF] hover:text-white transition-colors font-bold"
              >
                Open dashboard
              </Link>
            </div>

            {/* Right: GitHub repository link */}
            <div>
              <a
                href="https://github.com/lynnedogwo/Habitly"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400"
              >
                <span>GitHub Repository</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Bottom Copyright & Bootcamp Row */}
          <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs text-slate-500 font-medium text-center sm:text-left">
            <p>Built for the Ship &amp; Found Bootcamp</p>
            <p>&copy; 2026 Habitly</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
