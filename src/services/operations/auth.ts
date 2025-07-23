import { apiConnector } from "../apiConnector";
import { endpoints } from "../api";
import Cookies from "js-cookie";

// Define types for API responses
export interface SendOtpResponse {
  success: boolean;
  message: string;
  data: {
    otpId: string;
  } | null;
}

export interface User {
  _id: string;
  mobileNumber: string;
  accessToken: string;
  [key: string]: any;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  } | null;
}

export const sendOtp = async (
  mobileNumber: string,
  via: string = "sms"
): Promise<SendOtpResponse> => {
  try {
    const response = await apiConnector<SendOtpResponse>(
      "POST",
      endpoints.SENDOTP_API,
      { mobileNumber, via }
    );
    return response.data;
  } catch (error: any) {
    // Axios error shape
    console.log("SEND_OTP_API API ERROR............", error);
    if (error?.response?.data) {
      return error.response.data as SendOtpResponse;
    }
    return {
      success: false,
      message: "Something went wrong",
      data: null,
    };
  }
};

export const verifyOtp = async (
  otpId: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  try {
    const response = await apiConnector<VerifyOtpResponse>(
      "POST",
      endpoints.VERIFYOTP_API,
      { otpId, otp }
    );
    return response.data;
  } catch (error: any) {
    if (error?.response?.data) {
      return error.response.data as VerifyOtpResponse;
    }
    return {
      success: false,
      message: "OTP verification failed",
      data: null,
    };
  }
};

export const loginAndStoreToken = async (
  otpId: string,
  otp: string
): Promise<User | null> => {
  const verifyResult = await verifyOtp(otpId, otp);
  const user = verifyResult.data?.user ?? null;
  if (user && user.accessToken) {
    Cookies.set("accessToken", user.accessToken, { expires: 7 }); // 7 days expiry
  }
  return user;
};
 