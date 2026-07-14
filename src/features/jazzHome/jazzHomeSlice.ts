import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJazzHomepageData, getJazzSuggestedGames, getJazzInstantGames, getJazzRandomGames } from "./jazzHomeAPI";
import { toast } from "@/hooks/use-toast";

export const fetchJazzHomeDataThunk = createAsyncThunk(
  "jazzHome/fetchHomeData",
  async (id: number | string | undefined, { rejectWithValue }) => {
    try {
      return await getJazzHomepageData(id);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const fetchJazzSuggestedGamesThunk = createAsyncThunk(
  "jazzHome/fetchSuggestedGames",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzSuggestedGames();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const fetchJazzInstantGamesThunk = createAsyncThunk(
  "jazzHome/fetchInstantGames",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzInstantGames();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const fetchJazzRandomGamesThunk = createAsyncThunk(
  "jazzHome/fetchRandomGames",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzRandomGames();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzHomeSlice = createSlice({
  name: "jazzHome",
  initialState: {
    data: null,
    suggestedGames: [],
    instantGames: null,
    randomGames: [],
    status: "idle",
    suggestedGamesStatus: "idle",
    instantGamesStatus: "idle",
    randomGamesStatus: "idle",
    error: null,
  },
  reducers: {
    resetJazzHome: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Homepage data
      .addCase(fetchJazzHomeDataThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchJazzHomeDataThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.data = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzHomeDataThunk.rejected, (state, action) => {
        state.status = "failed";
        const errorPayload = action.payload as any;
        const message = errorPayload?.message ?? "Error fetching Jazz homepage data";
        state.error = message;
        toast({
          title: message,
          variant: "destructive",
        });
      })
      // Suggested games
      .addCase(fetchJazzSuggestedGamesThunk.pending, (state) => {
        state.suggestedGamesStatus = "loading";
      })
      .addCase(fetchJazzSuggestedGamesThunk.fulfilled, (state, action) => {
        state.suggestedGamesStatus = "success";
        state.suggestedGames = action.payload?.data?.suggestedGames || action.payload?.suggestedGames || [];
      })
      .addCase(fetchJazzSuggestedGamesThunk.rejected, (state, action) => {
        state.suggestedGamesStatus = "failed";
        const errorPayload = action.payload as any;
        const message = errorPayload?.message ?? "Error fetching suggested games";
        toast({
          title: message,
          variant: "destructive",
        });
      })
      // Instant games
      .addCase(fetchJazzInstantGamesThunk.pending, (state) => {
        state.instantGamesStatus = "loading";
      })
      .addCase(fetchJazzInstantGamesThunk.fulfilled, (state, action) => {
        state.instantGamesStatus = "success";
        state.instantGames = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzInstantGamesThunk.rejected, (state, action) => {
        state.instantGamesStatus = "failed";
        const errorPayload = action.payload as any;
        const message = errorPayload?.message ?? "Error fetching instant games";
        toast({
          title: message,
          variant: "destructive",
        });
      })
      // Random games
      .addCase(fetchJazzRandomGamesThunk.pending, (state) => {
        state.randomGamesStatus = "loading";
      })
      .addCase(fetchJazzRandomGamesThunk.fulfilled, (state, action) => {
        state.randomGamesStatus = "success";
        state.randomGames = action.payload?.data || action.payload || [];
      })
      .addCase(fetchJazzRandomGamesThunk.rejected, (state, action) => {
        state.randomGamesStatus = "failed";
        const errorPayload = action.payload as any;
        const message = errorPayload?.message ?? "Error fetching trending games";
        toast({
          title: message,
          variant: "destructive",
        });
      });
  },
});

export const { resetJazzHome } = jazzHomeSlice.actions;
export default jazzHomeSlice.reducer;
