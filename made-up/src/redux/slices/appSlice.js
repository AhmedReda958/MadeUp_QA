// slices/appSlice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  getNotificationsCount,
  markAsSeen,
} from "../actions/notificationsActions";
import {
  setStatusBarStyleDark,
  setStatusBarStyleLight,
} from "@/utils/native/statusbar";

const isDarkTheme = localStorage.getItem("darkMode") === "true" ? true : false;

const initializeDarkTheme = (isDark) => {
  document.body.classList.toggle("dark", isDark);
  isDark ? setStatusBarStyleDark() : setStatusBarStyleLight();
};

const initialState = {
  isDarkTheme,
  notifications: [],
  unseen: {
    notifications: 0,
    messages: 0,
  },
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
      initializeDarkTheme(state.isDarkTheme);
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
  },
  // extara reducers
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationsCount.fulfilled, (state, { payload }) => {
        state.unseen = payload;
      })
      .addCase(markAsSeen.fulfilled, (state, { payload }) => {
        state.unseen = payload;
      });
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
