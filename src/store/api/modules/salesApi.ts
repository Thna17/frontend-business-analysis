import { api } from "@/store/api/core";
import type {
  ApiEnvelope,
  SaleMutationResponse,
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
    createSale: builder.mutation<SaleMutationResponse, SaleWriteInput>({
      query: (body) => ({
        url: "/sales",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SalesListItem>) => ({
        sale: response.data,
        productSync: (response.meta as { productSync?: SaleMutationResponse["productSync"] } | undefined)?.productSync,
      }),
      invalidatesTags: ["User"],
    }),
    updateSale: builder.mutation<SaleMutationResponse, { id: string; body: SaleWriteInput }>({
      query: ({ id, body }) => ({
        url: `/sales/${id}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiEnvelope<SalesListItem>) => ({
        sale: response.data,
        productSync: (response.meta as { productSync?: SaleMutationResponse["productSync"] } | undefined)?.productSync,
      }),
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
