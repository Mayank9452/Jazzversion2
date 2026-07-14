// src/features/userSpins/userSpinsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { checkUserJackpotSpins, checkUserSpins, updateUserSpins } from './userSpinsAPI';
import { toast } from '@/hooks/use-toast';
import { RootState } from '@/app/store';

// ✅ Check user spins thunk
export const fetchUserSpins = createAsyncThunk(
  "user/spins/check",
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await checkUserSpins(null, { getState });
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

// ✅ Update user spins thunk
export const updateUserSpinsThunk = createAsyncThunk(
  "user/spins/update",
  async (userId: number, { getState, rejectWithValue }) => {
    try {
      const response = await updateUserSpins(userId, { getState });
      return response;
    } catch (error: any) {
      toast({
        title: "Failed to update spins",
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
  name: "userSpins",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUserSpins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserSpins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUserSpins.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as any)?.message ?? "Failed to fetch spins";
      })

      .addCase(updateUserSpinsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserSpinsThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(updateUserSpinsThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as any)?.message ?? "Failed to update spins";
      })

      .addCase(fetchUserJackpotSpins.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserJackpotSpins.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUserJackpotSpins.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as any)?.message ?? "Failed to fetch spins";
      })
  },
});

export default userSpinsSlice.reducer;
