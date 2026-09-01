/**
 * Pure utility function to calculate a habit's current streak and today's done status.
 * 
 * Rules:
 * - A streak counts consecutive days marked done, ending today or yesterday.
 * - If today is marked done, start counting backward from today.
 * - If today is not marked done, but yesterday was marked done, start counting backward from yesterday.
 * - If neither today nor yesterday is marked done, the streak resets to 0.
 * - Timezone independent YYYY-MM-DD date string calculations.
 */

export interface HabitEntryLike {
  date: Date | string;
  done: boolean;
}

export function formatDateToLocalISO(dateInput: Date | string): string {
  if (typeof dateInput === 'string') {
    return dateInput.slice(0, 10);
  }
  const year = dateInput.getFullYear();
  const month = String(dateInput.getMonth() + 1).padStart(2, '0');
  const day = String(dateInput.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function subtractOneDay(dateStr: string): string {
  const parts = dateStr.split('-').map(Number);
  const year = parts[0];
  const month = parts[1] - 1;
  const day = parts[2];

  const date = new Date(year, month, day - 1);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
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
