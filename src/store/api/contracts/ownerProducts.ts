export interface OwnerProductItem {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  stock: number;
  isActive: boolean;
  quantitySold: number;
  revenue: number;
  lastSoldAt: string | null;
  updatedAt: string | null;
  createdAt: string | null;
}

export interface OwnerProductListMeta {
  count: number;
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface OwnerProductListResponse {
  items: OwnerProductItem[];
  meta: OwnerProductListMeta;
}

export interface OwnerProductListQuery {
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?:
    | "updatedDesc"
    | "nameAsc"
    | "nameDesc"
    | "salesHigh"
    | "revenueHigh"
    | "stockLow"
    | "stockHigh";
  page?: number;
  limit?: number;
}

export interface OwnerProductWriteInput {
  name: string;
  category: string;
  unitPrice: number;
  stock: number;
  isActive?: boolean;
}

export interface OwnerProductsOverviewResponse {
  kpi: {
    totalProducts: number;
    bestSeller: string | null;
    productRevenue: number;
    lowStockCount: number;
    revenueGrowthPercentage: number;
  };
  ranking: Array<{
    name: string;
    revenue: number;
    quantitySold: number;
    percent: number;
  }>;
}
