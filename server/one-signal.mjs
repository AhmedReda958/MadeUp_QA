const { ONESIGNAL_APP_ID, ONESIGNAL_API_KEY } = process.env;
import { CommonError } from "##/errors/index.mjs";

import * as OneSignal from "@onesignal/node-onesignal";
const AppAPI = new OneSignal.DefaultApi(
  OneSignal.createConfiguration({ appKey: ONESIGNAL_API_KEY })
);

/**
 * @param {OneSignal.Notification & { app_id: void }} properties
 */
export function notify(properties) {
  let notification = new OneSignal.Notification();
  Object.assign(notification, properties);
  notification.app_id = ONESIGNAL_APP_ID;
  AppAPI.createNotification(notification)
    .then(({ id }) => {
      console.log("notification id:", id); // TODO
    })
    .catch((error) => {
      console.error(new CommonError(error, "Notification sending failed."));
    })
    .finally(() => {
      console.log("end notify task.");
    });
}
