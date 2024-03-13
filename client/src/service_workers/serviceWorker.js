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
    console.log("notifications aren't supported or permission not granted");
    return;
  }

  if (e.data) {
    let message = e.data.json();
    const icon = "/icons/android-chrome-512x512.png";
    e.waitUntil(
      self.registration.showNotification(message.title, {
        body: message.content,
        icon: message.icon || icon,
        vibrate: [300, 100, 400, 100, 400, 100, 400],
        actions: message.actions,
        data: { url: message.url },
      })
    );
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (clients.openWindow) {
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  }
});
