import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ticketEndpoints } from '../services/api';
import { handleAxiosError } from '../utils/handleAxiosError';

export interface Ticket {
  _id: string;
  eventId: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  startSession: string;
  endSession: string;
  statusbar: 'active' | 'sold out' | 'inactive';
}

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  loading: false,
  error: null,
};

// 🔹 Get tickets for an event
export const getTicketsByEvent = createAsyncThunk<Ticket[], string>(
  'ticket/getTicketsByEvent',
  async (eventId, thunkAPI) => {
    try {
      const res = await axios.get(ticketEndpoints.getTicketsByEvent(eventId));
      return res.data.tickets;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Create a ticket (Admin)
export const createTicket = createAsyncThunk<Ticket, { eventId: string; data: Omit<Ticket, '_id'> }>(
  'ticket/createTicket',
  async ({ eventId, data }, thunkAPI) => {
    try {
      const res = await axios.post(ticketEndpoints.createTicket(eventId), data);
      return res.data.ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Update a ticket (Admin)
export const updateTicket = createAsyncThunk<Ticket, { eventId: string; ticketId: string; data: Partial<Ticket> }>(
  'ticket/updateTicket',
  async ({ eventId, ticketId, data }, thunkAPI) => {
    try {
      const res = await axios.put(ticketEndpoints.updateTicket(eventId, ticketId), data);
      return res.data.ticket;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Delete a ticket (Admin)
export const deleteTicket = createAsyncThunk<string, { eventId: string; ticketId: string }>(
  'ticket/deleteTicket',
  async ({ eventId, ticketId }, thunkAPI) => {
    try {
      await axios.delete(ticketEndpoints.deleteTicket(eventId, ticketId));
      return ticketId;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    clearTickets(state) {
      state.tickets = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTicketsByEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTicketsByEvent.fulfilled, (state, action: PayloadAction<Ticket[]>) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(getTicketsByEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        state.tickets.push(action.payload);
      })
      .addCase(updateTicket.fulfilled, (state, action: PayloadAction<Ticket>) => {
        const updated = action.payload;
        const index = state.tickets.findIndex((t) => t._id === updated._id);
        if (index !== -1) {
          state.tickets[index] = updated;
        }
      })
      .addCase(deleteTicket.fulfilled, (state, action: PayloadAction<string>) => {
        state.tickets = state.tickets.filter((t) => t._id !== action.payload);
      });
  }
});

export const { clearTickets } = ticketSlice.actions;
export default ticketSlice.reducer;
