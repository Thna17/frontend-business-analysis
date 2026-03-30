import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  SaleProductSuggestion,
  SalesListItem,
  SalesListQuery,
  SalesListResponse,
  SaleWriteInput,
} from "@/store/api/types";
import { normalizeSalesListMeta } from "@/store/api/utils";

export const salesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSales: builder.query<SalesListResponse, SalesListQuery | void>({
      query: (params) => ({
        url: "/sales",
        params: params ?? { page: 1, limit: 3 },
      }),
      transformResponse: (response: ApiEnvelope<SalesListItem[]>) => ({
        items: response.data,
        meta: normalizeSalesListMeta(response.meta),
      }),
      providesTags: ["User"],
    }),
    getSaleProductSuggestions: builder.query<SaleProductSuggestion[], { search?: string; limit?: number } | void>({
      query: (params) => ({
        url: "/sales/products",
        params: params ?? { limit: 20 },
      }),
      transformResponse: (response: ApiEnvelope<SaleProductSuggestion[]>) => response.data,
      providesTags: ["User"],
    }),
    createSale: builder.mutation<SalesListItem, SaleWriteInput>({
      query: (body) => ({
        url: "/sales",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SalesListItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    updateSale: builder.mutation<SalesListItem, { id: string; body: SaleWriteInput }>({
      query: ({ id, body }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SalesListItem>) => response.data,
      invalidatesTags: ["User"],
    }),
    deleteSale: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/sales/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiEnvelope<null>) => ({ message: response.message }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetSalesQuery,
  useGetSaleProductSuggestionsQuery,
  useCreateSaleMutation,
  useUpdateSaleMutation,
  useDeleteSaleMutation,
} = salesApi;
