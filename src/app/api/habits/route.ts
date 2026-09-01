import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateSingleUser } from '@/lib/user';
import { calculateHabitStreak } from '@/lib/streak';

// GET /api/habits - List all habits with today's status and streak
export async function GET(request: NextRequest) {
  try {
    const user = await getOrCreateSingleUser();

    // Query optional targetDate query param (defaults to browser's local date)
    const { searchParams } = new URL(request.url);
    const targetTodayStr = searchParams.get('today') || undefined;

    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        entries: {
          orderBy: { date: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = habits.map((habit) => {
      const { streak, doneToday } = calculateHabitStreak(habit.entries, targetTodayStr);
      return {
        id: habit.id,
        name: habit.name,
        createdAt: habit.createdAt,
        doneToday,
        streak,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json(
      { error: 'Failed to fetch habits' },
      { status: 500 }
    );
  }
}

// POST /api/habits - Add a new habit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    // Reject empty names
    if (!name) {
      return NextResponse.json(
        { error: 'Habit name cannot be empty' },
        { status: 400 }
      );
    }

    const user = await getOrCreateSingleUser();

    const newHabit = await prisma.habit.create({
      data: {
        name,
        userId: user.id,
      },
    });

    return NextResponse.json({
      id: newHabit.id,
      name: newHabit.name,
      createdAt: newHabit.createdAt,
      doneToday: false,
      streak: 0,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    );
  }
}
