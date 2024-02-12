// slices/appSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkTheme: true,
  isLoginOpened: false,
  user: null,
  notifications: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
    },
    openLoginPopup: (state) => {
      state.isLoginOpened = true;
    },
    closeLoginPopup: (state) => {
      state.isLoginOpened = false;
    },
    addNotification: (state, action) => {
      state.notifications.push(action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
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
} = appSlice.actions;
export default appSlice.reducer;
