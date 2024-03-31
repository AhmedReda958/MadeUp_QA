import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import OneSignal from "onesignal-cordova-plugin";

// pages
import LoginPage from "@/pages/auth/LoginPage";
import MainApp from "@/pages/MainApp";

/* Theme variables */
import "./theme/variables.css";
import "./theme/global.css";
import "./theme/ionic-overrides.css";

setupIonicReact({
  mode: "ios",
  swipeBackEnabled: true, // enable swipe to go back
  statusTap: true, // enable tap to scroll to top
  hardwareBackButton: true, // enable hardware back button
});

const App: React.FC = () => {
  const logedin = localStorage.getItem("logedin");

  //*  notifications
  // Replace YOUR_ONESIGNAL_APP_ID with your OneSignal App ID
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;
  console.log("OneSignal App ID : " + appId);

  OneSignal.initialize(appId);

  OneSignal.Notifications.addEventListener("click", async (e) => {
    let clickData = await e.notification;
    console.log("Notification Clicked : " + clickData);
  });

  OneSignal.Notifications.requestPermission(true).then((success: Boolean) => {
    console.log("Notification permission granted " + success);
  });

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            path={"/"}
            render={(props) => (logedin ? <MainApp /> : <LoginPage />)}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
