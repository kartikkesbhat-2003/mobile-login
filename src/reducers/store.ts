import { configureStore } from '@reduxjs/toolkit';
import otpReducer from '../slices/otpSlice';
import authReducer from '../slices/authSlice';

const store = configureStore({
  reducer: {
    otp: otpReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store; 