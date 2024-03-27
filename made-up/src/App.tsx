import { Redirect, Route } from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Theme variables */
import "./theme/variables.css";
import "./theme/global.css";
import { Button } from "flowbite-react";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <div className="text-alt">hello</div>
      <Button color="primary">Primary</Button>
    </IonReactRouter>
  </IonApp>
);

export default App;
