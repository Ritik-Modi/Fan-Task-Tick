import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleAxiosError } from '../utils/handleAxiosError';
import { paymentEndpoints } from '../services/api';

interface PaymentState {
  order: string | null;
  success: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  order: null,
  success: false,
  loading: false,
  error: null,
};

export const buyTicket = createAsyncThunk('payment/buyTicket', async (
  { ticketId, quantity }: { ticketId: string; quantity: number },
  thunkAPI
) => {
  try {
    const res = await axios.post(paymentEndpoints.createPayment(ticketId), { quantity });
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleAxiosError(error));
  }
});

export const verifyPayment = createAsyncThunk('payment/verifyPayment', async (
  { ticketId, paymentData }: { ticketId: string; paymentData: any |string },
  thunkAPI
) => {
  try {
    const res = await axios.put(paymentEndpoints.verifyPayment(ticketId), paymentData);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(handleAxiosError(error));
  }
});

export const markTicketAsUsed = createAsyncThunk(
  'payment/markTicketAsUsed',
  async (
    { ticketId, userTicketId }: { ticketId: string; userTicketId: string },
    thunkAPI
  ) => {
    try {
      const res = await axios.put(paymentEndpoints.markTicketAsUsed(ticketId, userTicketId));
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPayment(state) {
      state.order = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buyTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(buyTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
      })
      .addCase(buyTicket.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyPayment.fulfilled, (state) => {
        state.success = true;
      })
      .addCase(markTicketAsUsed.fulfilled, (state) => {
        state.success = true;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
