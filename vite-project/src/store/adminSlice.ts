import { createSlice, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleAxiosError } from '../utils/handleAxiosError';
import { adminEndpoints } from '../services/api';

interface AdminEvent {
  _id: string;
  title: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  image: string;
  createdBy: string;
  genreIds?: string[];
}

interface Genre {
  _id: string;
  name: string;
}

interface EventPayload {
  title: string;
  description: string;
  venue: string;
  startDate: string;
  endDate: string;
  image: string;
  genreIds?: string[];
}

interface AdminState {
  events: AdminEvent[];
  genres: Genre[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  events: [],
  genres: [],
  loading: false,
  error: null,
};

// 🔹 Create Event
export const createEvent = createAsyncThunk<AdminEvent, EventPayload>(
  'admin/createEvent',
  async (data, thunkAPI) => {
    try {
      const res = await axios.post(adminEndpoints.createEvent, data);
      return res.data.event;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Update Event
export const updateEvent = createAsyncThunk<AdminEvent, { id: string; data: Partial<EventPayload> }>(
  'admin/updateEvent',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await axios.post(adminEndpoints.updateEvent(id), data);
      return res.data.event;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Delete Event
export const deleteEvent = createAsyncThunk<string, string>(
  'admin/deleteEvent',
  async (id, thunkAPI) => {
    try {
      await axios.delete(adminEndpoints.deleteEvent(id));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Add Genre
export const addGenre = createAsyncThunk<Genre, { name: string }>(
  'admin/addGenre',
  async (genreData, thunkAPI) => {
    try {
      const res = await axios.post(adminEndpoints.addGenre, genreData);
      return res.data.genre;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Remove Genre
export const removeGenre = createAsyncThunk<string, string>(
  'admin/removeGenre',
  async (id, thunkAPI) => {
    try {
      await axios.delete(adminEndpoints.removeGenre(id));
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminState(state) {
      state.events = [];
      state.genres = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<AdminEvent>) => {
        state.events.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<AdminEvent>) => {
        const updated = action.payload;
        const index = state.events.findIndex(e => e._id === updated._id);
        if (index !== -1) state.events[index] = updated;
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter(e => e._id !== action.payload);
      })
      .addCase(addGenre.fulfilled, (state, action: PayloadAction<Genre>) => {
        state.genres.push(action.payload);
      })
      .addCase(removeGenre.fulfilled, (state, action: PayloadAction<string>) => {
        state.genres = state.genres.filter(g => g._id !== action.payload);
      })

      // Universal matchers
      .addMatcher(
        (action) => action.type.startsWith('admin/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isRejectedWithValue,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('admin/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.loading = false;
        }
      );
  }
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
