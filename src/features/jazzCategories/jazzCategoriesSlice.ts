import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getIgplCategories, getJazzGamesPageCategories, getJazzCategoryGames } from "./jazzCategoriesAPI";
import { toast } from "@/hooks/use-toast";

export const fetchIgplCategoriesThunk = createAsyncThunk(
  "jazzCategories/fetchIgplCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await getIgplCategories();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const fetchJazzGamesPageCategoriesThunk = createAsyncThunk(
  "jazzCategories/fetchGamesPageCategories",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzGamesPageCategories();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const fetchJazzCategoryGamesThunk = createAsyncThunk(
  "jazzCategories/fetchCategoryGames",
  async (categoryName: string, { rejectWithValue }) => {
    try {
      return await getJazzCategoryGames(categoryName);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzCategoriesSlice = createSlice({
  name: "jazzCategories",
  initialState: {
    igplCategories: null,
    gamesPageCategories: null,
    categoryGames: null,
    igplCategoriesStatus: "idle",
    gamesPageCategoriesStatus: "idle",
    categoryGamesStatus: "idle",
    error: null,
  },
  reducers: {
    resetCategoryGames: (state) => {
      state.categoryGames = null;
      state.categoryGamesStatus = "idle";
    },
  },
  extraReducers(builder) {
    builder
      // IGPL categories
      .addCase(fetchIgplCategoriesThunk.pending, (state) => {
        state.igplCategoriesStatus = "loading";
      })
      .addCase(fetchIgplCategoriesThunk.fulfilled, (state, action) => {
        state.igplCategoriesStatus = "success";
        state.igplCategories = action.payload?.data || action.payload;
      })
      .addCase(fetchIgplCategoriesThunk.rejected, (state, action) => {
        state.igplCategoriesStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching IGPL categories";
        toast({
          title: state.error || "Failed to fetch categories",
          variant: "destructive",
        });
      })
      // Games page categories
      .addCase(fetchJazzGamesPageCategoriesThunk.pending, (state) => {
        state.gamesPageCategoriesStatus = "loading";
      })
      .addCase(fetchJazzGamesPageCategoriesThunk.fulfilled, (state, action) => {
        state.gamesPageCategoriesStatus = "success";
        state.gamesPageCategories = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzGamesPageCategoriesThunk.rejected, (state, action) => {
        state.gamesPageCategoriesStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching page categories";
        toast({
          title: state.error || "Failed to fetch page categories",
          variant: "destructive",
        });
      })
      // Category games
      .addCase(fetchJazzCategoryGamesThunk.pending, (state) => {
        state.categoryGamesStatus = "loading";
      })
      .addCase(fetchJazzCategoryGamesThunk.fulfilled, (state, action) => {
        state.categoryGamesStatus = "success";
        state.categoryGames = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzCategoryGamesThunk.rejected, (state, action) => {
        state.categoryGamesStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching category games";
        toast({
          title: state.error || "Failed to fetch category games",
          variant: "destructive",
        });
      });
  },
});

export const { resetCategoryGames } = jazzCategoriesSlice.actions;
export default jazzCategoriesSlice.reducer;
