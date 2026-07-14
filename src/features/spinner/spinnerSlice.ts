// src/features/auth/spinnerSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSpinner, getSpinnerResult } from './spinnerAPI';
import { toast } from '@/hooks/use-toast';

export const fetchSpinnerData = createAsyncThunk(
  'user/spinner',
  async (handle: any, { getState, rejectWithValue }) => {
    try {
      const response = await getSpinner(handle, { getState });
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? 'Something went wrong',
      });
    }
  }
);

export const fetchSpinnerResultData = createAsyncThunk(
  'user/spinner/play',
  async (handle: any, { getState, rejectWithValue }) => {
    try {
      const response = await getSpinnerResult(handle, { getState });
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? 'Something went wrong',
      });
    }
  }
);

const spinnerSlice = createSlice({
  name: 'spinner',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchSpinnerData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSpinnerData.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action?.payload;
      })
      .addCase(fetchSpinnerData.rejected, (state, action) => {
        state.status = 'failed';
        const errorPayload = action.payload as { code?: number; message?: string };
        const message = errorPayload?.message ?? 'Unknown error';
        state.error = message;
        toast({
          title: message,
          variant: "destructive",
          duration: 1000,
        });
      })

      // .addCase(fetchSpinnerResultData.pending, (state) => {
      //   state.status = 'loading';
      // })
      .addCase(fetchSpinnerResultData.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data.data.result = action?.payload?.data;
      })
      .addCase(fetchSpinnerResultData.rejected, (state, action) => {
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

export const { } = spinnerSlice.actions;
export default spinnerSlice.reducer;
