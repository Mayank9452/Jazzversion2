// src/features/auth/profileSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSpinsInfo } from './spinsInfoAPI';
import { toast } from '@/hooks/use-toast';

export const fetchDashboardSpinsInfo = createAsyncThunk(
  'spinsInfo',
  async (_, { getState, rejectWithValue }) => {
    try {
      const response = await getSpinsInfo(_, { getState });
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? 'Something went wrong',
      });
    }
  }
);

const userSpinsInfo = createSlice({
  name: 'spinsInfo',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDashboardSpinsInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardSpinsInfo.fulfilled, (state, action) => {
        state.status = action?.payload?.status;
        state.data = action?.payload;
      })
      // .addCase(fetchDashboardData.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message ?? 'Unknown error';
      //   toast({
      //     title: action.error.message ?? 'Unknown error',
      //     variant: "destructive",
      //   });
      //   // ✅ Handle 401
      //   console.log("action.error::", action.error);
        
      //   const error = action.error as any;
      //   if (error.code === 401) {
      //     console.log(error);
          
      //     const dispatch = (action.meta as any).dispatch as AppDispatch;
      //     dispatch(logout());
      //   }
      // });
      .addCase(fetchDashboardSpinsInfo.rejected, (state, action) => {
        state.status = 'failed';
        const errorPayload = action.payload as { code?: number; message?: string };
        const message = errorPayload?.message ?? 'Unknown error';

        state.error = message;

        toast({
          title: message,
          variant: "destructive",
          duration: 1000,
        });
        
        // ✅ Handle 401 Unauthorized
        // if (errorPayload?.code === 401) {
        //   console.log("errorPayload:", errorPayload);
        //   const dispatch = (action.meta as any).dispatch as AppDispatch;
        //   dispatch(logout());
        // }
      });
  },
});

export const { } = userSpinsInfo.actions;
export default userSpinsInfo.reducer;
