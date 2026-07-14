import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJazzSpinWinInfo, getJazzSpinJSON, postJazzProcessSpinWin } from "./jazzSpinWinAPI";
import { toast } from "@/hooks/use-toast";

export const fetchJazzSpinWinInfoThunk = createAsyncThunk(
  "jazzSpinWin/fetchSpinWinInfo",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzSpinWinInfo();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const fetchJazzSpinJSONThunk = createAsyncThunk(
  "jazzSpinWin/fetchSpinJSON",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzSpinJSON();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const processJazzSpinWinThunk = createAsyncThunk(
  "jazzSpinWin/processSpinWin",
  async (wheelId: string | number, { rejectWithValue }) => {
    try {
      return await postJazzProcessSpinWin(wheelId);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzSpinWinSlice = createSlice({
  name: "jazzSpinWin",
  initialState: {
    spinWinInfo: null,
    spinJSON: null,
    processResult: null,
    infoStatus: "idle",
    jsonStatus: "idle",
    processStatus: "idle",
    error: null,
  },
  reducers: {
    resetJazzSpinWin: (state) => {
      state.spinWinInfo = null;
      state.spinJSON = null;
      state.processResult = null;
      state.infoStatus = "idle";
      state.jsonStatus = "idle";
      state.processStatus = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Fetch spin win info
      .addCase(fetchJazzSpinWinInfoThunk.pending, (state) => {
        state.infoStatus = "loading";
      })
      .addCase(fetchJazzSpinWinInfoThunk.fulfilled, (state, action) => {
        state.infoStatus = "success";
        state.spinWinInfo = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzSpinWinInfoThunk.rejected, (state, action) => {
        state.infoStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching spin info";
        toast({
          title: state.error || "Failed to fetch spin details",
          variant: "destructive",
        });
      })
      // Fetch spin JSON
      .addCase(fetchJazzSpinJSONThunk.pending, (state) => {
        state.jsonStatus = "loading";
      })
      .addCase(fetchJazzSpinJSONThunk.fulfilled, (state, action) => {
        state.jsonStatus = "success";
        state.spinJSON = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzSpinJSONThunk.rejected, (state, action) => {
        state.jsonStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching spin JSON config";
        toast({
          title: state.error || "Failed to fetch spin config",
          variant: "destructive",
        });
      })
      // Process Spin Win
      .addCase(processJazzSpinWinThunk.pending, (state) => {
        state.processStatus = "loading";
      })
      .addCase(processJazzSpinWinThunk.fulfilled, (state, action) => {
        state.processStatus = "success";
        state.processResult = action.payload?.data || action.payload;
      })
      .addCase(processJazzSpinWinThunk.rejected, (state, action) => {
        state.processStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error processing spin win";
        toast({
          title: state.error || "Failed to process spin result",
          variant: "destructive",
        });
      });
  },
});

export const { resetJazzSpinWin } = jazzSpinWinSlice.actions;
export default jazzSpinWinSlice.reducer;
