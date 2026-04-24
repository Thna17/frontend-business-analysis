import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  OwnerProductItem,
  OwnerProductListQuery,
  OwnerProductListResponse,
  ProductUpdateSuggestionItem,
  ProductUpdateSuggestionStatus,
  OwnerProductsOverviewResponse,
  OwnerProductWriteInput,
} from "@/store/api/types";
import { normalizeOwnerProductListMeta } from "@/store/api/utils";

export const ownerProductsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerProductsOverview: builder.query<OwnerProductsOverviewResponse, void>({
      query: () => "/owner-products/overview",
      transformResponse: (response: ApiEnvelope<OwnerProductsOverviewResponse>) => response.data,
      providesTags: ["User"],
    }),
    getOwnerProducts: builder.query<OwnerProductListResponse, OwnerProductListQuery | void>({
      query: (params) => ({
        url: "/owner-products",
        params: params ?? { page: 1, limit: 10, sortBy: "updatedDesc" },
      }),
      transformResponse: (response: ApiEnvelope<OwnerProductItem[]>) => ({
        items: response.data,
        meta: normalizeOwnerProductListMeta(response.meta),
      }),
      providesTags: ["User"],
    }),
    getOwnerProductCategories: builder.query<string[], { search?: string; limit?: number } | void>({
      query: (params) => ({
        url: "/owner-products/categories",
        params: params ?? { limit: 50 },
      }),
      transformResponse: (response: ApiEnvelope<string[]>) => response.data,
      providesTags: ["User"],
    }),
    createOwnerProduct: builder.mutation<OwnerProductItem, OwnerProductWriteInput>({
      query: (body) => ({
        url: "/owner-products",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<OwnerProductItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    updateOwnerProduct: builder.mutation<OwnerProductItem, { id: string; body: OwnerProductWriteInput }>({
      query: ({ id, body }) => ({
        url: `/owner-products/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiEnvelope<OwnerProductItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    deleteOwnerProduct: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/owner-products/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
    getOwnerProductUpdateSuggestions: builder.query<
      ProductUpdateSuggestionItem[],
      { status?: ProductUpdateSuggestionStatus } | void
    >({
      query: (params) => ({
        url: "/owner-products/update-suggestions",
        params: params ?? {},
      }),
      transformResponse: (response: ApiEnvelope<ProductUpdateSuggestionItem[]>) => response.data,
      providesTags: ["User"],
    }),
    approveOwnerProductUpdateSuggestion: builder.mutation<
      ProductUpdateSuggestionItem,
      string
    >({
      query: (id) => ({
        url: `/owner-products/update-suggestions/${id}/approve`,
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<ProductUpdateSuggestionItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    rejectOwnerProductUpdateSuggestion: builder.mutation<
      ProductUpdateSuggestionItem,
      string
    >({
      query: (id) => ({
        url: `/owner-products/update-suggestions/${id}/reject`,
        method: "POST",
      }),
      transformResponse: (response: ApiEnvelope<ProductUpdateSuggestionItem>) => response.data,
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetOwnerProductsOverviewQuery,
  useGetOwnerProductsQuery,
  useGetOwnerProductCategoriesQuery,
  useCreateOwnerProductMutation,
  useUpdateOwnerProductMutation,
  useDeleteOwnerProductMutation,
  useGetOwnerProductUpdateSuggestionsQuery,
  useApproveOwnerProductUpdateSuggestionMutation,
  useRejectOwnerProductUpdateSuggestionMutation,
} = ownerProductsApi;
