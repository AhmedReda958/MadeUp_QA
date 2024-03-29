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

setupIonicReact();

const App: React.FC = () => {
  const logedin = localStorage.getItem("logedin");
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
