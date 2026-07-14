import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHomeData } from "./homeAPI";
import { toast } from "@/hooks/use-toast";
import { storage } from "@/config/config";

export const fetchHomeData = createAsyncThunk(
  "home",
  async (id: number = 1, { getState, rejectWithValue }) => {
    try {
      // console.log("Thunk called with id:", id); // 👈 add this
      return await getHomeData(id, { getState });
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  },
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    data: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.status = action?.payload?.status || "success";
        state.data = action.payload;
        // ✅ Extract authToken
        const token = action?.payload?.data?.authToken;

        if (token) {
          sessionStorage.setItem(storage.auth, token);
          // console.log("Auth token stored:", token);
        }
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.status = "failed";

        const errorPayload = action.payload as any;
        const message = errorPayload?.message ?? "Error fetching home data";

        state.error = message;

        toast({
          title: message,
          variant: "destructive",
        });
      });
  },
});

export default homeSlice.reducer;
