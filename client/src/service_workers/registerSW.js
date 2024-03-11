import axios from "axios";

const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  if (!base64String) {
    throw new Error("not a valid VAPID_PUBLIC_KEY");
  }
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
// Register SW, Register Push, Send Push
async function send() {
  const register = await navigator.serviceWorker.register("/serviceWorker.js", {
    scope: "/",
  });

  console.log("Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  console.log("Push Registered...");

  // Send Push Notification
  console.log("Sending Push...");
  await axios.post("notifications/subscribe", subscription);
  console.log("Push Sent...");
}

const registerSW = () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      send().catch((err) => console.error(err));
    });
  }
};

export default registerSW;
