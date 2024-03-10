import webpush from "web-push";

webpush.setVapidDetails("mailto:TODO", "PUBLIC_KEY", "PRIVATE_KEY") // TODO: env

let subscriptions = {}; // TODO: enhance storing

export function subscribeUser(id, subscription) {
  // TODO: handle multi-devices subscriptions
  subscriptions[id] = subscription;
}

export function notifyUser(userId, payload) {
  // TODO: handle unsubscribed
  return webpush.sendNotification(subscriptions[userId], payload);
}
