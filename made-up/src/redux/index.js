import { configureStore } from "@reduxjs/toolkit";
import app from "./slices/appSlice";
import auth from "./slices/authSlice";
import content from "./slices/contentSlice";
import { authApi } from "./services/authServices";

const store = configureStore({
  reducer: {
    app,
    auth,
    [authApi.reducerPath]: authApi.reducer,
    content,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
