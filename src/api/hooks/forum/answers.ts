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
  ForumAnswer,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  ListAnswersParams,
  ListAnswersResponseData
} from "../../../types/forum.types";

/**
 * Hook to create a new answer for a question.
 * POST /forum/questions/:questionId/answers
 */
export const useCreateAnswer = (
  options?: UseMutationOptions<
    ApiResponse<ForumAnswer>,
    Error,
    { questionId: string; payload: CreateAnswerRequest }
  >
) => {
  return useMutation<
    ApiResponse<ForumAnswer>,
    Error,
    { questionId: string; payload: CreateAnswerRequest }
  >({
    mutationFn: async ({ questionId, payload }) => {
      const response = await apiClient.post<ApiResponse<ForumAnswer>>(
        `/forum/questions/${questionId}/answers`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Answer submitted successfully"),
  });
};

/**
 * Hook to get answers for a question.
 * GET /forum/questions/:questionId/answers
 */
export const useGetAnswers = (
  questionId: string,
  params?: ListAnswersParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListAnswersResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ListAnswersResponseData>, Error>({
    queryKey: ["forum", "answers", questionId, params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ListAnswersResponseData>>(
        `/forum/questions/${questionId}/answers`,
        { params }
      );
      return response.data;
    },
    enabled: !!questionId && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to update an existing answer.
 * PUT /forum/questions/answers/:id
 */
export const useUpdateAnswer = (
  options?: UseMutationOptions<
    ApiResponse<ForumAnswer>,
    Error,
    { id: string; payload: UpdateAnswerRequest }
  >
) => {
  return useMutation<
    ApiResponse<ForumAnswer>,
    Error,
    { id: string; payload: UpdateAnswerRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.put<ApiResponse<ForumAnswer>>(
        `/forum/questions/answers/${id}`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Answer updated successfully"),
  });
};

/**
 * Hook to delete an existing answer.
 * DELETE /forum/questions/answers/:id
 */
export const useDeleteAnswer = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/forum/questions/answers/${id}`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Answer deleted successfully"),
  });
};

/**
 * Hook to accept/unaccept an answer.
 * PATCH /forum/questions/answers/:id/accept
 */
export const useAcceptAnswer = (
  options?: UseMutationOptions<ApiResponse<ForumAnswer>, Error, string>
) => {
  return useMutation<ApiResponse<ForumAnswer>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.patch<ApiResponse<ForumAnswer>>(
        `/forum/questions/answers/${id}/accept`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Answer status updated"),
  });
};
