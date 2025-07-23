import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sendOtp, verifyOtp } from '../services/operations/auth';
import type { SendOtpResponse, VerifyOtpResponse } from '../services/operations/auth';

interface OtpState {
  loading: boolean;
  error: string | null;
  otpId: string | null;
  message: string | null;
  mobileNumber: string | null;
}

const initialState: OtpState = {
  loading: false,
  error: null,
  otpId: null,
  message: null,
  mobileNumber: null,
};

export const sendOtpThunk = createAsyncThunk<SendOtpResponse, { mobileNumber: string; via?: string }>(
  'otp/sendOtp',
  async ({ mobileNumber, via = 'sms' }, { rejectWithValue }) => {
    const response = await sendOtp(mobileNumber, via);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response;
  }
);

export const verifyOtpThunk = createAsyncThunk<VerifyOtpResponse, { otpId: string; otp: string }>(
  'otp/verifyOtp',
  async ({ otpId, otp }, { rejectWithValue }) => {
    const response = await verifyOtp(otpId, otp);
    if (!response.success) {
      return rejectWithValue(response.message);
    }
    return response;
  }
);

const otpSlice = createSlice({
  name: 'otp',
  initialState,
  reducers: {
    resetOtpState: (state) => {
      state.loading = false;
      state.error = null;
      state.otpId = null;
      state.message = null;
      state.mobileNumber = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(sendOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.otpId = action.payload.data?.otpId || null;
        state.message = action.payload.message || null;
        state.mobileNumber = action.meta.arg.mobileNumber;
      })
      .addCase(sendOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to send OTP';
      })
      .addCase(verifyOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(verifyOtpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.message = action.payload.message || null;
        // NOTE: Set user in authSlice after successful OTP verification
      })
      .addCase(verifyOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'OTP verification failed';
      });
  },
});

export const { resetOtpState } = otpSlice.actions;
export default otpSlice.reducer; 