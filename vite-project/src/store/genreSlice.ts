import { createSlice , createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { genreEndpoints } from "../services/api.ts";
import { handleAxiosError } from "../utils/handleAxiosError.ts";


interface Genre {
    _id: string;
    name: string;
}

interface GenreState {
    genres: Genre[];
    loading: boolean;
    error: string | null;
}
const initialState: GenreState = {
    genres: [],
    loading: false,
    error: null,
};

export const fetchAllGenres = createAsyncThunk<Genre[], void>(
    'genre/fetchAllGenres',
    async (_, thunkAPI) => {
        try {
            const response = await axios.get(genreEndpoints.getAllGenres);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(handleAxiosError(error));
        }
    }
);

const genreSlice = createSlice({
    name: 'genre',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllGenres.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllGenres.fulfilled, (state, action) => {
                state.genres = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllGenres.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default genreSlice.reducer;