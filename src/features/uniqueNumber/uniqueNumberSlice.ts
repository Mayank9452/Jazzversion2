import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkUniqueNumbersAPI } from "./uniqueNumberAPI";

export const checkUniqueNumbers = createAsyncThunk(
  "uniqueNumbers",
  async (payload: any, { getState, rejectWithValue }) => {
    try {
      return await checkUniqueNumbersAPI(payload, { getState });
    } catch (error: any) {
      return rejectWithValue({
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const uniqueNumberSlice = createSlice({
  name: "uniqueNumbers",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkUniqueNumbers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkUniqueNumbers.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload;
      })
      .addCase(checkUniqueNumbers.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as any)?.message;
      });
  },
});

export default uniqueNumberSlice.reducer;