import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getLeaderboard } from "./leaderboardAPI";
import { toast } from "@/hooks/use-toast";

export const fetchLeaderboard = createAsyncThunk(
  "leaderboard/fetchLeaderboard",
  async (params: any, { getState, rejectWithValue }) => {
    try {
      return await getLeaderboard(params, { getState });
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    list: [],
    pageNo: 1,
    hasMore: true,
    user: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetLeaderboard: (state) => {
      state.list = [];
      state.pageNo = 1;
      state.hasMore = true;
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLeaderboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLeaderboard.fulfilled, (state, action) => {
        state.status = "success";

        const response = action.payload?.data;
        if (!response) return;

        const { list, pageNo, hasMore, user } = response;

        // ✅ Pagination handling
        if (pageNo > 1) {
          state.list = [...state.list, ...list];
        } else {
          state.list = list;
        }

        state.pageNo = pageNo;
        state.hasMore = hasMore;
        state.user = user;
      })
      .addCase(fetchLeaderboard.rejected, (state, action) => {
        state.status = "failed";

        const message =
          (action.payload as any)?.message || "Error fetching leaderboard";

        state.error = message;

        toast({
          title: message,
          variant: "destructive",
        });
      });
  },
});

export const { resetLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;