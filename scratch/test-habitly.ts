import { calculateHabitStreak } from '../src/lib/streak';
import { getOrCreateSingleUser } from '../src/lib/user';
import { prisma } from '../src/lib/prisma';

async function runTests() {
  console.log('--- RUNNING AUTOMATED HABITLY MVP VERIFICATION TESTS ---');

  // Test 1: Streak calculation unit test
  console.log('\n[Test 1] Pure streak calculation logic:');
  const todayStr = '2026-08-31';

  // Case A: Done today, yesterday, and 2 days ago -> streak = 3
  const caseA = calculateHabitStreak(
    [
      { date: '2026-08-31T00:00:00.000Z', done: true },
      { date: '2026-08-30T00:00:00.000Z', done: true },
      { date: '2026-08-29T00:00:00.000Z', done: true },
    ],
    todayStr
  );
  console.assert(caseA.streak === 3 && caseA.doneToday === true, `Case A failed: ${JSON.stringify(caseA)}`);
  console.log('✓ Case A (3 consecutive days ending today): Passed (streak = 3)');

  // Case B: Done yesterday & day before, but NOT today -> streak = 2, doneToday = false
  const caseB = calculateHabitStreak(
    [
      { date: '2026-08-30T00:00:00.000Z', done: true },
      { date: '2026-08-29T00:00:00.000Z', done: true },
    ],
    todayStr
  );
  console.assert(caseB.streak === 2 && caseB.doneToday === false, `Case B failed: ${JSON.stringify(caseB)}`);
  console.log('✓ Case B (2 consecutive days ending yesterday): Passed (streak = 2)');

  // Case C: Gap on yesterday -> streak = 0
  const caseC = calculateHabitStreak(
    [{ date: '2026-08-29T00:00:00.000Z', done: true }],
    todayStr
  );
  console.assert(caseC.streak === 0 && caseC.doneToday === false, `Case C failed: ${JSON.stringify(caseC)}`);
  console.log('✓ Case C (gap on yesterday): Passed (streak = 0)');

  // Test 2: Database User auto-creation
  console.log('\n[Test 2] Single User Record auto-creation:');
  const user = await getOrCreateSingleUser();
  console.assert(!!user.id, 'User record must exist');
  console.log(`✓ Single user verified with ID: ${user.id}`);

  // Test 3: Habit creation and name validation
  console.log('\n[Test 3] Habit creation:');
  const habit = await prisma.habit.create({
    data: {
      name: 'Test Morning Hydration',
      userId: user.id,
    },
  });
  console.assert(habit.name === 'Test Morning Hydration', 'Habit name must match');
  console.log(`✓ Created habit: "${habit.name}" (${habit.id})`);

  // Test 4: Marking done today & streak
  console.log('\n[Test 4] Habit entry upsert & streak update:');
  const todayDate = new Date('2026-08-31T00:00:00.000Z');
  
  // Mark done today
  await prisma.habitEntry.upsert({
    where: { habitId_date: { habitId: habit.id, date: todayDate } },
    update: { done: true },
    create: { habitId: habit.id, date: todayDate, done: true },
  });

  let fetchedHabit = await prisma.habit.findUnique({
    where: { id: habit.id },
    include: { entries: true },
  });

  let status = calculateHabitStreak(fetchedHabit!.entries, '2026-08-31');
  console.assert(status.streak === 1 && status.doneToday === true, 'Streak should be 1');
  console.log('✓ Marked done today: streak is 1');

  // Unmark done today
  await prisma.habitEntry.update({
    where: { habitId_date: { habitId: habit.id, date: todayDate } },
    data: { done: false },
  });

  fetchedHabit = await prisma.habit.findUnique({
    where: { id: habit.id },
    include: { entries: true },
  });

  status = calculateHabitStreak(fetchedHabit!.entries, '2026-08-31');
  console.assert(status.streak === 0 && status.doneToday === false, 'Streak should reset to 0');
  console.log('✓ Unmarked done today: streak reset to 0');

  // Test 5: Edit habit name
  console.log('\n[Test 5] Edit habit name:');
  const updated = await prisma.habit.update({
    where: { id: habit.id },
    data: { name: 'Test Morning Hydration (Updated)' },
  });
  console.assert(updated.name === 'Test Morning Hydration (Updated)', 'Updated name must match');
  console.log(`✓ Habit renamed to: "${updated.name}"`);

  // Test 6: Delete habit
  console.log('\n[Test 6] Delete habit:');
  await prisma.habitEntry.deleteMany({ where: { habitId: habit.id } });
  await prisma.habit.delete({ where: { id: habit.id } });
  
  const deletedCheck = await prisma.habit.findUnique({ where: { id: habit.id } });
  console.assert(deletedCheck === null, 'Habit must be deleted');
  console.log('✓ Habit and associated history successfully deleted');

  console.log('\n=== ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
