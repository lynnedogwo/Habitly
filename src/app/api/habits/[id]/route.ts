import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateHabitStreak, getRecent7Days } from '@/lib/streak';

// PATCH /api/habits/[id] - Edit habit name
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json(
        { error: 'Habit name cannot be empty' },
        { status: 400 }
      );
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: { name },
      include: {
        entries: {
          orderBy: { date: 'desc' },
        },
      },
    });

    const { streak, doneToday } = calculateHabitStreak(updatedHabit.entries);
    const recentDays = getRecent7Days(updatedHabit.entries);

    return NextResponse.json({
      id: updatedHabit.id,
      name: updatedHabit.name,
      createdAt: updatedHabit.createdAt,
      doneToday,
      streak,
      recentDays,
    });
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json(
      { error: 'Failed to update habit' },
      { status: 500 }
    );
  }
}

// DELETE /api/habits/[id] - Delete a habit and its history
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete associated entries first to ensure complete cleanup
    await prisma.habitEntry.deleteMany({
      where: { habitId: id },
    });

    await prisma.habit.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json(
      { error: 'Failed to delete habit' },
      { status: 500 }
    );
  }
}
