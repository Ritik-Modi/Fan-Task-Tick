import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authEndpoints } from "../services/api.ts";
import { handleAxiosError } from "../utils/handleAxiosError.ts";

interface User {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    accountType: 'user' | 'admin';
    otp: string
    // profile?: string;
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

export const sendOTP = createAsyncThunk('auth/sendOtp', async (email: string, thunkAPI) => {
    try {
        await axios.post(authEndpoints.sendOtp, { email });
    } catch (error) {
        return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
});

export const signUP = createAsyncThunk<{ user: User; token: string }, string>('auth/signUp', async (data, thunkAPI) => {
    try {
        const res = await axios.post(authEndpoints.signUp, data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
});

export const login = createAsyncThunk<{ user: User; token: string }, string>('auth/login', async (data, thunkAPI) => {
    try {
        const res = await axios.post(authEndpoints.login, data);
        return res.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
});

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
    extraReducers: builder => {
        builder
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
            .addCase(signUP.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUP.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('authUser', JSON.stringify(action.payload));
                localStorage.setItem('authToken', action.payload.token);

            })
            .addCase(signUP.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
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
