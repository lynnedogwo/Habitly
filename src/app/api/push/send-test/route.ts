import { NextResponse } from 'next/server';
import { getOrCreateSingleUser } from '@/lib/user';
import { sendPushNotificationToUser } from '@/lib/push';

export async function POST() {
  try {
    const user = await getOrCreateSingleUser();

    if (!user.notificationsEnabled) {
      return NextResponse.json(
        { error: 'Notifications are turned off in settings' },
        { status: 400 }
      );
    }

    await sendPushNotificationToUser(user.id, {
      title: 'Habitly Test Push Notification',
      body: '🎉 Web Push Notifications are working perfectly on Habitly!',
      url: '/settings',
    });

    return NextResponse.json({ success: true, message: 'Test push notification sent!' });
  } catch (error) {
    console.error('Error sending test push:', error);
    return NextResponse.json({ error: 'Failed to send test push notification' }, { status: 500 });
  }
}
