import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getJazzProfileInfo, getJazzProfileImages, postJazzProfileImageChange } from "./jazzProfileAPI";
import { toast } from "@/hooks/use-toast";

export const fetchJazzProfileThunk = createAsyncThunk(
  "jazzProfile/fetchProfileInfo",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzProfileInfo();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const fetchJazzProfileImagesThunk = createAsyncThunk(
  "jazzProfile/fetchProfileImages",
  async (_, { rejectWithValue }) => {
    try {
      return await getJazzProfileImages();
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

export const changeJazzProfileImageThunk = createAsyncThunk(
  "jazzProfile/changeProfileImage",
  async (imageId: string | number, { rejectWithValue }) => {
    try {
      return await postJazzProfileImageChange(imageId);
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  }
);

const jazzProfileSlice = createSlice({
  name: "jazzProfile",
  initialState: {
    profileInfo: null,
    profileImages: null,
    imageChangeResult: null,
    profileStatus: "idle",
    profileImagesStatus: "idle",
    imageChangeStatus: "idle",
    error: null,
  },
  reducers: {
    resetJazzProfile: (state) => {
      state.profileInfo = null;
      state.profileImages = null;
      state.imageChangeResult = null;
      state.profileStatus = "idle";
      state.profileImagesStatus = "idle";
      state.imageChangeStatus = "idle";
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      // Profile Info
      .addCase(fetchJazzProfileThunk.pending, (state) => {
        state.profileStatus = "loading";
      })
      .addCase(fetchJazzProfileThunk.fulfilled, (state, action) => {
        state.profileStatus = "success";
        state.profileInfo = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzProfileThunk.rejected, (state, action) => {
        state.profileStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching profile info";
        // toast({
        //   title: state.error || "Failed to fetch profile info",
        //   variant: "destructive",
        // });
      })
      // Profile Images list
      .addCase(fetchJazzProfileImagesThunk.pending, (state) => {
        state.profileImagesStatus = "loading";
      })
      .addCase(fetchJazzProfileImagesThunk.fulfilled, (state, action) => {
        state.profileImagesStatus = "success";
        state.profileImages = action.payload?.data || action.payload;
      })
      .addCase(fetchJazzProfileImagesThunk.rejected, (state, action) => {
        state.profileImagesStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error fetching profile images";
        // toast({
        //   title: state.error || "Failed to fetch profile images",
        //   variant: "destructive",
        // });
      })
      // Profile Image change
      .addCase(changeJazzProfileImageThunk.pending, (state) => {
        state.imageChangeStatus = "loading";
      })
      .addCase(changeJazzProfileImageThunk.fulfilled, (state, action) => {
        state.imageChangeStatus = "success";
        state.imageChangeResult = action.payload?.data || action.payload;
      })
      .addCase(changeJazzProfileImageThunk.rejected, (state, action) => {
        state.imageChangeStatus = "failed";
        const errorPayload = action.payload as any;
        state.error = errorPayload?.message ?? "Error changing profile image";
        // toast({
        //   title: state.error || "Failed to change profile image",
        //   variant: "destructive",
        // });
      });
  },
});

export const { resetJazzProfile } = jazzProfileSlice.actions;
export default jazzProfileSlice.reducer;
