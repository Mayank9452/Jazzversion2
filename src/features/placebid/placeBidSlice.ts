import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { placeBidAPI } from "./placeBidAPI";
import { toast } from "@/hooks/use-toast";

export const placeBid = createAsyncThunk(
  "placeBid",
  async (payload: any, { getState, rejectWithValue }) => {
    try {
      return await placeBidAPI(payload, { getState });
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const placeBidSlice = createSlice({
  name: "placeBid",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetPlaceBid: (state) => {
      state.status = "idle";
      state.data = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(placeBid.pending, (state) => {
        state.status = "loading";
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;

        // toast({
        //   title: action?.payload?.message || "Bid placed successfully",
        // });
        //  toast({
        //   title: action?.payload?.message || "Bid placed successfully",
        //   variant: "default",
        //   duration: 1000,
        // });
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.status = "failed";
        const errorPayload = action.payload as any;

        const message = errorPayload?.message ?? "Error placing bid";
        state.error = message;

        toast({
          title: message,
          variant: "destructive",
        });
      });
  },
});

export const { resetPlaceBid } = placeBidSlice.actions;
export default placeBidSlice.reducer;