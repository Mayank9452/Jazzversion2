import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { claimParticipantRewardAPI } from "./participantRewardAPI";
import { toast } from "@/hooks/use-toast";

interface ParticipantRewardState {
  reward: string | null;
  message: string | null;
  status: "idle" | "loading" | "success" | "failed";
  error: string | null;
}

const initialState: ParticipantRewardState = {
  reward: null,
  message: null,
  status: "idle",
  error: null,
};

export const claimParticipantReward = createAsyncThunk(
  "participantReward",
  async (participantId: number, { getState, rejectWithValue }) => {
    try {
      const response = await claimParticipantRewardAPI(participantId, {
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

const participantRewardSlice = createSlice({
  name: "participantReward",
  initialState,
  reducers: {
    resetParticipantReward: (state) => {
      state.reward = null;
      state.message = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(claimParticipantReward.pending, (state) => {
        state.status = "loading";
        state.error = null;   // clear previous error
      })

      .addCase(claimParticipantReward.fulfilled, (state, action) => {
        state.status = "success";
        state.reward = action.payload?.reward ?? null; // ✅ FIXED
        state.message = action.payload?.message ?? null;
        state.error = null;

        toast({
          title: action.payload?.message ?? "Success",
          duration: 1000,
        });
      })

      .addCase(claimParticipantReward.rejected, (state, action) => {
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

export const { resetParticipantReward } =
  participantRewardSlice.actions;

export default participantRewardSlice.reducer;
