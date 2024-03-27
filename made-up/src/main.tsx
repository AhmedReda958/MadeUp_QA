import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "@/redux/index.js";
import { Flowbite } from "flowbite-react";
import customTheme from "./theme/flowbiteThemeConfig";

// fonts:
// Supports weights 200-900
import "@fontsource-variable/cairo";
// Supports weights 300-900
import "@fontsource-variable/rubik";
//only 400
import "@fontsource-variable/cairo-play";
import "@fontsource/rubik-doodle-shadow";

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
