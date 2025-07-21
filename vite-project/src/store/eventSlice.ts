import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { eventEndpoints } from '../services/api.ts';
import { handleAxiosError } from '../utils/handleAxiosError.ts';

interface Genre {
  _id: string;
  name: string;
}

interface Ticket {
  _id: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  startSession: string;
  endSession: string;
  statusbar: 'active' | 'inactive' | 'sold out';
}

interface Event {
  _id: string;
  title: string;
  description: string;
  image: string;
  venue: string;
  startDate: string;
  endDate: string;
  genreIds: Genre[];
  minTicketPrice?: number;
  tickets?: Ticket[];
}

interface EventState {
  events: Event[];
  eventDetails: Event | null;
  loading: boolean;
  error: string | null;
  hasFetched: boolean; // ✅ Added
}

const initialState: EventState = {
  events: [],
  eventDetails: null,
  loading: false,
  error: null,
  hasFetched: false, // ✅ Added
};

export const fetchAllEvents = createAsyncThunk(
  'event/fetchAllEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(eventEndpoints.getAllEvents);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const fetchEventById = createAsyncThunk<Event, string>(
  'event/fetchEventById',
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(eventEndpoints.getEventById(id));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

export const fetchEventByGenre = createAsyncThunk<Event[], string>(
  'event/fetchEventByGenre',
  async (genreId, thunkAPI) => {
    try {
      const response = await axios.get(eventEndpoints.getEventByGenre(genreId));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

export const fetchEventByVenue = createAsyncThunk<Event[], string>(
  'event/fetchEventByVenue',
  async (venue, thunkAPI) => {
    try {
      const response = await axios.get(eventEndpoints.getEventByVenue(venue));
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

export const fetchEventByDate = createAsyncThunk<Event[], string>(
  'event/fetchEventByDate',
  async (date, thunkAPI) => {
    try {
      const response = await axios.get(eventEndpoints.getEventByDate, { params: { date } });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    clearEventDetails: (state) => {
      state.eventDetails = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        // Sort events by start date (newest first)
        state.events = action.payload.sort((a: Event, b: Event) => 
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
        state.hasFetched = true; // ✅ Mark as fetched
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.eventDetails = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventByGenre.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventByGenre.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventByGenre.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventByVenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventByVenue.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventByVenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchEventByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEventByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      ;
  },
});

export const { clearEventDetails } = eventSlice.actions;
export default eventSlice.reducer;
