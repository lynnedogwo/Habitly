import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateSingleUser } from '@/lib/user';

export async function GET() {
  try {
    const user = await getOrCreateSingleUser();
    return NextResponse.json({
      user: {
        id: user.id,
        displayName: user.displayName,
        profilePicture: user.profilePicture,
        notificationsEnabled: user.notificationsEnabled,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getOrCreateSingleUser();
    const body = await request.json();

    const updateData: {
      displayName?: string | null;
      profilePicture?: string | null;
      notificationsEnabled?: boolean;
    } = {};

    if (body.displayName !== undefined) {
      updateData.displayName = body.displayName ? String(body.displayName).trim() : null;
    }

    if (body.profilePicture !== undefined) {
      updateData.profilePicture = body.profilePicture;
    }

    if (typeof body.notificationsEnabled === 'boolean') {
      updateData.notificationsEnabled = body.notificationsEnabled;
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        displayName: updatedUser.displayName,
        profilePicture: updatedUser.profilePicture,
        notificationsEnabled: updatedUser.notificationsEnabled,
      },
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user settings' }, { status: 500 });
  }
}
