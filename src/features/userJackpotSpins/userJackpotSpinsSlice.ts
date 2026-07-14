// src/features/userSpins/userSpinsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { checkUserJackpotSpins } from './userJackpotSpinsAPI';
import { toast } from '@/hooks/use-toast';
import { RootState } from '@/app/store';

// ✅ Check user spins thunk
export const fetchUserJackpotSpins = createAsyncThunk(
  "user/spins/checkJackpot",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await checkUserJackpotSpins(null, { getState });
      return response;
    } catch (error: any) {
      toast({
        title: "Failed to fetch spins",
        description: error?.message ?? "Something went wrong",
        variant: "destructive",
        duration: 1000,
      });
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

// ✅ User spins slice
const userSpinsSlice = createSlice({
  name: "userJackpotSpins",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserJackpotSpins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserJackpotSpins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUserJackpotSpins.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as any)?.message ?? "Failed to fetch Jackpot spins";
      })
  },
});

export default userSpinsSlice.reducer;
