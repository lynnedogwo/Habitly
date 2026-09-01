import { prisma } from './prisma';

/**
 * Retrieves the single user for the application.
 * If no User record exists yet, creates one automatically.
 */
export async function getOrCreateSingleUser() {
  let user = await prisma.user.findFirst();

  if (!user) {
    user = await prisma.user.create({
      data: {},
    });
  }

  return user;
}
