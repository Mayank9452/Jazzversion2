// src/features/auth/authSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  checkAuthByIP,
  checkAuthByUserId,
  loginUser,
  registerAtomUser,
  registerUser,
  unsubscribeUserAPI,
  updateUser,
} from "./authAPI";
import Swal from "sweetalert2";
import { frontendAPI, storage } from "@/config/config";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export interface AuthState {
  data: any;
  status: any;
  error: any;
  redirectUrl?: string | null; // ✅ Added redirect field
  ip?: string | null;
}

// const navigate = useNavigate();

// Try parsing localStorage, fallback to nulls
// const savedAuth = localStorage.getItem(storage.auth);
const savedAuth = sessionStorage.getItem(storage.auth);
let parsedAuth: AuthState = {
  data: null,
  status: "idle",
  error: null,
  redirectUrl: null,
  ip: null,
};

try {
  if (savedAuth) parsedAuth.data = JSON.parse(savedAuth);
} catch (e) {
  console.error("Failed to parse auth from localStorage", e);
}

const initialState: AuthState = parsedAuth;

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: any) => {
    const response = await loginUser(credentials);
    return response;
  },
);

export const signup = createAsyncThunk(
  "auth/register",
  async (credentials: any) => {
    const response = await registerUser(credentials);
    return response;
  },
);

export const signupAtom = createAsyncThunk(
  "auth/atomregister",
  async (credentials: any) => {
    const response = await registerAtomUser(credentials);
    return response;
  },
);

export const checkAuthByIPThunk = createAsyncThunk(
  "auth/checkAuthByIP",
  async (_, { getState, rejectWithValue }) => {
    // console.log("🚀 checkAuthByIPThunk triggered"); // <--- ADD THIS
    try {
      const response = await checkAuthByIP(_, { getState });
      // console.log("✅ checkAuthByIPThunk got response:", response);
      return response;
    } catch (error: any) {
      // console.error("❌ checkAuthByIPThunk failed:", error);
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "Something went wrong",
      });
    }
  },
);

export const checkAuthByUserIdThunk = createAsyncThunk(
  "auth/checkAuthByUserId",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await checkAuthByUserId(userId);
      return response;
    } catch (error: any) {
      return rejectWithValue({
        code: error?.code ?? 500,
        message: error?.message ?? "UserId auth failed",
      });
    }
  },
);

export const updateUserDetails = createAsyncThunk(
  "user/update",
  async (credentials: any, { getState }) => {
    const response = await updateUser(credentials, { getState });
    return response;
  },
);

export const unsubscribeUserThunk = createAsyncThunk(
  "auth/unsubscribe",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const phone = state?.auth?.data?.phone;

      if (!phone) throw new Error("No phone number found in session");

      // Encode phone number (base64)
      const encodedPhone = btoa(phone);

      // Call backend
      const response = await unsubscribeUserAPI(encodedPhone);

      // Ensure backend returned success
      if (response?.status !== "success") {
        throw new Error(response?.message ?? "Unsubscription failed");
      }

      return response; // pass full response to .fulfilled
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthData: (state, action) => {
      state.data = action.payload.data;
      // localStorage.setItem(storage.auth, JSON.stringify(action.payload.data));
      sessionStorage.setItem(storage.auth, JSON.stringify(action.payload.data));
    },
    logout: (state) => {
      state.data = null;
      // localStorage.removeItem(storage.auth);
      sessionStorage.removeItem(storage.auth);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        // localStorage.setItem(storage.auth, JSON.stringify(action.payload.data));
        sessionStorage.setItem(
          storage.auth,
          JSON.stringify(action.payload.data),
        );
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: `${action.error.message}` || "Something went wrong!",
        });
      })

      .addCase(signup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        // localStorage.setItem(storage.auth, JSON.stringify(action.payload.data));
        sessionStorage.setItem(
          storage.auth,
          JSON.stringify(action.payload.data),
        );
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: `${action.error.message}` || "Something went wrong!",
        });
      })

      .addCase(signupAtom.pending, (state) => {
        state.status = "loading";
      })
      .addCase(signupAtom.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        // localStorage.setItem(storage.auth, JSON.stringify(action.payload.data));
        sessionStorage.setItem(
          storage.auth,
          JSON.stringify(action.payload.data),
        );
      })
      .addCase(signupAtom.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        state.data = null;
        // localStorage.removeItem(storage.auth);
        sessionStorage.removeItem(storage.auth);
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: `${action.error.message}` || "Something went wrong!",
        });
      })

      .addCase(updateUserDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = {
          ...state.data, // keep old fields
          ...action.payload.data, // overwrite only changed ones
        };
        // localStorage.setItem(storage.auth, JSON.stringify(state.data));
        sessionStorage.setItem(storage.auth, JSON.stringify(state.data));
        toast({
          title: action.payload?.message,
          variant: "default",
          duration: 1000,
        });
      })
      .addCase(updateUserDetails.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: `${action.error.message}` || "Something went wrong!",
        });
      })

      .addCase(checkAuthByIPThunk.pending, (state) => {
        state.status = "loading";
      })
      .addCase(checkAuthByIPThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        // ✅ If backend indicates redirect (no existing token)
        if (action.payload?.data) {
          state.data = action.payload.data;
          // localStorage.setItem(storage.auth, JSON.stringify(action.payload.data));
          sessionStorage.setItem(
            storage.auth,
            JSON.stringify(action.payload.data),
          );
        }

        if (action.payload?.redirectUrl) {
          state.redirectUrl = action.payload.redirectUrl;
          // state.data = null;
          // state.error = null;
          // Redirect user to billing URL
          // console.log("Redirecting to:", action.payload.redirectUrl);
          // if (action.payload?.ip) {
          //   alert("Redirect from: " + action.payload.ip);
          // }

          setTimeout(() => {
            window.location.href = action.payload.redirectUrl;
          }, 1000);

          // return; // stop further state processing
        }
      })
      .addCase(checkAuthByIPThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
        console.warn("No user found for this IP or error occurred");
      })

      .addCase(checkAuthByUserIdThunk.pending, (state) => {
        state.status = "loading";
      })

      .addCase(checkAuthByUserIdThunk.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload?.data) {
          state.data = action.payload.data;
          sessionStorage.setItem(
            storage.auth,
            JSON.stringify(action.payload.data),
          );
        }

        if (action.payload?.redirectUrl) {
          state.redirectUrl = action.payload.redirectUrl;
          // if (action.payload?.ip) {
          //   alert("Redirect from: " + action.payload.ip);
          // }

          setTimeout(() => {
            window.location.href = action.payload.redirectUrl;
          }, 1000);
        }
      })

      .addCase(checkAuthByUserIdThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error;
      });
  },
});

export const { setAuthData, logout } = authSlice.actions;
export default authSlice.reducer;
