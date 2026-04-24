import { api } from "@/store/api/core";
import type { ApiEnvelope, ProductEntity } from "@/store/api/types";

export const catalogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductEntity[], void>({
      query: () => "/products",
      transformResponse: (response: ApiEnvelope<ProductEntity[]>) => response.data,
      providesTags: ["Product"],
    }),
    getProductBySlug: builder.query<ProductEntity, string>({
      query: (slug) => `/products/slug/${slug}`,
      transformResponse: (response: ApiEnvelope<ProductEntity>) => response.data,
      providesTags: (_result, _error, slug) => [{ type: "Product", id: slug }],
    }),
    getProduct: builder.query<ProductEntity, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiEnvelope<ProductEntity>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Product", id }],
    }),
    getCampaignBySlug: builder.query<unknown, string>({
      query: (slug) => `/campaigns/slug/${slug}`,
      transformResponse: (response: ApiEnvelope<unknown>) => response.data,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useGetProductQuery,
  useGetCampaignBySlugQuery,
} = catalogApi;
