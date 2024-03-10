import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";

// Register precache routes (static cache)
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old cache
cleanupOutdatedCaches();

// Install and activate service worker
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

// Receive push notifications
self.addEventListener("push", function (e) {
  if (!(self.Notification && self.Notification.permission === "granted")) {
    //notifications aren't supported or permission not granted!
    console.log("nononono");
    return;
  }

  if (e.data) {
    let message = e.data.json();
    e.waitUntil(
      self.registration.showNotification(message.title, {
        body: message.body,
        icon: message.icon,
        actions: message.actions,
      })
    );
  }
});
