import OneSignal from "react-onesignal";

export default async function runOneSignal() {
  await OneSignal.init({
    appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
    safari_web_id: import.meta.env.VITE_ONESIGNAL_SAFARI_WEB_ID,
    allowLocalhostAsSecureOrigin: true,
  });
  OneSignal.Slidedown.promptPush();
}
