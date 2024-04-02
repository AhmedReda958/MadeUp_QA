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
          limit: 20,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.code) {
        return rejectWithValue(error.response.data.code);
      } else {
        return rejectWithValue(error.message);
      }
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
      if (error.response && error.response.data.code) {
        return rejectWithValue(error.response.data.code);
      } else {
        return rejectWithValue(error.message);
      }
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
      const response = await axios.get("/messages/inbox", {
        params: {
          page: currentPage,
          limit: 10,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.code) {
        return rejectWithValue(error.response.data.code);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const initialState = {
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
};

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    // Add reducers here
    refreshFeed: (state) => {
      state.feed = initialState.feed;
    },
    refreshNotifications: (state) => {
      state.notifications = initialState.notifications;
    },
    refreshReceivedMessages: (state) => {
      state.messages.received = initialState.messages.received;
    },
    refreshSentMessages: (state) => {
      state.messages.sent = initialState.messages.sent;
    },
  },
  extraReducers: (builder) => {
    builder
      // feed ====================================================================
      //? Fetch feed pending
      .addCase(fetchFeed.pending, (state) => {
        state.feed.loading = true;
        state.feed.error = null;
      })
      //* Fetch feed fulfilled
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.feed.loading = false;
        state.feed.data = [...state.feed.data, ...action.payload];
        state.feed.page += 1;
      })
      //! Fetch feed rejected
      .addCase(fetchFeed.rejected, (state, action) => {
        state.feed.loading = false;
        state.feed.error = action.payload;
      })

      // notifications ==========================================================
      //? Fetch notifications pending
      .addCase(fetchNotifications.pending, (state) => {
        state.notifications.loading = true;
        state.notifications.error = null;
      })
      //* Fetch notifications fulfilled
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.notifications.loading = false;
        state.notifications.data = action.payload;
      })
      //! Fetch notifications rejected
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.notifications.loading = false;
        state.notifications.error = action.payload;
      })

      // messages ===============================================================
      //? Fetch messages pending
      .addCase(fetchMessages.pending, (state) => {
        state.messages.received.loading = true;
        state.messages.received.error = null;
      })
      //* Fetch messages fulfilled
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages.received.loading = false;
        state.messages.received.data = [
          ...state.messages.received.data,
          ...action.payload,
        ];
        state.messages.received.page += 1;
      })
      //! Fetch messages rejected
      .addCase(fetchMessages.rejected, (state, action) => {
        state.messages.received.loading = false;
        state.messages.received.error = action.payload;
      });
  },
});

export const {
  refreshFeed,
  refreshNotifications,
  refreshReceivedMessages,
  refreshSentMessages,
} = contentSlice.actions;

export default contentSlice.reducer;
