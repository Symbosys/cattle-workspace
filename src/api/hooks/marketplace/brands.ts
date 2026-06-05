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
  BrandProfile,
  RegisterBrandRequest,
  UpdateBrandRequest,
  GetBrandsByLocationParams,
  GetBrandsByLocationResponseData
} from "../../../types/marketplace.types";

/**
 * Hook to register a new brand profile.
 * POST /marketplace/brands/register
 */
export const useRegisterBrand = (
  options?: UseMutationOptions<
    ApiResponse<BrandProfile>,
    Error,
    RegisterBrandRequest
  >
) => {
  return useMutation<
    ApiResponse<BrandProfile>,
    Error,
    RegisterBrandRequest
  >({
    mutationFn: async (payload) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "logo" || key === "banner") return;
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append files if present
      if (payload.logo) {
        formData.append("logo", payload.logo);
      }
      if (payload.banner) {
        formData.append("banner", payload.banner);
      }

      const response = await apiClient.post<ApiResponse<BrandProfile>>(
        "/marketplace/brands/register",
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
    onSuccess: () => successMesssage("Brand registered successfully"),
  });
};

/**
 * Hook to get brands nearby a location.
 * GET /marketplace/brands
 */
export const useGetBrandsByLocation = (
  params: GetBrandsByLocationParams,
  options?: Omit<
    UseQueryOptions<ApiResponse<GetBrandsByLocationResponseData>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<GetBrandsByLocationResponseData>, Error>({
    queryKey: ["marketplace", "brands", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<GetBrandsByLocationResponseData>>(
        "/marketplace/brands",
        { params }
      );
      return response.data;
    },
    enabled: !!params.latitude && !!params.longitude && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to get a brand profile by ID.
 * GET /marketplace/brands/:id
 */
export const useGetBrandById = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<BrandProfile>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<BrandProfile>, Error>({
    queryKey: ["marketplace", "brand", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<BrandProfile>>(
        `/marketplace/brands/${id}`
      );
      return response.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to update an existing brand profile.
 * PUT /marketplace/brands/:id
 */
export const useUpdateBrand = (
  options?: UseMutationOptions<
    ApiResponse<BrandProfile>,
    Error,
    { id: string; payload: UpdateBrandRequest }
  >
) => {
  return useMutation<
    ApiResponse<BrandProfile>,
    Error,
    { id: string; payload: UpdateBrandRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "logo" || key === "banner") return;
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append files if present
      if (payload.logo) {
        formData.append("logo", payload.logo);
      }
      if (payload.banner) {
        formData.append("banner", payload.banner);
      }

      const response = await apiClient.put<ApiResponse<BrandProfile>>(
        `/marketplace/brands/${id}`,
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
    onSuccess: () => successMesssage("Brand profile updated successfully"),
  });
};
