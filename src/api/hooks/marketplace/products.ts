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
  MarketplaceProduct,
  CreateProductRequest,
  UpdateProductRequest,
  GetProductsParams,
  GetProductsResponseData
} from "../../../types/marketplace.types";

/**
 * Hook to create a new product (supports optional nested variants and attributes).
 * POST /marketplace/products
 */
export const useCreateProduct = (
  options?: UseMutationOptions<
    ApiResponse<MarketplaceProduct>,
    Error,
    CreateProductRequest
  >
) => {
  return useMutation<
    ApiResponse<MarketplaceProduct>,
    Error,
    CreateProductRequest
  >({
    mutationFn: async (payload) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images" || key === "variants" || key === "attributes") return;
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

      // Serialize variants and attributes to JSON strings (parsed by backend controller)
      if (payload.variants && payload.variants.length > 0) {
        formData.append("variants", JSON.stringify(payload.variants));
      }
      if (payload.attributes) {
        formData.append("attributes", JSON.stringify(payload.attributes));
      }

      const response = await apiClient.post<ApiResponse<MarketplaceProduct>>(
        "/marketplace/products",
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
    onSuccess: () => successMesssage("Product created successfully"),
  });
};

/**
 * Hook to update an existing product.
 * PUT /marketplace/products/:id
 */
export const useUpdateProduct = (
  options?: UseMutationOptions<
    ApiResponse<MarketplaceProduct>,
    Error,
    { id: string; payload: UpdateProductRequest }
  >
) => {
  return useMutation<
    ApiResponse<MarketplaceProduct>,
    Error,
    { id: string; payload: UpdateProductRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images" || key === "attributes" || key === "keepImages") return;
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

      // Serialize attributes if present
      if (payload.attributes) {
        formData.append("attributes", JSON.stringify(payload.attributes));
      }

      // Serialize keepImages as "images" array for existing images to preserve
      if (payload.keepImages !== undefined) {
        formData.append("images", JSON.stringify(payload.keepImages));
      }

      const response = await apiClient.put<ApiResponse<MarketplaceProduct>>(
        `/marketplace/products/${id}`,
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
    onSuccess: () => successMesssage("Product updated successfully"),
  });
};

/**
 * Hook to delete an existing product.
 * DELETE /marketplace/products/:id
 */
export const useDeleteProduct = (
  options?: UseMutationOptions<ApiResponse<null>, Error, string>
) => {
  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: async (id) => {
      const response = await apiClient.delete<ApiResponse<null>>(
        `/marketplace/products/${id}`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Product deleted successfully"),
  });
};

/**
 * Hook to get a product by Slug.
 * GET /marketplace/products/slug/:slug
 */
export const useGetProductBySlug = (
  slug: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<MarketplaceProduct>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<MarketplaceProduct>, Error>({
    queryKey: ["marketplace", "product", "slug", slug],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MarketplaceProduct>>(
        `/marketplace/products/slug/${slug}`
      );
      return response.data;
    },
    enabled: !!slug && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to get a product by ID.
 * GET /marketplace/products/:id
 */
export const useGetProductById = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<MarketplaceProduct>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<MarketplaceProduct>, Error>({
    queryKey: ["marketplace", "product", "id", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<MarketplaceProduct>>(
        `/marketplace/products/${id}`
      );
      return response.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to list products matching filters.
 * GET /marketplace/products
 */
export const useGetProducts = (
  params?: GetProductsParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<GetProductsResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<GetProductsResponseData>, Error>({
    queryKey: ["marketplace", "products", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<GetProductsResponseData>>(
        "/marketplace/products",
        { params }
      );
      return response.data;
    },
    ...options,
  });
};
