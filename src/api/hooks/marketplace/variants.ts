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
  ProductVariant,
  CreateVariantRequest,
  UpdateVariantRequest
} from "../../../types/marketplace.types";

/**
 * Hook to create a product variant.
 * POST /marketplace/variants/product/:productId
 */
export const useCreateVariant = (
  options?: UseMutationOptions<
    ApiResponse<ProductVariant>,
    Error,
    { productId: string; payload: CreateVariantRequest }
  >
) => {
  return useMutation<
    ApiResponse<ProductVariant>,
    Error,
    { productId: string; payload: CreateVariantRequest }
  >({
    mutationFn: async ({ productId, payload }) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "image") return;
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append file if present
      if (payload.image) {
        formData.append("image", payload.image);
      }

      const response = await apiClient.post<ApiResponse<ProductVariant>>(
        `/marketplace/variants/product/${productId}`,
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
    onSuccess: () => successMesssage("Variant created successfully"),
  });
};

/**
 * Hook to update an existing product variant.
 * PUT /marketplace/variants/:id
 */
export const useUpdateVariant = (
  options?: UseMutationOptions<
    ApiResponse<ProductVariant>,
    Error,
    { id: string; payload: UpdateVariantRequest }
  >
) => {
  return useMutation<
    ApiResponse<ProductVariant>,
    Error,
    { id: string; payload: UpdateVariantRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "image") return;
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append file if present
      if (payload.image) {
        formData.append("image", payload.image);
      }

      const response = await apiClient.put<ApiResponse<ProductVariant>>(
        `/marketplace/variants/${id}`,
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
    onSuccess: () => successMesssage("Variant updated successfully"),
  });
};

/**
 * Hook to delete an existing product variant.
 * DELETE /marketplace/variants/:id
 */
export const useDeleteVariant = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/marketplace/variants/${id}`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Variant deleted successfully"),
  });
};

/**
 * Hook to get a product variant by ID.
 * GET /marketplace/variants/:id
 */
export const useGetVariantById = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<ProductVariant>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<ProductVariant>, Error>({
    queryKey: ["marketplace", "variant", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<ProductVariant>>(
        `/marketplace/variants/${id}`
      );
      return response.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};
