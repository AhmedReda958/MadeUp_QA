import { configureStore } from "@reduxjs/toolkit";
import app from "./slices/appSlice";
import user from "./slices/userSlice";
import auth from "./slices/authSlice";

const store = configureStore({
  reducer: {
    app,
    user,
    auth,
  },
});

export default store;
