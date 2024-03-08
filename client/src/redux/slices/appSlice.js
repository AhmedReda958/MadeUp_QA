// slices/appSlice.js
import { createSlice } from "@reduxjs/toolkit";

const isDarkTheme = localStorage.getItem("darkMode")
  ? localStorage.getItem("darkMode")
  : false;

const initialState = {
  isDarkTheme,
  notifications: [],
  alerts: [],
  share: null,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
      localStorage.setItem("darkMode", state.isDarkTheme);
    },
    addNotification: (state, action) => {
      state.notifications = [...state.notifications, action.payload];
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    addAlert: (state, action) => {
      state.alerts = [...state.alerts, action.payload];
    },
    clearAlert: (state) => {
      state.alerts = state.alerts.shift();
    },
    share: (state, action) => {
      state.share = action.payload;
    },
    // Add more actions as needed
  },
});

export const {
  setTheme,
  addNotification,
  clearNotifications,
  addAlert,
  clearAlert,
  share,
  closeShareDialog,
} = appSlice.actions;
export default appSlice.reducer;
