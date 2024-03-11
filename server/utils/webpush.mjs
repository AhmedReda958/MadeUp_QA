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
  return webpush.sendNotification(subscriptions[userId], payload);
}
