import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '@/types';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: ['Product', 'User', 'Cart'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      transformResponse: (response: { data: Product[] }) => response.data,
      providesTags: ['Product'],
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/slug/${slug}`,
      transformResponse: (response: { data: Product }) => response.data,
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: { data: Product }) => response.data,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    getCampaignBySlug: builder.query({
      query: (slug: string) => `/campaigns/slug/${slug}`,
      transformResponse: (response: any) => response.data,
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['User'],
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['User'],
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getCart: builder.query({
      query: () => '/cart',
      transformResponse: (response: any) => response.data,
      providesTags: ['Cart'],
    }),
    addCartItem: builder.mutation({
      query: (data: { productId: string; quantity: number }) => ({
        url: '/cart/items',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ id, quantity }: { id: string; quantity: number }) => ({
        url: `/cart/items/${id}`,
        method: 'PATCH',
        body: { quantity },
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation({
      query: (id: string) => ({
        url: `/cart/items/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['Cart'],
    }),
    checkout: builder.mutation({
      query: (data: any) => ({
        url: '/checkout',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => response.data,
      invalidatesTags: ['Cart'],
    }),
    getOrderConfirmation: builder.query({
      query: ({ id, email }: { id: string; email?: string }) => ({
        url: `/orders/confirm/${id}`,
        params: email ? { email } : undefined,
      }),
      transformResponse: (response: any) => response.data,
    }),
    checkKhqrPayment: builder.mutation({
      query: ({ id, email }: { id: string; email?: string }) => ({
        url: `/orders/confirm/${id}/check-khqr`,
        method: 'POST',
        body: email ? { email } : undefined,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetProductBySlugQuery,
  useGetCampaignBySlugQuery,
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useGetCartQuery,
  useAddCartItemMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useCheckoutMutation,
  useGetOrderConfirmationQuery,
  useCheckKhqrPaymentMutation,
} = api;
