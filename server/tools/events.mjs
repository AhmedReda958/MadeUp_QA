import { CommonError } from "#errors/index.mjs";
import { EventEmitter } from "events";
const events = new EventEmitter();
export default events;

import OneSignal, { OneSignalAPI, ONESIGNAL_APP_ID } from "./one-signal.mjs";
const RECEIVED_MESSAGE_TEMPLATE_ID = "158ce485-bd11-4ee4-8063-5c812d1402ff"; // TODO: configure
events.on("MessageSent", (message) => {
  // TODO
  let notification = new OneSignal.Notification();
  notification.app_id = ONESIGNAL_APP_ID;
  notification.template_id = RECEIVED_MESSAGE_TEMPLATE_ID;
  notification.contents = { en: message.content };
  notification.include_external_user_ids = [message.receiver];
  // {
  //   message.anonymous,
  //   message.sender
  // }

  OneSignalAPI.createNotification(notification)
    .then(({ id }) => {
      console.log("notification id:", id); // TODO
    })
    .catch((error) => {
      console.error(new CommonError(error, "Notification sending failed."));
    });
});
