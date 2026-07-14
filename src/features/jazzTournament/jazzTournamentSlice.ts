import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getJazzLiveTournament,
  postJazzPlayLiveTournament,
  postJazzLiveTournamentScore,
  getJazzTournamentLeaderboard,
} from "./jazzTournamentAPI";
import { toast } from "@/hooks/use-toast";

export const fetchJazzLiveTournamentThunk = createAsyncThunk(
  "jazzTournament/fetchLiveTournament",
  async (tournamentId: string | number, { rejectWithValue }) => {
    try {
      return await getJazzLiveTournament(tournamentId);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const playJazzLiveTournamentThunk = createAsyncThunk(
  "jazzTournament/playLiveTournament",
  async (tournamentId: string | number, { rejectWithValue }) => {
    try {
      return await postJazzPlayLiveTournament(tournamentId);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const updateJazzTournamentScoreThunk = createAsyncThunk(
  "jazzTournament/updateTournamentScore",
  async (
    payload: { tournamentId: string | number; gameId: string | number; playerProfileId: string | number },
    { rejectWithValue }
  ) => {
    try {
      return await postJazzLiveTournamentScore(
        payload.tournamentId,
        payload.gameId,
        payload.playerProfileId
      );
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const fetchJazzTournamentLeaderboardThunk = createAsyncThunk(
  "jazzTournament/fetchLeaderboard",
  async (tournamentId: string | number, { rejectWithValue }) => {
    try {
      return await getJazzTournamentLeaderboard(tournamentId);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzTournamentSlice = createSlice({
  name: "jazzTournament",
  initialState: {
    liveTournament: null,
    playDetails: null,
    scoreUpdateResult: null,
    leaderboard: null,
    liveTournamentStatus: "idle",
    playDetailsStatus: "idle",
    scoreUpdateStatus: "idle",
    leaderboardStatus: "idle",
    error: null,
  },
  reducers: {
    resetLiveTournamentDetails: (state) => {
      state.liveTournament = null;
      state.liveTournamentStatus = "idle";
      state.playDetails = null;
      state.playDetailsStatus = "idle";
      state.scoreUpdateResult = null;
      state.scoreUpdateStatus = "idle";
      state.leaderboard = null;
      state.leaderboardStatus = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Fetch Live Tournament
      .addCase(fetchJazzLiveTournamentThunk.pending, (state) => {
        state.liveTournamentStatus = "loading";
      })
      .addCase(fetchJazzLiveTournamentThunk.fulfilled, (state, action) => {
        state.liveTournamentStatus = "success";
        state.liveTournament = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzLiveTournamentThunk.rejected, (state, action) => {
        state.liveTournamentStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching live tournament";
        toast({
          title: state.error || "Failed to fetch tournament",
          variant: "destructive",
        });
      })
      // Play Live Tournament
      .addCase(playJazzLiveTournamentThunk.pending, (state) => {
        state.playDetailsStatus = "loading";
      })
      .addCase(playJazzLiveTournamentThunk.fulfilled, (state, action) => {
        state.playDetailsStatus = "success";
        state.playDetails = action.payload?.data || action.payload;
      })
      .addCase(playJazzLiveTournamentThunk.rejected, (state, action) => {
        state.playDetailsStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error processing tournament play";
        toast({
          title: state.error || "Failed to process tournament play",
          variant: "destructive",
        });
      })
      // Update Tournament Score
      .addCase(updateJazzTournamentScoreThunk.pending, (state) => {
        state.scoreUpdateStatus = "loading";
      })
      .addCase(updateJazzTournamentScoreThunk.fulfilled, (state, action) => {
        state.scoreUpdateStatus = "success";
        state.scoreUpdateResult = action.payload?.data || action.payload;
      })
      .addCase(updateJazzTournamentScoreThunk.rejected, (state, action) => {
        state.scoreUpdateStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error updating tournament score";
        toast({
          title: state.error || "Failed to update score",
          variant: "destructive",
        });
      })
      // Fetch Leaderboard
      .addCase(fetchJazzTournamentLeaderboardThunk.pending, (state) => {
        state.leaderboardStatus = "loading";
      })
      .addCase(fetchJazzTournamentLeaderboardThunk.fulfilled, (state, action) => {
        state.leaderboardStatus = "success";
        state.leaderboard = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzTournamentLeaderboardThunk.rejected, (state, action) => {
        state.leaderboardStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching leaderboard";
        toast({
          title: state.error || "Failed to fetch leaderboard",
          variant: "destructive",
        });
      });
  },
});

export const { resetLiveTournamentDetails } = jazzTournamentSlice.actions;
export default jazzTournamentSlice.reducer;
