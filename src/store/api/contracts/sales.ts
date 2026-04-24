export interface SalesListItem {
  id: string;
  businessId: string;
  ownerUserId: string;
  productName: string;
  price: number;
  quantity: number;
  category: string;
  soldAt: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface SalesListMeta {
  count: number;
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface SalesListResponse {
  items: SalesListItem[];
  meta: SalesListMeta;
}

export interface SalesListQuery {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface SaleProductSuggestion {
  name: string;
  category: string;
  price: number;
  lastSoldAt: string;
}

export interface SaleWriteInput {
  productName: string;
  category: string;
  price: number;
  quantity: number;
  soldAt: string;
}

export interface ProductSyncMeta {
  action: "created" | "unchanged" | "suggestion_created" | "suggestion_exists";
  productId: string;
  suggestionId?: string;
}

export interface SaleMutationResponse {
  sale: SalesListItem;
  productSync?: ProductSyncMeta;
}
