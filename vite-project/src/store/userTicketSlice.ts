import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleAxiosError } from '../utils/handleAxiosError';
import { userEndpoints } from '../services/api';

interface UserTicket {
  _id: string;
  ticketId: {
    _id: string;
    title: string;
    description: string;
    price: number;
    eventId: {
      _id: string;
      title: string;
      image: string;
      venue: string;
      startDate: string;
      endDate: string;
    };
  };
  quantity: number;
  totalPrice: number;
  isPaid: boolean;
  orderId: string;
  paymentId: string;
  qrCode: string;
  status: 'active' | 'inactive';
  verifiedIdentity?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
}

interface UserTicketState {
  tickets: UserTicket[];
  loading: boolean;
  error: string | null;
}

const initialState: UserTicketState = {
  tickets: [],
  loading: false,
  error: null,
};

// Fetch user's purchased tickets
export const fetchUserTickets = createAsyncThunk<UserTicket[], void>(
  'userTicket/fetchPurchasedTickets',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(userEndpoints.getPurchesedTickets);
      return res.data.tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

const userTicketSlice = createSlice({
  name: 'userTicket',
  initialState,
  reducers: {
    clearUserTickets(state) {
      state.tickets = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTickets.fulfilled, (state, action: PayloadAction<UserTicket[]>) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchUserTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearUserTickets } = userTicketSlice.actions;
export default userTicketSlice.reducer;
