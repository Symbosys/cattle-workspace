import { 
  useMutation, 
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from "@tanstack/react-query";
import apiClient from "../../apiClient";
import type { ApiResponse } from "../../../types/user.types";
import { showError, successMesssage } from "@/utils/message";
import type {
  ForumReport,
  CreateReportRequest,
  ReviewReportRequest,
  ListReportsParams,
  ListReportsResponseData,
  GetPendingCountResponseData
} from "../../../types/forum.types";

/**
 * Hook to submit a report on a question, answer, or comment.
 * POST /forum/reports
 */
export const useCreateReport = (
  options?: UseMutationOptions<
    ApiResponse<ForumReport>,
    Error,
    CreateReportRequest
  >
) => {
  return useMutation<
    ApiResponse<ForumReport>,
    Error,
    CreateReportRequest
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<ForumReport>>(
        "/forum/reports",
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Report submitted successfully"),
  });
};

/**
 * Hook to list all reports (Admin-only).
 * GET /forum/reports
 */
export const useGetReports = (
  params?: ListReportsParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListReportsResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ListReportsResponseData>, Error>({
    queryKey: ["forum", "reports", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ListReportsResponseData>>(
        "/forum/reports",
        { params }
      );
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to get the pending reports count (Admin-only).
 * GET /forum/reports/pending-count
 */
export const useGetPendingReportsCount = (
  options?: Omit<
    UseQueryOptions<ApiResponse<GetPendingCountResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<GetPendingCountResponseData>, Error>({
    queryKey: ["forum", "reports", "pendingCount"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<GetPendingCountResponseData>>(
        "/forum/reports/pending-count"
      );
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to get a single report details by ID (Admin-only).
 * GET /forum/reports/:id
 */
export const useGetReport = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ForumReport>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ForumReport>, Error>({
    queryKey: ["forum", "report", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ForumReport>>(
        `/forum/reports/${id}`
      );
      return response.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to review (resolve/dismiss) a report (Admin-only).
 * PATCH /forum/reports/:id
 */
export const useReviewReport = (
  options?: UseMutationOptions<
    ApiResponse<ForumReport>,
    Error,
    { id: string; payload: ReviewReportRequest }
  >
) => {
  return useMutation<
    ApiResponse<ForumReport>,
    Error,
    { id: string; payload: ReviewReportRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.patch<ApiResponse<ForumReport>>(
        `/forum/reports/${id}`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Report reviewed successfully"),
  });
};
