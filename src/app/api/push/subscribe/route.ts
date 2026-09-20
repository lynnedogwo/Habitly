import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrCreateSingleUser } from '@/lib/user';

export async function POST(request: Request) {
  try {
    const user = await getOrCreateSingleUser();
    const body = await request.json();
    const { subscription } = body;

    if (!subscription || !subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription object' }, { status: 400 });
    }

    const { endpoint, keys } = subscription;
    const { p256dh, auth } = keys;

    if (!p256dh || !auth) {
      return NextResponse.json({ error: 'Missing subscription keys' }, { status: 400 });
    }

    // Upsert subscription
    await prisma.pushSubscription.upsert({
      where: { endpoint },
      update: {
        p256dh,
        auth,
        userId: user.id,
      },
      create: {
        endpoint,
        p256dh,
        auth,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, message: 'Push subscription saved' });
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json({ error: 'Failed to save push subscription' }, { status: 500 });
  }
}
