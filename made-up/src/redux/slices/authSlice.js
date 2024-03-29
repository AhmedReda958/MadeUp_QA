import { createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../actions/authActions";

// initialize userToken from local storage
const userToken = localStorage.getItem("userToken")
  ? localStorage.getItem("userToken")
  : null;

const initialState = {
  loading: false,
  userInfo: {}, // for user object
  userToken, // for storing the JWT
  error: null,
  logedin: false, // for monitoring the registration process.
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
      state.logedin = true;
    },
    logout: (state) => {
      state.userInfo = {};
      state.logedin = false;
      // OneSignalDeferred.push(function () {
      //   OneSignal.logout();
      // });
      localStorage.clear();
      window.location.reload();
    },
  },
  extraReducers: (builder) => {
    // register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.logedin = true; // registration successful
        localStorage.setItem("logedin", true);
        state.userInfo = payload.user;
        state.userToken = payload.token;
        window.location.pathname = "/";
      })
      .addCase(registerUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.logedin = true; // registration successful
        localStorage.setItem("logedin", true);
        state.userInfo = payload.user;
        state.userToken = payload.token;
        window.location.pathname = "/";
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
