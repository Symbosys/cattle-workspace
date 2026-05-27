import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import apiClient from "../../apiClient";
import type { ApiResponse } from "../../../types/user.types";
import type {
  CreateAnimalListingRequest,
  CattleListing,
  UpdateAnimalListingRequest,
  City,
} from "../../../types/animal.types";
import { showError, successMesssage } from "@/utils/message";

/**
 * Hook to create a new animal listing (with file uploads).
 * POST /animal/listing
 */
export const useCreateAnimalListing = (
  options?: UseMutationOptions<
    ApiResponse<CattleListing>,
    Error,
    CreateAnimalListingRequest
  >,
) => {
  return useMutation<
    ApiResponse<CattleListing>,
    Error,
    CreateAnimalListingRequest
  >({
    mutationFn: async (payload) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") return; // Skip images array, processed below
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append files
      if (payload.images && payload.images.length > 0) {
        payload.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await apiClient.post<ApiResponse<CattleListing>>(
        "/animal/listing",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Animal listing created successfully"),
  });
};

/**
 * Hook to update an existing animal listing.
 * PUT /animal/listing/:id
 */
export const useUpdateAnimalListing = (
  options?: UseMutationOptions<
    ApiResponse<CattleListing>,
    Error,
    { id: string; payload: UpdateAnimalListingRequest }
  >,
) => {
  return useMutation<
    ApiResponse<CattleListing>,
    Error,
    { id: string; payload: UpdateAnimalListingRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "images") return; // Skip images array, processed below
        if (key === "keepImageIds") {
          if (value !== undefined && value !== null) {
            formData.append(key, JSON.stringify(value));
          }
          return;
        }
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append files
      if (payload.images && payload.images.length > 0) {
        payload.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      const response = await apiClient.put<ApiResponse<CattleListing>>(
        `/animal/listing/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Animal listing updated successfully"),
  });
};

export interface GetListedAnimalsByLocationResponse {
  city: City;
  listings: CattleListing[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    count: number;
  };
}

/**
 * Hook to get listed animals by location.
 * GET /animal/listing/location
 */
export const useGetListedAnimalsByLocation = (
  params: {
    latitude: number;
    longitude: number;
    page?: number;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<ApiResponse<GetListedAnimalsByLocationResponse>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ApiResponse<GetListedAnimalsByLocationResponse>, Error>({
    queryKey: ["animalListings", "location", params],
    queryFn: async () => {
      const response = await apiClient.get<
        ApiResponse<GetListedAnimalsByLocationResponse>
      >("/animal/listing/location", {
        params,
      });
      return response.data;
    },
    // The !! check ensures we only fetch when both latitude and longitude exist
    enabled:
      !!params.latitude && !!params.longitude && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to get a cattle listing by ID.
 * GET /animal/listing/:id
 */
export const useGetAnimalListingById = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<CattleListing>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<ApiResponse<CattleListing>, Error>({
    queryKey: ["animalListing", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<CattleListing>>(
        `/animal/listing/${id}`,
      );
      return response.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

export default useCreateAnimalListing;
