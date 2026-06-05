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
  CastVoteRequest,
  CastVoteResponseData,
  VoteStatusParams,
  VoteStatusResponseData
} from "../../../types/forum.types";

/**
 * Hook to cast, flip, or undo a vote on a question or answer.
 * POST /forum/votes
 */
export const useCastVote = (
  options?: UseMutationOptions<
    ApiResponse<CastVoteResponseData>,
    Error,
    CastVoteRequest
  >
) => {
  return useMutation<
    ApiResponse<CastVoteResponseData>,
    Error,
    CastVoteRequest
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<CastVoteResponseData>>(
        "/forum/votes",
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: (res) => {
      let msg = "Vote processed successfully";
      if (res.data.action === "voted") {
        msg = `Content ${res.data.voteType?.toLowerCase()}d successfully`;
      } else if (res.data.action === "removed") {
        msg = "Vote removed successfully";
      } else if (res.data.action === "changed") {
        msg = `Vote changed to ${res.data.voteType?.toLowerCase()} successfully`;
      }
      successMesssage(msg);
    },
  });
};

/**
 * Hook to check the user's vote status on a question or answer.
 * GET /forum/votes/status
 */
export const useGetVoteStatus = (
  params: VoteStatusParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<VoteStatusResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<VoteStatusResponseData>, Error>({
    queryKey: ["forum", "voteStatus", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<VoteStatusResponseData>>(
        "/forum/votes/status",
        { params }
      );
      return response.data;
    },
    enabled: !!params.targetId && !!params.targetType && (options?.enabled ?? true),
    ...options,
  });
};
