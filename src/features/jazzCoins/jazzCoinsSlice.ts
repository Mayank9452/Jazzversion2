import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJazzRewardCoins, postJazzConvertRewardCoins } from "./jazzCoinsAPI";
import { toast } from "@/hooks/use-toast";

export const fetchJazzRewardCoinsThunk = createAsyncThunk(
  "jazzCoins/fetchRewardCoins",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzRewardCoins();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const convertJazzRewardCoinsThunk = createAsyncThunk(
  "jazzCoins/convertRewardCoins",
  async (inputRedeemCoins: string | number, { rejectWithValue }) => {
    try {
      return await postJazzConvertRewardCoins(inputRedeemCoins);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzCoinsSlice = createSlice({
  name: "jazzCoins",
  initialState: {
    rewardCoinsInfo: null,
    conversionResult: null,
    status: "idle",
    conversionStatus: "idle",
    error: null,
  },
  reducers: {
    resetJazzCoins: (state) => {
      state.rewardCoinsInfo = null;
      state.conversionResult = null;
      state.status = "idle";
      state.conversionStatus = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Fetch reward coins info
      .addCase(fetchJazzRewardCoinsThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJazzRewardCoinsThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.rewardCoinsInfo = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzRewardCoinsThunk.rejected, (state, action) => {
        state.status = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching reward coins info";
        toast({
          title: state.error || "Failed to fetch reward coins details",
          variant: "destructive",
        });
      })
      // Convert coins
      .addCase(convertJazzRewardCoinsThunk.pending, (state) => {
        state.conversionStatus = "loading";
      })
      .addCase(convertJazzRewardCoinsThunk.fulfilled, (state, action) => {
        state.conversionStatus = "success";
        state.conversionResult = action.payload?.data || action.payload;
      })
      .addCase(convertJazzRewardCoinsThunk.rejected, (state, action) => {
        state.conversionStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error converting coins";
        toast({
          title: state.error || "Failed to convert coins",
          variant: "destructive",
        });
      });
  },
});

export const { resetJazzCoins } = jazzCoinsSlice.actions;
export default jazzCoinsSlice.reducer;
