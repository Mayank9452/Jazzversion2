// src/features/auth/spinnerSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { claimSpinnerReward, spinnerRewards } from './spinnerRewardsAPI';
import { toast } from '@/hooks/use-toast';

export const fetchSpinnerRewardsData = createAsyncThunk(
  'user/spinner/rewards',
  async (handle: any, { getState, rejectWithValue }) => {
    try {
      const response = await spinnerRewards(handle, { getState });
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? 'Something went wrong',
      });
    }
  }
);

/**
 * Claim a specific reward by ID
 */
export const claimReward = createAsyncThunk(
  "user/spinner/reward/claim",
  async (rewardId: number, { getState, rejectWithValue }) => {
    try {
      const response = await claimSpinnerReward(rewardId, { getState });
      toast({
        title: "Reward claimed successfully 🎉",
        description: "You’ve successfully claimed your reward.",
        variant: "default",
        duration: 1000,
      });
      return response;
    } catch (error: any) {
      // toast({
      //   title: "Failed to claim reward",
      //   description: error?.message ?? "Something went wrong",
      //   variant: "destructive",
      // });
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const spinnerSlice = createSlice({
  name: 'spinnerRewards',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
    claimStatus: "idle",
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSpinnerRewardsData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpinnerRewardsData.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action?.payload;
      })
      .addCase(fetchSpinnerRewardsData.rejected, (state, action) => {
        state.status = 'failed';
        const errorPayload = action.payload as { code?: number; message?: string };
        const message = errorPayload?.message ?? 'Unknown error';
        state.error = message;
        toast({
          title: message,
          variant: "destructive",
          duration: 1000,
        });
      });

      // Claim reward
    builder
      .addCase(claimReward.pending, (state) => {
        state.claimStatus = "loading";
      })
      .addCase(claimReward.fulfilled, (state, action) => {
        state.claimStatus = "succeeded";
      })
      .addCase(claimReward.rejected, (state, action) => {
        state.claimStatus = "failed";
        const errorPayload = action.payload as { message?: string };
        state.error = errorPayload?.message ?? "Unknown error";
      });
  },
});

export const { } = spinnerSlice.actions;
export default spinnerSlice.reducer;
