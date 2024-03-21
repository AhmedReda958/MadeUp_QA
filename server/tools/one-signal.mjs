const { ONESIGNAL_APP_ID, ONESIGNAL_API_KEY } = process.env;
import * as OneSignal from "@onesignal/node-onesignal";
const OneSignalAPI = new OneSignal.DefaultApi(
  OneSignal.createConfiguration({ appKey: ONESIGNAL_API_KEY })
);
export default OneSignal;
export { OneSignalAPI, ONESIGNAL_APP_ID };
