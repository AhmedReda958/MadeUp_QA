import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import axios from "axios";

//style
import "./styles/index.css";
import customTheme from "./styles/themeConfige.js";

import { RouterProvider } from "react-router-dom";
import router from "@/router";
import store from "@/redux/index.js";

import { Flowbite, Button } from "flowbite-react";

// fonts:
// Supports weights 200-900
import "@fontsource-variable/cairo";
// Supports weights 300-900
import "@fontsource-variable/rubik";
//only 400
import "@fontsource-variable/cairo-play";
import "@fontsource/rubik-doodle-shadow";

// axios config
const apiURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/";
axios.defaults.baseURL = apiURL;
axios.defaults.headers = {
  "Access-Control-Allow-Origin": apiURL,
  Authorization: "Bearer " + store.getState().auth.userToken,
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Flowbite theme={{ theme: customTheme }}>
        <RouterProvider router={router} />
      </Flowbite>
    </Provider>
  </React.StrictMode>
);
