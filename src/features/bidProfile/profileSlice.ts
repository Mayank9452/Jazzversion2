import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { toast } from "@/hooks/use-toast";
import { getProfileInfoAPI, unsubscribeUserAPI } from "./profileAPI";

export const getProfileInfo = createAsyncThunk(
  "getProfileInfo",
  async (_: void, { getState, rejectWithValue }) => {
    try {
      return await getProfileInfoAPI(_, { getState });
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const unsubscribeUser = createAsyncThunk(
  "unsubscribeUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await unsubscribeUserAPI({ getState });
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const getProfileInfoSlice = createSlice({
  name: "getProfileInfo",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetGetProfileInfo: (state) => {
      state.status = "idle";
      state.data = null;
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getProfileInfo.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProfileInfo.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;

        // toast({
        //   title: action?.payload?.message || "Profile info retrieved successfully",
        //   variant: "default",
        //   duration: 1000,
        // });
      })
      .addCase(getProfileInfo.rejected, (state, action) => {
        state.status = "failed";
        const errorPayload = action.payload as any;

        const message = errorPayload?.message ?? "Error retrieving profile info";
        state.error = message;

        toast({
          title: message,
          variant: "destructive",
        });
      });
  },
});

export const { resetGetProfileInfo } = getProfileInfoSlice.actions;
export default getProfileInfoSlice.reducer;