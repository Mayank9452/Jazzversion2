import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { postJazzPlayGame } from "./jazzGameAPI";
import { toast } from "@/hooks/use-toast";

export const playJazzGameThunk = createAsyncThunk(
  "jazzGame/playGame",
  async (gameId: string | number, { rejectWithValue }) => {
    try {
      return await postJazzPlayGame(gameId);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzGameSlice = createSlice({
  name: "jazzGame",
  initialState: {
    gamePlayDetails: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetJazzGame: (state) => {
      state.gamePlayDetails = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(playJazzGameThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(playJazzGameThunk.fulfilled, (state, action) => {
        state.status = "success";
        state.gamePlayDetails = action.payload?.data || action.payload;
      })
      .addCase(playJazzGameThunk.rejected, (state, action) => {
        state.status = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error playing game";
        toast({
          title: state.error || "Failed to launch game",
          variant: "destructive",
        });
      });
  },
});

export const { resetJazzGame } = jazzGameSlice.actions;
export default jazzGameSlice.reducer;
