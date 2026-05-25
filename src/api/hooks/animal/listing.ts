import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import apiClient from "../../apiClient";
import type { ApiResponse } from "../../../types/user.types";
import type { CreateAnimalListingRequest, CattleListing, UpdateAnimalListingRequest } from "../../../types/animal.types";
import { showError, successMesssage } from "@/utils/message";

/**
 * Hook to create a new animal listing (with file uploads).
 * POST /animal/listing
 */
export const useCreateAnimalListing = (
  options?: UseMutationOptions<ApiResponse<CattleListing>, Error, CreateAnimalListingRequest>
) => {
  return useMutation<ApiResponse<CattleListing>, Error, CreateAnimalListingRequest>({
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
        }
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
  >
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
        }
      );

      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Animal listing updated successfully"),
  });
};

export default useCreateAnimalListing;
