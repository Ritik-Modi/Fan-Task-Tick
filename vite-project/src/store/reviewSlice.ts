import { createSlice, createAsyncThunk  } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { handleAxiosError } from '../utils/handleAxiosError';
import { reviewEndpoints } from '../services/api';
interface Review {
  _id: string;
  userId: { _id: string; fullName: string; email: string };
  eventId: string;
  review: string;
  rating: number;
  createdAt: string;
}

interface ReviewState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  loading: false,
  error: null,
};

// 🔹 Fetch all reviews
export const getReviews = createAsyncThunk<Review[], string>(
  'review/getReviews',
  async (eventId, thunkAPI) => {
    try {
      const res = await axios.get(reviewEndpoints.getReview(eventId));
      return res.data.reviews;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Create a review
export const createReview = createAsyncThunk<Review, { eventId: string; data: { review: string; rating: number } }>(
  'review/createReview',
  async ({ eventId, data }, thunkAPI) => {
    try {
      const res = await axios.post(reviewEndpoints.createReview(eventId), data);
      return res.data.review;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

// 🔹 Delete a review
export const deleteReview = createAsyncThunk<string, { eventId: string; reviewId: string }>(
  'review/deleteReview',
  async ({ eventId, reviewId }, thunkAPI) => {
    try {
      await axios.delete(reviewEndpoints.deleteReview(eventId, reviewId));
      return reviewId;
    } catch (error) {
      return thunkAPI.rejectWithValue(handleAxiosError(error));
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviews(state) {
      state.reviews = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviews.fulfilled, (state, action: PayloadAction<Review[]>) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createReview.fulfilled, (state, action: PayloadAction<Review>) => {
        state.reviews.push(action.payload);
      })
      .addCase(deleteReview.fulfilled, (state, action: PayloadAction<string>) => {
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
      });
  },
});

export const { clearReviews } = reviewSlice.actions;
export default reviewSlice.reducer;