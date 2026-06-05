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
  ProductReview,
  CreateReviewRequest,
  UpdateReviewRequest,
  GetProductReviewsParams,
  GetProductReviewsResponseData
} from "../../../types/marketplace.types";

/**
 * Hook to submit a review for a product.
 * POST /marketplace/reviews/product/:productId
 */
export const useCreateReview = (
  options?: UseMutationOptions<
    ApiResponse<ProductReview>,
    Error,
    { productId: string; payload: CreateReviewRequest }
  >
) => {
  return useMutation<
    ApiResponse<ProductReview>,
    Error,
    { productId: string; payload: CreateReviewRequest }
  >({
    mutationFn: async ({ productId, payload }) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") return;
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append image files if present
      if (payload.images && payload.images.length > 0) {
        payload.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await apiClient.post<ApiResponse<ProductReview>>(
        `/marketplace/reviews/product/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Review submitted successfully"),
  });
};

/**
 * Hook to update an existing review.
 * PUT /marketplace/reviews/:id
 */
export const useUpdateReview = (
  options?: UseMutationOptions<
    ApiResponse<ProductReview>,
    Error,
    { id: string; payload: UpdateReviewRequest }
  >
) => {
  return useMutation<
    ApiResponse<ProductReview>,
    Error,
    { id: string; payload: UpdateReviewRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images" || key === "keepImages") return;
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append image files if present
      if (payload.images && payload.images.length > 0) {
        payload.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Serialize keepImages as "images" array for existing images to preserve
      if (payload.keepImages !== undefined) {
        formData.append("images", JSON.stringify(payload.keepImages));
      }

      const response = await apiClient.put<ApiResponse<ProductReview>>(
        `/marketplace/reviews/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Review updated successfully"),
  });
};

/**
 * Hook to add a reply from the seller/brand owner to a review.
 * POST /marketplace/reviews/:id/reply
 */
export const useAddSellerReply = (
  options?: UseMutationOptions<
    ApiResponse<ProductReview>,
    Error,
    { id: string; reply: string }
  >
) => {
  return useMutation<
    ApiResponse<ProductReview>,
    Error,
    { id: string; reply: string }
  >({
    mutationFn: async ({ id, reply }) => {
      const response = await apiClient.post<ApiResponse<ProductReview>>(
        `/marketplace/reviews/${id}/reply`,
        { reply }
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Reply submitted successfully"),
  });
};

/**
 * Hook to delete an existing product review.
 * DELETE /marketplace/reviews/:id
 */
export const useDeleteReview = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/marketplace/reviews/${id}`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Review deleted successfully"),
  });
};

/**
 * Hook to fetch reviews list for a specific product.
 * GET /marketplace/reviews/product/:productId
 */
export const useGetProductReviews = (
  productId: string,
  params?: GetProductReviewsParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<GetProductReviewsResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<GetProductReviewsResponseData>, Error>({
    queryKey: ["marketplace", "productReviews", productId, params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<GetProductReviewsResponseData>>(
        `/marketplace/reviews/product/${productId}`,
        { params }
      );
      return response.data;
    },
    enabled: !!productId && (options?.enabled ?? true),
    ...options,
  });
};
