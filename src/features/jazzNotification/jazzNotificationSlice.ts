import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJazzNotifications, postJazzDeleteNotification, postJazzClearNotifications } from "./jazzNotificationAPI";
import { toast } from "@/hooks/use-toast";

export const fetchJazzNotificationsThunk = createAsyncThunk(
  "jazzNotification/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzNotifications();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const deleteJazzNotificationThunk = createAsyncThunk(
  "jazzNotification/deleteNotification",
  async (notifyId: string | number, { rejectWithValue }) => {
    try {
      return await postJazzDeleteNotification(notifyId);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const clearJazzNotificationsThunk = createAsyncThunk(
  "jazzNotification/clearNotifications",
  async (_, { rejectWithValue }) => {
    try {
      return await postJazzClearNotifications();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzNotificationSlice = createSlice({
  name: "jazzNotification",
  initialState: {
    notifications: null,
    deleteResult: null,
    clearResult: null,
    status: "idle",
    deleteStatus: "idle",
    clearStatus: "idle",
    error: null,
  },
  reducers: {
    resetJazzNotifications: (state) => {
      state.notifications = null;
      state.deleteResult = null;
      state.clearResult = null;
      state.status = "idle";
      state.deleteStatus = "idle";
      state.clearStatus = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Fetch notifications
      .addCase(fetchJazzNotificationsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJazzNotificationsThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.notifications = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzNotificationsThunk.rejected, (state, action) => {
        state.status = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching notifications";
        toast({
          title: state.error || "Failed to fetch notifications",
          variant: "destructive",
        });
      })
      // Delete notification
      .addCase(deleteJazzNotificationThunk.pending, (state) => {
        state.deleteStatus = "loading";
      })
      .addCase(deleteJazzNotificationThunk.fulfilled, (state, action) => {
        state.deleteStatus = "success";
        state.deleteResult = action.payload?.data || action.payload;
      })
      .addCase(deleteJazzNotificationThunk.rejected, (state, action) => {
        state.deleteStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error deleting notification";
        toast({
          title: state.error || "Failed to delete notification",
          variant: "destructive",
        });
      })
      // Clear notifications
      .addCase(clearJazzNotificationsThunk.pending, (state) => {
        state.clearStatus = "loading";
      })
      .addCase(clearJazzNotificationsThunk.fulfilled, (state, action) => {
        state.clearStatus = "success";
        state.clearResult = action.payload?.data || action.payload;
      })
      .addCase(clearJazzNotificationsThunk.rejected, (state, action) => {
        state.clearStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error clearing notifications";
        toast({
          title: state.error || "Failed to clear notifications",
          variant: "destructive",
        });
      });
  },
});

export const { resetJazzNotifications } = jazzNotificationSlice.actions;
export default jazzNotificationSlice.reducer;
