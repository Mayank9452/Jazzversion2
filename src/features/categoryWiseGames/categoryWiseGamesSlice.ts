// src/features/games/gamesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getCategoryWiseGames } from './categoryWiseGamesAPI';
import { toast } from '@/hooks/use-toast';

export const fetchCategoryWiseGamesData = createAsyncThunk(
  'categoryWiseGames',
  async (handle: any, { getState, rejectWithValue }) => {
    try {
      const response = await getCategoryWiseGames(handle, { getState });
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? 'Something went wrong',
      });
    }
  }
);

const gamesSlice = createSlice({
  name: 'categoryWiseGames',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchCategoryWiseGamesData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategoryWiseGamesData.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action?.payload;
      })
      .addCase(fetchCategoryWiseGamesData.rejected, (state, action) => {
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
  },
});

export const { } = gamesSlice.actions;
export default gamesSlice.reducer;
