import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateHabitStreak, formatDateToLocalISO } from '@/lib/streak';

// POST /api/habits/[id]/toggle - Toggle done/unmark status for today
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: habitId } = await params;
    const body = await request.json().catch(() => ({}));

    // Local date string (YYYY-MM-DD) sent by client or defaulted to today
    const dateStr = body.date || formatDateToLocalISO(new Date());
    
    // Normalize date to midnight UTC for deterministic unique constraint lookup
    const normalizedDate = new Date(`${dateStr}T00:00:00.000Z`);

    // Fetch existing entry for today if any
    const existingEntry = await prisma.habitEntry.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: normalizedDate,
        },
      },
    });

    // If done state is explicitly passed in body, use it; otherwise toggle current state
    const newDoneState = typeof body.done === 'boolean' ? body.done : !existingEntry?.done;

    // Upsert entry to handle unique constraint seamlessly
    await prisma.habitEntry.upsert({
      where: {
        habitId_date: {
          habitId,
          date: normalizedDate,
        },
      },
      update: {
        done: newDoneState,
      },
      create: {
        habitId,
        date: normalizedDate,
        done: newDoneState,
      },
    });

    // Retrieve updated habit with all entries to calculate streak
    const habit = await prisma.habit.findUnique({
      where: { id: habitId },
      include: {
        entries: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    const { streak, doneToday } = calculateHabitStreak(habit.entries, dateStr);

    return NextResponse.json({
      id: habit.id,
      name: habit.name,
      createdAt: habit.createdAt,
      doneToday,
      streak,
    });
  } catch (error) {
    console.error('Error toggling habit entry:', error);
    return NextResponse.json(
      { error: 'Failed to update habit status' },
      { status: 500 }
    );
  }
}
