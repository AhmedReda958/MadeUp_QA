// slices/appSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkTheme: true,
  isLoggedIn: false,
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
    userLogin: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
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
  userLogin,
  logout,
  addNotification,
  clearNotifications,
} = appSlice.actions;
export default appSlice.reducer;
