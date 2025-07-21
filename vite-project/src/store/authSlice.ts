import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authEndpoints } from "../services/api.ts";
import { handleAxiosError } from "../utils/handleAxiosError.ts";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  accountType: 'user' | 'admin';
  otp: string;
  profile?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// ✅ 1. Send OTP thunk
export const sendOTP = createAsyncThunk(
  'auth/sendOtp',
  async (email: string, thunkAPI) => {
    try {
      await axios.post(authEndpoints.sendOtp, { email });
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// ✅ 2. SignUpPayload type and thunk
interface SignUpPayload {
  fullName: string;
  email: string;
  phone: string;
  otp: string;
}

export const signUP = createAsyncThunk<{ user: User; token: string }, SignUpPayload>(
  'auth/signUp',
  async ({ fullName, email, phone, otp }, thunkAPI) => {
    try {
      const res = await axios.post(authEndpoints.signUp, {
        fullName,
        email,
        phone,
        otp,
      });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// ✅ 3. LoginPayload type and thunk
interface LoginPayload {
  email: string;
  otp: string;
}

export const login = createAsyncThunk<{ user: User; token: string }, LoginPayload>(
  'auth/login',
  async ({ email, otp }, thunkAPI) => {
    try {
      const res = await axios.post(authEndpoints.login, { email, otp });
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// ✅ 4. Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    },
    loadStoredAuth: (state) => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // SignUp
      .addCase(signUP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUP.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('authUser', JSON.stringify(action.payload.user));
        localStorage.setItem('authToken', action.payload.token);
      })
      .addCase(signUP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('authUser', JSON.stringify(action.payload.user));
        localStorage.setItem('authToken', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, loadStoredAuth } = authSlice.actions;
export default authSlice.reducer;
