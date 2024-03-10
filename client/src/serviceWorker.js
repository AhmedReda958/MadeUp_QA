import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { urlBase64ToUint8Array } from "./utils/helpers";
import axios from "axios";

// Register precache routes (static cache)
precacheAndRoute(self.__WB_MANIFEST);

// Clean up old cache
cleanupOutdatedCaches();

// Install and activate service worker
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

const publicVapidKey = "your-public-vapid-key"; // REPLACE_WITH_YOUR_KEY

// Register SW, Register Push, Send Push
async function send() {
  console.log("Registering Push...");
  const subscription = await self.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log("Push Registered...");

  // Send Push Notification
  console.log("Sending Push...");
  await axios.post("notifications/subscribe", subscription);
  و;

  console.log("Push Sent...");
}
send().catch((err) => console.error(err));

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
