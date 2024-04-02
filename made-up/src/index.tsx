import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonRouterOutlet,
  isPlatform,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import OneSignal from "onesignal-cordova-plugin";

//components
import ShareDialog from "@/components/ui/ShareDialog";
import AlertDialog from "@/components/ui/AlertDialog";

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

const initializeOneSignal = () => {
  if (!isPlatform("cordova")) return;

  // Replace YOUR_ONESIGNAL_APP_ID with your OneSignal App ID
  const appId = import.meta.env.VITE_ONESIGNAL_APP_ID;

  OneSignal.initialize(appId);

  OneSignal.Notifications.addEventListener("click", async (e) => {
    let clickData = await e.notification;
    console.log("Notification Clicked : " + clickData);
  });

  OneSignal.Notifications.requestPermission(true).then((success: Boolean) => {
    console.log("Notification permission granted " + success);
  });
};

const App: React.FC = () => {
  const logedin = localStorage.getItem("logedin");

  //*  notifications

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
      {/* dilogs */}
      <ShareDialog />
      <AlertDialog />
    </IonApp>
  );
};

export default App;
