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
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest
} from "../../../types/marketplace.types";

/**
 * Hook to fetch the authenticated user's cart.
 * GET /marketplace/cart
 */
export const useGetCart = (
  options?: Omit<
    UseQueryOptions<ApiResponse<Cart>, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ApiResponse<Cart>, Error>({
    queryKey: ["marketplace", "cart"],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Cart>>(
        "/marketplace/cart"
      );
      return response.data;
    },
    ...options,
  });
};

/**
 * Hook to add an item to the cart.
 * POST /marketplace/cart/items
 */
export const useAddToCart = (
  options?: UseMutationOptions<
    ApiResponse<Cart>,
    Error,
    AddToCartRequest
  >
) => {
  return useMutation<
    ApiResponse<Cart>,
    Error,
    AddToCartRequest
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post<ApiResponse<Cart>>(
        "/marketplace/cart/items",
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Item added to cart"),
  });
};

/**
 * Hook to update the quantity of an item in the cart.
 * PUT /marketplace/cart/items/:itemId
 */
export const useUpdateCartItem = (
  options?: UseMutationOptions<
    ApiResponse<Cart>,
    Error,
    { itemId: string; payload: UpdateCartItemRequest }
  >
) => {
  return useMutation<
    ApiResponse<Cart>,
    Error,
    { itemId: string; payload: UpdateCartItemRequest }
  >({
    mutationFn: async ({ itemId, payload }) => {
      const response = await apiClient.put<ApiResponse<Cart>>(
        `/marketplace/cart/items/${itemId}`,
        payload
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
  });
};

/**
 * Hook to remove a single item from the cart.
 * DELETE /marketplace/cart/items/:itemId
 */
export const useRemoveCartItem = (
  options?: UseMutationOptions<
    ApiResponse<Cart>,
    Error,
    string // itemId
  >
) => {
  return useMutation<
    ApiResponse<Cart>,
    Error,
    string
  >({
    mutationFn: async (itemId) => {
      const response = await apiClient.delete<ApiResponse<Cart>>(
        `/marketplace/cart/items/${itemId}`
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Item removed from cart"),
  });
};

/**
 * Hook to clear all items from the cart.
 * DELETE /marketplace/cart
 */
export const useClearCart = (
  options?: UseMutationOptions<ApiResponse<Cart>, Error, void>
) => {
  return useMutation<ApiResponse<Cart>, Error, void>({
    mutationFn: async () => {
      const response = await apiClient.delete<ApiResponse<Cart>>(
        "/marketplace/cart"
      );
      return response.data;
    },
    ...options,
    onError: (error) => showError(error),
    onSuccess: () => successMesssage("Cart cleared"),
  });
};
