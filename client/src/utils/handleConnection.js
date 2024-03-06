import store from "@/redux";
import { addAlert } from "@/redux/slices/appSlice";

export const checkInternetConnection = () => {
  //cleanup
  window.removeEventListener("online", window);
  window.removeEventListener("offline", window);

  const Alert = ({ type = "", title = "", message = "" }) =>
    store.dispatch(
      addAlert({
        title,
        type,
        message,
      })
    );

  const onlineListener = window.addEventListener("online", function () {
    Alert({ title: "Connection restored", type: "success" });
    this.removeEventListener("online", this);
  });

  const offlineListener = window.addEventListener("offline", function () {
    Alert({ title: "Your Offline", type: "warn" });
    this.removeEventListener("offline", this);
  });
};
