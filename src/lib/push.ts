import webpush from 'web-push';
import { prisma } from './prisma';

const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:admin@habitly.local';

if (publicKey && privateKey) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function sendPushNotificationToUser(
  userId: string,
  payload: { title: string; body: string; url?: string }
) {
  if (!publicKey || !privateKey) {
    console.warn('VAPID keys not configured, skipping push notification');
    return;
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId },
  });

  if (subscriptions.length === 0) return;

  const pushPayload = JSON.stringify(payload);

  const sendPromises = subscriptions.map(async (sub) => {
    const pushSub = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    try {
      await webpush.sendNotification(pushSub, pushPayload);
    } catch (err: any) {
      console.error(`Error sending push to ${sub.id}:`, err);
      // Clean up invalid or expired subscriptions (404 / 410)
      if (err.statusCode === 404 || err.statusCode === 410) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
      }
    }
  });

  await Promise.allSettled(sendPromises);
}
