import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "@/redux/index.js";
import { Flowbite } from "flowbite-react";
import customTheme from "./theme/flowbiteThemeConfig";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Flowbite theme={{ theme: customTheme }}>
        <App />
      </Flowbite>
    </Provider>
  </React.StrictMode>
);
