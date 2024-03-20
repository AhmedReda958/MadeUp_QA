import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch feed data with pagination and refresh
export const fetchFeed = createAsyncThunk(
  "content/fetchFeed",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const currentPage = state.content.feed.page;
      const response = await axios.get("/feed", {
        params: {
          page: currentPage,
          limit: 10,
          user: ["sender", "receiver"],
          include: [
            "content",
            "sender",
            "receiver",
            "reply.content",
            "reply.timestamp",
            "timestamp",
          ],
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch notification data with pagination and refresh
export const fetchNotifications = createAsyncThunk(
  "content/fetchNotifications",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const currentPage = state.content.notifications.page; // Update property name to 'messages.received'
      const response = await axios.get("/notifications/inbox", {
        params: {
          page: currentPage,
          limit: 10,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch messages data with pagination and refresh
export const fetchMessages = createAsyncThunk(
  "content/fetchMessages",
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const currentPage = state.content.messages.received.page;
      const response = await axios.get("/messages", {
        params: {
          page: currentPage,
          refresh: false, // Update property name to 'refresh: false'
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contentSlice = createSlice({
  name: "content",
  initialState: {
    feed: {
      data: [],
      loading: false,
      refresh: false,
      error: null,
      page: 1,
    },
    notifications: {
      data: [],
      loading: false,
      refresh: false,
      error: null,
      page: 1,
    },
    messages: {
      received: {
        data: [],
        loading: false,
        refresh: false,
        error: null,
        page: 1,
      },
      sent: {
        data: [],
        loading: false,
        refresh: false,
        error: null,
        page: 1,
      },
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch feed pending
      .addCase(fetchFeed.pending, (state) => {
        state.feed.loading = true;
        state.feed.error = null;
      })
      // Fetch feed fulfilled
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feed.loading = false;
        state.feed.data = action.payload;
      })
      // Fetch feed rejected
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feed.loading = false;
        state.feed.error = action.payload;
      })
      // Fetch notifications pending
      .addCase(fetchNotifications.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.error = null;
      })
      // Fetch notifications fulfilled
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications.loading = false;
        state.notifications.data = action.payload;
      })
      // Fetch notifications rejected
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notifications.loading = false;
        state.notifications.error = action.payload;
      })
      // Fetch messages pending
      .addCase(fetchMessages.pending, (state) => {
        state.messages.received.loading = true;
        state.messages.received.error = null;
      })
      // Fetch messages fulfilled
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages.received.loading = false;
        state.messages.received.data = action.payload;
      })
      // Fetch messages rejected
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messages.received.loading = false;
        state.messages.received.error = action.payload;
      });
  },
});

export default contentSlice.reducer;
