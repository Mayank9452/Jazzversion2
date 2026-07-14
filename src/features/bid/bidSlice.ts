import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBidInfo } from "./bidAPI";
import { toast } from "@/hooks/use-toast";

export const fetchBidInfo = createAsyncThunk(
  "bid/fetch",
  async (bidId: string, { getState, rejectWithValue }) => {
    try {
      return await getBidInfo(bidId, { getState });
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchBidInfo.pending, (state) => {
        state.status = "loading";
        state.data = null;
        state.error = null;
      })
      .addCase(fetchBidInfo.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action.payload;
      })
      .addCase(fetchBidInfo.rejected, (state, action) => {
        state.status = "failed";
        const errorPayload = action.payload as any;

        const message = errorPayload?.message ?? "Unknown error";
        state.error = message;

        toast({
          title: message,
          variant: "destructive",
          duration: 1000,
        });
      });
  },
});

export default bidSlice.reducer;