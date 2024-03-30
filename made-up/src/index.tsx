import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

// pages
import LoginPage from "@/pages/auth/LoginPage";
import MainApp from "@/pages/MainApp";

/* Theme variables */
import "./theme/variables.css";
import "./theme/global.css";
import "./theme/ionic-overrides.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "@/redux/slices/appSlice";

setupIonicReact({
  mode: "ios",
  swipeBackEnabled: true, // enable swipe to go back
  statusTap: true, // enable tap to scroll to top
  hardwareBackButton: true, // enable hardware back button
});

const App: React.FC = () => {
  const logedin = localStorage.getItem("logedin");
  const isDarkTheme = useSelector((state) => state.app.isDarkTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    document.body.classList.toggle("dark", isDarkTheme);

    prefersDark.addEventListener("change", (e) => {
      document.body.classList.toggle("dark", e.matches);
    });
  }, []);
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
