import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import eventReducer from './eventSlice';
import adminReducer from './adminSlice';
import genreReducer from './genreSlice';
import ticketReducer from './ticketSlice';
import paymentReducer from './paymentSlice';
import userTicketReducer from './userTicketSlice';
import profileReducer from './profileSlice';
import reviewReducer from './reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    admin: adminReducer,
    genre: genreReducer,
    ticket: ticketReducer,
    payment: paymentReducer,
    userTicket: userTicketReducer,
    profile: profileReducer,
    review: reviewReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;