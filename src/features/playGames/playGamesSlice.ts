// src/features/playGames/playplayGamesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getPlayGames } from './playGamesAPI';
import { toast } from '@/hooks/use-toast';

export const fetchPlayGamesData = createAsyncThunk(
  'playGames',
  async (handle: any, { getState, rejectWithValue }) => {
    try {
      const response = await getPlayGames(handle, { getState });
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? 'Something went wrong',
      });
    }
  }
);

const playGamesSlice = createSlice({
  name: 'playGames',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPlayGamesData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPlayGamesData.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action?.payload;
      })
      .addCase(fetchPlayGamesData.rejected, (state, action) => {
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

export const { } = playGamesSlice.actions;
export default playGamesSlice.reducer;
