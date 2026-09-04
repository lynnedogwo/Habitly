'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Settings, Flame } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
    },
    {
      label: 'My Habits',
      href: '/habits',
      icon: CheckSquare,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-slate-200 shrink-0 md:min-h-screen flex flex-col justify-between p-4 sm:p-6 shadow-xs">
      <div>
        {/* App Logo / Brand */}
        <div className="flex items-center gap-3 px-3 py-2 mb-8">
          <div className="p-2.5 bg-[#8B3DFF] rounded-2xl shadow-md shadow-purple-500/25 flex items-center justify-center">
            <Flame className="w-6 h-6 text-white fill-white animate-flame" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
              Habit<span className="text-[#8B3DFF]">ly</span>
            </h1>
            <p className="text-[11px] font-semibold text-slate-400">Daily Habit Tracker</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#8B3DFF] text-white shadow-md shadow-purple-500/20 translate-x-1'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Branding / Info */}
      <div className="mt-8 pt-4 border-t border-slate-100 hidden md:block">
        <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3 text-center">
          <p className="text-xs font-bold text-[#8B3DFF]">Habitly v1.0</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Build daily streaks</p>
        </div>
      </div>
    </aside>
  );
}
