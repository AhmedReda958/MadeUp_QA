import webpush from "web-push";

webpush.setVapidDetails(
  `mailto:<${process.env.PUSH_MAIL}>`,
  process.env.PUSH_PUBLIC_KEY,
  process.env.PUSH_PRIVATE_KEY
);
let subscriptions = {}; // TODO: enhance storing

export function subscribeUser(id, subscription) {
  // TODO: handle multi-devices subscriptions
  subscriptions[id] = subscription;
}

export function notifyUser(userId, payload) {
  // TODO: handle unsubscribed
  return webpush.sendNotification(subscriptions[userId], payload);
}
