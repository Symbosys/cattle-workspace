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
  MarketplaceCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  GetCategoriesParams
} from "../../../types/marketplace.types";

/**
 * Hook to create a new category.
 * POST /marketplace/categories
 */
export const useCreateCategory = (
  options?: UseMutationOptions<
    ApiResponse<MarketplaceCategory>,
    Error,
    CreateCategoryRequest
  >
) => {
  return useMutation<
    ApiResponse<MarketplaceCategory>,
    Error,
    CreateCategoryRequest
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<MarketplaceCategory>>(
        "/marketplace/categories",
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Category created successfully"),
  });
};

/**
 * Hook to update an existing category.
 * PUT /marketplace/categories/:id
 */
export const useUpdateCategory = (
  options?: UseMutationOptions<
    ApiResponse<MarketplaceCategory>,
    Error,
    { id: string; payload: UpdateCategoryRequest }
  >
) => {
  return useMutation<
    ApiResponse<MarketplaceCategory>,
    Error,
    { id: string; payload: UpdateCategoryRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const response = await apiClient.put<ApiResponse<MarketplaceCategory>>(
        `/marketplace/categories/${id}`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Category updated successfully"),
  });
};

/**
 * Hook to get a category by ID.
 * GET /marketplace/categories/:id
 */
export const useGetCategoryById = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<MarketplaceCategory>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<MarketplaceCategory>, Error>({
    queryKey: ["marketplace", "category", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MarketplaceCategory>>(
        `/marketplace/categories/${id}`
      );
      return response.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to list categories matching optional filters.
 * GET /marketplace/categories
 */
export const useGetCategories = (
  params?: GetCategoriesParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<MarketplaceCategory[]>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<MarketplaceCategory[]>, Error>({
    queryKey: ["marketplace", "categories", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MarketplaceCategory[]>>(
        "/marketplace/categories",
        { params }
      );
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to delete an existing category.
 * DELETE /marketplace/categories/:id
 */
export const useDeleteCategory = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/marketplace/categories/${id}`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Category deleted successfully"),
  });
};
