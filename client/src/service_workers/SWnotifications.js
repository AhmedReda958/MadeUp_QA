import store from "@/redux";
import axios from "axios";

const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;

const checkPermission = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No support for service worker!");
  }

  if (!("Notification" in window)) {
    throw new Error("No support for notification API");
  }

  if (!("PushManager" in window)) {
    throw new Error("No support for Push API");
  }
};

const requestNotificationPermission = async () => {
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission not granted");
  }
};

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

const saveSubscription = async (subscription) => {
  console.log("Sending Push...");

  await axios.post("notifications/subscribe", subscription);
  console.log("Push Sent...");
  return response;
};

const registerNotifications = async () => {
  console.log("Registering Push...");
  const registeration = await navigator.serviceWorker.getRegistration("/");
  const subscription = await registeration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  });
  try {
    await axios.post("notifications/subscribe", subscription, {
      Authorization: "Bearer " + localStorage.getItem("userToken"),
    });
    console.log(response);
  } catch (error) {
    console.log(error);
  }
  return;
};

const useNotifications = async () => {
  if (localStorage.getItem("isNotificationsEnabled")) return null;

  checkPermission();
  await requestNotificationPermission();
  await registerNotifications();
  localStorage.setItem("isNotificationsEnabled", true);
  console.log("Push Registered...");
};

export default useNotifications;
