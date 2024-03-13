import webpush from "web-push";

const { env } = process;
webpush.setVapidDetails(
  env.VAPID_SUBJECT,
  env.VAPID_PUBLIC_KEY,
  env.VAPID_PRIVATE_KEY
);

let subscriptions = {}; // TODO: enhance storing

export function subscribeUser(id, subscription) {
  id in subscriptions
    ? subscriptions[id].push(id)
    : (subscriptions[id] = [subscription]);
}

export function notifyUser(userId, payload) {
  // TODO: handle unsubscribed
  const userSubscriptions = subscriptions[userId];
  if (!userSubscriptions || userSubscriptions.length === 0) {
    // Handle case where there are no subscriptions for the user
    return Promise.resolve();
  }

  const notificationPromises = [];
  for (const subscription of userSubscriptions) {
    notificationPromises.push(
      webpush.sendNotification(subscription, JSON.stringify(payload))
    );
  }

  return Promise.all(notificationPromises);
}
