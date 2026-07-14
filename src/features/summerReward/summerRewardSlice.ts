import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "@/hooks/use-toast";
import { claimSummerRewardAPI } from "./summerRewardAPI";

interface SummerRewardState {
  reward: string | null;
  message: string | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
}

const initialState: SummerRewardState = {
  reward: null,
  message: null,
  status: "idle",
  error: null,
};

export const claimSummerReward = createAsyncThunk(
  "summerReward",
  async (participantId: number, { getState, rejectWithValue }) => {
    try {
      const response = await claimSummerRewardAPI(participantId, {
        getState,
      });

      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const summerRewardSlice = createSlice({
  name: "summerReward",
  initialState,
  reducers: {
    resetSummerReward: (state) => {
      state.reward = null;
      state.message = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(claimSummerReward.pending, (state) => {
        state.status = "loading";
        state.error = null;   // clear previous error
      })

      .addCase(claimSummerReward.fulfilled, (state, action) => {
        state.status = "success";
        state.reward = action.payload?.reward ?? null; // ✅ FIXED
        state.message = action.payload?.message ?? null;
        state.error = null;

        toast({
          title: action.payload?.message ?? "Success",
          duration: 1000,
        });
      })

      .addCase(claimSummerReward.rejected, (state, action) => {
        state.status = "failed";

        const errorPayload = action.payload as {
          code?: number;
          message?: string;
        };

        const message = errorPayload?.message ?? "Failed to claim reward";

        state.error = message;
        state.reward = null;

        toast({
          title: message,
          variant: "destructive",
          duration: 1000,
        });
      });
  },
});

export const { resetSummerReward } =
  summerRewardSlice.actions;

export default summerRewardSlice.reducer;
