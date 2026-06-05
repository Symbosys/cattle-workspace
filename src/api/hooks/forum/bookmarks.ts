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
  ForumBookmark,
  ListBookmarksParams,
  ListBookmarksResponseData
} from "../../../types/forum.types";

/**
 * Hook to toggle a bookmark on a question.
 * POST /forum/bookmarks
 */
export const useToggleBookmark = (
  options?: UseMutationOptions<
    ApiResponse<{ bookmarked: boolean }>,
    Error,
    { questionId: string }
  >
) => {
  return useMutation<
    ApiResponse<{ bookmarked: boolean }>,
    Error,
    { questionId: string }
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<{ bookmarked: boolean }>>(
        "/forum/bookmarks",
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: (res) => {
      const msg = res.data.bookmarked
        ? "Question bookmarked successfully"
        : "Bookmark removed successfully";
      successMesssage(msg);
    },
  });
};

/**
 * Hook to list user bookmarks.
 * GET /forum/bookmarks
 */
export const useGetBookmarks = (
  params?: ListBookmarksParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<ListBookmarksResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ListBookmarksResponseData>, Error>({
    queryKey: ["forum", "bookmarks", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ListBookmarksResponseData>>(
        "/forum/bookmarks",
        { params }
      );
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to check if a question is bookmarked by the user.
 * GET /forum/bookmarks/status/:questionId
 */
export const useGetBookmarkStatus = (
  questionId: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<{ isBookmarked: boolean }>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<{ isBookmarked: boolean }>, Error>({
    queryKey: ["forum", "bookmarkStatus", questionId],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<{ isBookmarked: boolean }>>(
        `/forum/bookmarks/status/${questionId}`
      );
      return response.data;
    },
    enabled: !!questionId && (options?.enabled ?? true),
    ...options,
  });
};
