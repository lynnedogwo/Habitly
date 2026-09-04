/**
 * Pure utility function to calculate a habit's current streak and today's done status.
 * 
 * Rules:
 * - A streak counts consecutive days marked done, ending today or yesterday.
 * - If today is marked done, start counting backward from today.
 * - If today is not marked done, but yesterday was marked done, start counting backward from yesterday.
 * - If neither today nor yesterday is marked done, the streak resets to 0.
 * - Timezone independent YYYY-MM-DD date string calculations using UTC methods.
 */

export interface HabitEntryLike {
  date: Date | string;
  done: boolean;
}

export function formatDateToLocalISO(dateInput: Date | string): string {
  if (typeof dateInput === 'string') {
    return dateInput.slice(0, 10);
  }
  // Use UTC getters so dates stored at midnight UTC (YYYY-MM-DDT00:00:00.000Z)
  // are formatted identically across all local timezones without day shifts.
  const year = dateInput.getUTCFullYear();
  const month = String(dateInput.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateInput.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function subtractOneDay(dateStr: string): string {
  const parts = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] - 1));
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function calculateHabitStreak(
  entries: HabitEntryLike[],
  targetTodayStr?: string
): { streak: number; doneToday: boolean } {
  const todayStr = targetTodayStr ? targetTodayStr.slice(0, 10) : formatDateToLocalISO(new Date());

  // Set of completed date strings (YYYY-MM-DD)
  const doneDates = new Set<string>();
  for (const entry of entries) {
    if (entry.done) {
      doneDates.add(formatDateToLocalISO(entry.date));
    }
  }

  const doneToday = doneDates.has(todayStr);
  const yesterdayStr = subtractOneDay(todayStr);

  // Determine starting point for streak calculation
  let checkStr: string | null = null;

  if (doneToday) {
    checkStr = todayStr;
  } else if (doneDates.has(yesterdayStr)) {
    checkStr = yesterdayStr;
  }

  if (!checkStr) {
    return { streak: 0, doneToday };
  }

  let streak = 0;

  // Count backward consecutively day by day
  while (checkStr && doneDates.has(checkStr)) {
    streak++;
    checkStr = subtractOneDay(checkStr);
  }

  return { streak, doneToday };
}

export interface DayStatus {
  date: string;
  dayLabel: string;
  dayNumber: number;
  isToday: boolean;
  done: boolean;
}

/**
 * Returns an array of status objects for the last 7 days ending today.
 */
export function getRecent7Days(
  entries: HabitEntryLike[],
  targetTodayStr?: string
): DayStatus[] {
  const todayStr = targetTodayStr ? targetTodayStr.slice(0, 10) : formatDateToLocalISO(new Date());

  const doneDates = new Set<string>();
  for (const entry of entries) {
    if (entry.done) {
      doneDates.add(formatDateToLocalISO(entry.date));
    }
  }

  const days: DayStatus[] = [];
  const parts = todayStr.split('-').map(Number);
  const baseDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

  // Generate 7 days ending today (from 6 days ago to today)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setUTCDate(baseDate.getUTCDate() - i);

    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayNameShort = d.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const isToday = i === 0;

    days.push({
      date: dateStr,
      dayLabel: dayNameShort,
      dayNumber: d.getUTCDate(),
      isToday,
      done: doneDates.has(dateStr),
    });
  }

  return days;
}
