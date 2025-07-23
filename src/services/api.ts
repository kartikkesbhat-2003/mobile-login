const BASE_URL = import.meta.env.VITE_BASE_URL;

export const endpoints = {
  SENDOTP_API: BASE_URL + "/api/login/send-otp",
  VERIFYOTP_API: BASE_URL + "/api/login/verify-otp",
};