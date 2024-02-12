import { configureStore } from "@reduxjs/toolkit";
import app from "./slices/appSlice";
import user from "./slices/userSlice";
import auth from "./slices/authSlice";
import { authApi } from "./services/authServices";

const store = configureStore({
  reducer: {
    app,
    user,
    auth,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export default store;
