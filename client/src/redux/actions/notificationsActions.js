import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getNotificationsCount = createAsyncThunk(
  "app/getcount",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axios.get("app/unseen-count");

      return data;
    } catch (error) {
      //   return custom error message from backend if present
      if (error.response && error.response.data.code) {
        return rejectWithValue(error.response.data.code);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const markAsSeen = createAsyncThunk(
  "app/markAsSeen",
  async (body, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(
        "app/mark-as-seen",
        {},
        { params: { type: body.type } }
      );

      return data;
    } catch (error) {
      //   return custom error message from backend if present
      if (error.response && error.response.data.code) {
        return rejectWithValue(error.response.data.code);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);
