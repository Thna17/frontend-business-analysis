import { api } from "@/store/api/core";
import type { ApiEnvelope, CartResponse } from "@/store/api/types";

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => "/cart",
      transformResponse: (response: ApiEnvelope<CartResponse>) => response.data,
      providesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<CartResponse, { productId: string; quantity: number }>({
      query: (data) => ({
        url: "/cart/items",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiEnvelope<CartResponse>) => response.data,
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation<CartResponse, { id: string; quantity: number }>({
      query: ({ id, quantity }) => ({
        url: `/cart/items/${id}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response: ApiEnvelope<CartResponse>) => response.data,
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<CartResponse, string>({
      query: (id) => ({
        url: `/cart/items/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<CartResponse>) => response.data,
      invalidatesTags: ["Cart"],
    }),
    checkout: builder.mutation<unknown, unknown>({
      query: (data) => ({
        url: "/checkout",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiEnvelope<unknown>) => response.data,
      invalidatesTags: ["Cart"],
    }),
    getOrderConfirmation: builder.query<unknown, { id: string; email?: string }>({
      query: ({ id, email }) => ({
        url: `/orders/confirm/${id}`,
        params: email ? { email } : undefined,
      }),
      transformResponse: (response: ApiEnvelope<unknown>) => response.data,
    }),
    checkKhqrPayment: builder.mutation<unknown, { id: string; email?: string }>({
      query: ({ id, email }) => ({
        url: `/orders/confirm/${id}/check-khqr`,
        method: "POST",
        body: email ? { email } : undefined,
      }),
      transformResponse: (response: ApiEnvelope<unknown>) => response.data,
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useCheckoutMutation,
  useGetOrderConfirmationQuery,
  useCheckKhqrPaymentMutation,
} = cartApi;
