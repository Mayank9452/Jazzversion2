// src/features/otherGames/otherGamesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from '@/hooks/use-toast';
import { startOtherGames, stopOtherGames } from './otherGamesAPI';

export const fetchStartOtherGames = createAsyncThunk(
  'other-games/start',
  async (handle: any, { getState, rejectWithValue }) => {
    try {
      const response = await startOtherGames(handle, { getState });
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? 'Something went wrong',
      });
    }
  }
);

export const fetchStopOtherGames = createAsyncThunk(
  'other-games/stop',
  async (handle: any, { getState, rejectWithValue }) => {
    try {
      const response = await stopOtherGames(handle, { getState });
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
  name: 'otherGames',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchStartOtherGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStartOtherGames.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action?.payload;
      })
      .addCase(fetchStartOtherGames.rejected, (state, action) => {
        state.status = 'failed';
        // const errorPayload = action.payload as { code?: number; message?: string };
        // const message = errorPayload?.message ?? 'Unknown error';

        // state.error = message;

        // toast({
        //   title: message,
        //   variant: "destructive",
        // });

      })

      .addCase(fetchStopOtherGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStopOtherGames.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action?.payload;
      })
      .addCase(fetchStopOtherGames.rejected, (state, action) => {
        state.status = 'failed';
        // const errorPayload = action.payload as { code?: number; message?: string };
        // const message = errorPayload?.message ?? 'Unknown error';

        // state.error = message;

        // toast({
        //   title: message,
        //   variant: "destructive",
        // });

      });
  },
});

export const { } = playGamesSlice.actions;
export default playGamesSlice.reducer;
