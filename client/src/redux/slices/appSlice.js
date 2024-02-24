// slices/appSlice.js
import { createSlice } from "@reduxjs/toolkit";

const isDarkTheme = localStorage.getItem("darkMode")
  ? localStorage.getItem("darkMode")
  : false;

const initialState = {
  isDarkTheme,
  notifications: [],
  alerts: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
      localStorage.setItem("darkMode", state.isDarkTheme);
    },
    openLoginPopup: (state) => {
      state.isLoginOpened = true;
    },
    closeLoginPopup: (state) => {
      state.isLoginOpened = false;
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
    // Add more actions as needed
  },
});

export const {
  setTheme,
  openLoginPopup,
  closeLoginPopup,
  addNotification,
  clearNotifications,
  addAlert,
  clearAlert,
} = appSlice.actions;
export default appSlice.reducer;
