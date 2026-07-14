// src/features/games/gamesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getGames } from './gamesAPI';
import { toast } from '@/hooks/use-toast';

export const fetchGamesData = createAsyncThunk(
  'games',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await getGames(_, { getState });
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
  name: 'games',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchGamesData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGamesData.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action?.payload;
      })
      .addCase(fetchGamesData.rejected, (state, action) => {
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
