import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import apiClient from "../../apiClient";
import type {
  ApiResponse,
  SendOtpRequest,
  SendOtpResponseData,
  VerifyOtpRequest,
  VerifyOtpResponseData,
} from "../../../types/user.types";

/**
 * Hook to send OTP to a mobile number.
 * POST /user/auth/send-otp
 */
export const useSendOtp = (
  options?: UseMutationOptions<ApiResponse<SendOtpResponseData>, Error, SendOtpRequest>
) => {
  return useMutation<ApiResponse<SendOtpResponseData>, Error, SendOtpRequest>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<SendOtpResponseData>>(
        "/user/auth/send-otp",
        payload
      );
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to generate OTP for a mobile number (alias of send-otp).
 * POST /user/auth/generate-otp
 */
export const useGenerateOtp = (
  options?: UseMutationOptions<ApiResponse<SendOtpResponseData>, Error, SendOtpRequest>
) => {
  return useMutation<ApiResponse<SendOtpResponseData>, Error, SendOtpRequest>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<SendOtpResponseData>>(
        "/user/auth/generate-otp",
        payload
      );
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to verify OTP and authenticate user.
 * POST /user/auth/verify-otp
 */
export const useVerifyOtp = (
  options?: UseMutationOptions<ApiResponse<VerifyOtpResponseData>, Error, VerifyOtpRequest>
) => {
  return useMutation<ApiResponse<VerifyOtpResponseData>, Error, VerifyOtpRequest>({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<VerifyOtpResponseData>>(
        "/user/auth/verify-otp",
        payload
      );
      return response.data;
    },
    ...options,
  });
};
