import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJazzHistory } from "./jazzHistoryAPI";
import { toast } from "@/hooks/use-toast";

export const fetchJazzHistoryThunk = createAsyncThunk(
  "jazzHistory/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzHistory();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzHistorySlice = createSlice({
  name: "jazzHistory",
  initialState: {
    historyData: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetJazzHistory: (state) => {
      state.historyData = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchJazzHistoryThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJazzHistoryThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.historyData = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzHistoryThunk.rejected, (state, action) => {
        state.status = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching history data";
        toast({
          title: state.error || "Failed to fetch history",
          variant: "destructive",
        });
      });
  },
});

export const { resetJazzHistory } = jazzHistorySlice.actions;
export default jazzHistorySlice.reducer;
