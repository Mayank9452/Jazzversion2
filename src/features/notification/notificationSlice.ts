import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "@/hooks/use-toast";
import { getNotification } from "./notificationAPI";
import { fetchLeaderboard } from "../leaderboard/leaderboardSlice";

export const fetchNotification = createAsyncThunk(
  "notification/fetchNotification",
  async (params: any, { getState, rejectWithValue }) => {
    try {
      return await getNotification(params, { getState });
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    list: [],
    pageNo: 1,
    hasMore: true,
    status: "idle",
    error: null,
  },
  reducers: {
    resetNotification: (state) => {
      state.list = [];
      state.pageNo = 1;
      state.hasMore = true;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchNotification.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotification.fulfilled, (state, action) => {
        state.status = "success";

        const response = action.payload?.data;
        if (!response) return;

        const { notifications, pageNo, hasMore } = response;

        // ✅ pagination append
        if (pageNo > 1) {
          state.list = [...state.list, ...notifications];
        } else {
          state.list = notifications;
        }

        state.pageNo = pageNo;
        state.hasMore = hasMore;
      })
      .addCase(fetchNotification.rejected, (state, action) => {
        state.status = "failed";

        const message =
          (action.payload as any)?.message ||
          "Error fetching notification";

        state.error = message;

        toast({
          title: message,
          variant: "destructive",
        });
      });
  },
});

export const { resetNotification } = notificationSlice.actions;
export default notificationSlice.reducer;