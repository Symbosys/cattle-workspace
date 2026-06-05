import { 
  useMutation, 
  UseMutationOptions,
  useQuery,
  UseQueryOptions
} from "@tanstack/react-query";
import apiClient from "../../apiClient";
import type { ApiResponse } from "../../../types/user.types";
import type { RegisterDoctorRequest, DoctorProfile, UpdateDoctorRequest, GetDoctorsByLocationResponse } from "../../../types/doctor.types";
import { showError, successMesssage } from "@/utils/message";

/**
 * Hook to register a user as a doctor (with optional qualification file upload).
 * POST /doctor/register
 */
export const useRegisterDoctor = (
  options?: UseMutationOptions<
    ApiResponse<DoctorProfile>,
    Error,
    RegisterDoctorRequest
  >
) => {
  return useMutation<
    ApiResponse<DoctorProfile>,
    Error,
    RegisterDoctorRequest
  >({
    mutationFn: async (payload) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "qualificationDoc") return; // Skip file, processed below
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append qualification file if present
      if (payload.qualificationDoc) {
        formData.append("qualificationDoc", payload.qualificationDoc);
      }

      const response = await apiClient.post<ApiResponse<DoctorProfile>>(
        "/doctor/register",
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
    onSuccess: () => successMesssage("Doctor registered successfully"),
  });
};

/**
 * Hook to get a doctor profile by ID.
 * GET /doctor/:id
 */
export const useGetDoctorById = (
  id: string,
  options?: Omit<
    UseQueryOptions<ApiResponse<DoctorProfile>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<DoctorProfile>, Error>({
    queryKey: ["doctorProfile", id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<DoctorProfile>>(
        `/doctor/${id}`
      );
      return response.data;
    },
    enabled: !!id && (options?.enabled ?? true),
    ...options,
  });
};

/**
 * Hook to update an existing doctor profile.
 * PUT /doctor/:id
 */
export const useUpdateDoctor = (
  options?: UseMutationOptions<
    ApiResponse<DoctorProfile>,
    Error,
    { id: string; payload: UpdateDoctorRequest }
  >
) => {
  return useMutation<
    ApiResponse<DoctorProfile>,
    Error,
    { id: string; payload: UpdateDoctorRequest }
  >({
    mutationFn: async ({ id, payload }) => {
      const formData = new FormData();

      // Append textual properties
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "qualificationDoc") return; // Skip file, processed below
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Append qualification file if present
      if (payload.qualificationDoc) {
        formData.append("qualificationDoc", payload.qualificationDoc);
      }

      const response = await apiClient.put<ApiResponse<DoctorProfile>>(
        `/doctor/${id}`,
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
    onSuccess: () => successMesssage("Doctor profile updated successfully"),
  });
};

/**
 * Hook to get doctors near a user's location.
 * GET /doctor/location
 */
export const useGetDoctorsByLocation = (
  params: {
    latitude: number;
    longitude: number;
    radius?: number;
    page?: number;
    limit?: number;
  },
  options?: Omit<
    UseQueryOptions<ApiResponse<GetDoctorsByLocationResponse>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<GetDoctorsByLocationResponse>, Error>({
    queryKey: ["doctors", "location", params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<GetDoctorsByLocationResponse>>(
        "/doctor/location",
        { params }
      );
      return response.data;
    },
    enabled: !!params.latitude && !!params.longitude && (options?.enabled ?? true),
    ...options,
  });
};
