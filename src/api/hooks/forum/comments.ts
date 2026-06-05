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
  ForumComment,
  CreateCommentRequest,
  UpdateCommentRequest
} from "../../../types/forum.types";

/**
 * Hook to submit a comment on a question.
 * POST /forum/questions/:questionId/comments
 */
export const useCreateQuestionComment = (
  options?: UseMutationOptions<
    ApiResponse<ForumComment>,
    Error,
    { questionId: string; payload: CreateCommentRequest }
  >
) => {
  return useMutation<
    ApiResponse<ForumComment>,
    Error,
    { questionId: string; payload: CreateCommentRequest }
  >({
    mutationFn: async ({ questionId, payload }) => {
      const response = await apiClient.post<ApiResponse<ForumComment>>(
        `/forum/questions/${questionId}/comments`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Comment added successfully"),
  });
};

/**
 * Hook to list comments for a question.
 * GET /forum/questions/:questionId/comments
 */
export const useGetQuestionComments = (
  questionId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ForumComment[]>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ForumComment[]>, Error>({
    queryKey: ["forum", "questionComments", questionId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ForumComment[]>>(
        `/forum/questions/${questionId}/comments`
      );
      return response.data;
    },
    enabled: !!questionId && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to submit a comment on an answer.
 * POST /forum/answers/:answerId/comments
 */
export const useCreateAnswerComment = (
  options?: UseMutationOptions<
    ApiResponse<ForumComment>,
    Error,
    { answerId: string; payload: CreateCommentRequest }
  >
) => {
  return useMutation<
    ApiResponse<ForumComment>,
    Error,
    { answerId: string; payload: CreateCommentRequest }
  >({
    mutationFn: async ({ answerId, payload }) => {
      const response = await apiClient.post<ApiResponse<ForumComment>>(
        `/forum/answers/${answerId}/comments`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Comment added successfully"),
  });
};

/**
 * Hook to list comments for an answer.
 * GET /forum/answers/:answerId/comments
 */
export const useGetAnswerComments = (
  answerId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ForumComment[]>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ForumComment[]>, Error>({
    queryKey: ["forum", "answerComments", answerId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ForumComment[]>>(
        `/forum/answers/${answerId}/comments`
      );
      return response.data;
    },
    enabled: !!answerId && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to update an existing comment.
 * PUT /forum/comments/:id
 */
export const useUpdateComment = (
  options?: UseMutationOptions<
    ApiResponse<ForumComment>,
    Error,
    { id: string; payload: UpdateCommentRequest }
  >
) => {
  return useMutation<
    ApiResponse<ForumComment>,
    Error,
    { id: string; payload: UpdateCommentRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.put<ApiResponse<ForumComment>>(
        `/forum/comments/${id}`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Comment updated successfully"),
  });
};

/**
 * Hook to delete an existing comment.
 * DELETE /forum/comments/:id
 */
export const useDeleteComment = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/forum/comments/${id}`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Comment deleted successfully"),
  });
};
