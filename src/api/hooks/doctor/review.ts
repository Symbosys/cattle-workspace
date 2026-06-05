import { 
  useMutation, 
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from "@tanstack/react-query";
import apiClient from "../../apiClient";
import type { ApiResponse } from "../../../types/user.types";
import type { 
  DoctorReview, 
  CreateDoctorReviewRequest, 
  GetDoctorReviewsResponse 
} from "../../../types/doctor.types";
import { showError, successMesssage } from "@/utils/message";

/**
 * Hook to submit a review for a doctor.
 * POST /doctor/reviews
 */
export const useCreateDoctorReview = (
  options?: UseMutationOptions<
    ApiResponse<DoctorReview>,
    Error,
    CreateDoctorReviewRequest
  >
) => {
  return useMutation<
    ApiResponse<DoctorReview>,
    Error,
    CreateDoctorReviewRequest
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<DoctorReview>>(
        "/doctor/reviews",
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Review submitted successfully"),
  });
};

/**
 * Hook to fetch reviews for a specific doctor.
 * GET /doctor/:id/reviews
 */
export const useGetDoctorReviews = (
  doctorId: string,
  params?: {
    page?: number;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<ApiResponse<GetDoctorReviewsResponse>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<GetDoctorReviewsResponse>, Error>({
    queryKey: ["doctorReviews", doctorId, params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<GetDoctorReviewsResponse>>(
        `/doctor/${doctorId}/reviews`,
        { params }
      );
      return response.data;
    },
    enabled: !!doctorId && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to retrieve a review for a specific appointment.
 * GET /doctor/reviews/appointment/:appointmentId
 */
export const useGetReviewByAppointmentId = (
  appointmentId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<DoctorReview>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<DoctorReview>, Error>({
    queryKey: ["doctorReviewByAppointment", appointmentId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DoctorReview>>(
        `/doctor/reviews/appointment/${appointmentId}`
      );
      return response.data;
    },
    enabled: !!appointmentId && (options?.enabled ?? true),
    ...options,
  });
};
