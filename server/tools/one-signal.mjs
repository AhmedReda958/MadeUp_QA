const ONESIGNAL_APP_ID = "28c01740-7973-4924-95be-b0728f67e449",
  ONESIGNAL_API_KEY = "OWJlMjhlOTItYTIzMS00ZTIzLWJhM2ItYTllZmMyNGJkYjQw"; // TODO: env
// const { ONESIGNAL_APP_ID, ONESIGNAL_API_KEY } = process.env;
import * as OneSignal from "@onesignal/node-onesignal";
const OneSignalAPI = new OneSignal.DefaultApi(
  OneSignal.createConfiguration({ appKey: ONESIGNAL_API_KEY })
);
export default OneSignal;
export { OneSignalAPI, ONESIGNAL_APP_ID };
