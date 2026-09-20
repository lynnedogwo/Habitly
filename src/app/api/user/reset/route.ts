import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateSingleUser } from '@/lib/user';

export async function POST() {
  try {
    const user = await getOrCreateSingleUser();

    // Delete all habit entries belonging to user's habits
    await prisma.habitEntry.deleteMany({
      where: {
        habit: {
          userId: user.id,
        },
      },
    });

    // Delete all habits belonging to user
    await prisma.habit.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, message: 'All habit data deleted successfully' });
  } catch (error) {
    console.error('Error resetting habit data:', error);
    return NextResponse.json({ error: 'Failed to reset habit data' }, { status: 500 });
  }
}
