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
  ForumQuestion,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  ListQuestionsParams,
  ListQuestionsResponseData
} from "../../../types/forum.types";

/**
 * Hook to create a new forum question.
 * POST /forum/questions
 */
export const useCreateQuestion = (
  options?: UseMutationOptions<
    ApiResponse<ForumQuestion>,
    Error,
    CreateQuestionRequest
  >
) => {
  return useMutation<
    ApiResponse<ForumQuestion>,
    Error,
    CreateQuestionRequest
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<ForumQuestion>>(
        "/forum/questions",
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Question created successfully"),
  });
};

/**
 * Hook to get a single forum question by slug.
 * GET /forum/questions/:slug
 */
export const useGetQuestion = (
  slug: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ForumQuestion>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ForumQuestion>, Error>({
    queryKey: ["forum", "question", slug],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ForumQuestion>>(
        `/forum/questions/${slug}`
      );
      return response.data;
    },
    enabled: !!slug && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to list forum questions.
 * GET /forum/questions
 */
export const useGetQuestions = (
  params?: ListQuestionsParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListQuestionsResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ListQuestionsResponseData>, Error>({
    queryKey: ["forum", "questions", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ListQuestionsResponseData>>(
        "/forum/questions",
        { params }
      );
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to update an existing forum question.
 * PUT /forum/questions/:id
 */
export const useUpdateQuestion = (
  options?: UseMutationOptions<
    ApiResponse<ForumQuestion>,
    Error,
    { id: string; payload: UpdateQuestionRequest }
  >
) => {
  return useMutation<
    ApiResponse<ForumQuestion>,
    Error,
    { id: string; payload: UpdateQuestionRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.put<ApiResponse<ForumQuestion>>(
        `/forum/questions/${id}`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Question updated successfully"),
  });
};

/**
 * Hook to delete a forum question.
 * DELETE /forum/questions/:id
 */
export const useDeleteQuestion = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/forum/questions/${id}`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Question deleted successfully"),
  });
};
