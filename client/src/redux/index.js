import { configureStore } from "@reduxjs/toolkit";
import app from "./slices/appSlice";
import user from "./slices/userSlice";

const store = configureStore({
  reducer: {
    app,
    user,
  },
});

export default store;
