import { prisma } from '../src/lib/prisma';
import { getOrCreateSingleUser } from '../src/lib/user';

async function main() {
  try {
    console.log('Testing getOrCreateSingleUser...');
    const user = await getOrCreateSingleUser();
    console.log('User result:', user);

    console.log('Testing habit creation...');
    const habit = await prisma.habit.create({
      data: {
        name: 'Test Habit',
        userId: user.id,
      },
    });
    console.log('Habit result:', habit);
  } catch (err) {
    console.error('EXACT CATCH ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
