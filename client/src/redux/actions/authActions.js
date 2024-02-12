// authActions.js
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("register", body);
      localStorage.setItem("userToken", data.token);

      return data;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("login", {}, { auth: body });
      localStorage.setItem("userToken", data.token);

      return data;
    } catch (error) {
      // return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
