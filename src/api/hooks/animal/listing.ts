import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import apiClient from "../../apiClient";
import type { ApiResponse } from "../../../types/user.types";
import type { CreateAnimalListingRequest, CattleListing } from "../../../types/animal.types";
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
export default useCreateAnimalListing;
