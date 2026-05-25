import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import apiClient from "../../apiClient";
import type { ApiResponse } from "../../../types/user.types";
import type {
  Category,
  SubCategory,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateSubCategoryRequest,
  UpdateSubCategoryRequest
} from "../../../types/animal-category";
import { showError, successMesssage } from "@/utils/message";

// ======================== CATEGORY ========================

export const useCreateCategory = (
  options?: UseMutationOptions<ApiResponse<Category>, Error, CreateCategoryRequest>
) => {
  return useMutation({
    mutationFn: async (data: CreateCategoryRequest) => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      const response = await apiClient.post<ApiResponse<Category>>("/animal/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    ...options,
    onSuccess : () => {
      successMesssage("Category created successfully")
    },
    onError: (error) => showError(error)
  });
};

export const useGetAllCategories = (
  options?: Partial<UseQueryOptions<ApiResponse<Category[]>, Error>>
) => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Category[]>>("/animal/categories");
      return response.data;
    },
    ...options,
  });
};

export const useUpdateCategory = (
  options?: UseMutationOptions<ApiResponse<Category>, Error, UpdateCategoryRequest>
) => {
  return useMutation({
    mutationFn: async (data: UpdateCategoryRequest) => {
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.description !== undefined) formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      const response = await apiClient.put<ApiResponse<Category>>(`/animal/categories/${data.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    ...options,
    onSuccess: () => {
      successMesssage("Category updated successfully")
    },
    onError: (error) => showError(error)
  });
};

// ======================== SUBCATEGORY ========================

export const useCreateSubCategory = (
  options?: UseMutationOptions<ApiResponse<SubCategory>, Error, CreateSubCategoryRequest>
) => {
  return useMutation({
    mutationFn: async (data: CreateSubCategoryRequest) => {
      const formData = new FormData();
      formData.append("categoryId", data.categoryId);
      formData.append("name", data.name);
      if (data.description) formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      const response = await apiClient.post<ApiResponse<SubCategory>>("/animal/subcategories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    ...options,
    onSuccess: () => {
      successMesssage("Sub Category created successfully")
    },
    onError: (error) => showError(error)
  });
};

export const useGetAllSubCategories = (
  options?: Partial<UseQueryOptions<ApiResponse<SubCategory[]>, Error>>
) => {
  return useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<SubCategory[]>>("/animal/subcategories");
      return response.data;
    },
    ...options,
  });
};

export const useUpdateSubCategory = (
  options?: UseMutationOptions<ApiResponse<SubCategory>, Error, UpdateSubCategoryRequest>
) => {
  return useMutation({
    mutationFn: async (data: UpdateSubCategoryRequest) => {
      const formData = new FormData();
      if (data.categoryId) formData.append("categoryId", data.categoryId);
      if (data.name) formData.append("name", data.name);
      if (data.description !== undefined) formData.append("description", data.description);
      if (data.image) formData.append("image", data.image);

      const response = await apiClient.put<ApiResponse<SubCategory>>(`/animal/subcategories/${data.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    ...options,
    onSuccess: () => {
      successMesssage("Sub Category updated successfully")
    },
    onError: (error) => showError(error)
  });
};
