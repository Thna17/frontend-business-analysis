import { saleRecords } from "@/lib/mock-data";
import { SaleRecord } from "@/types/domain";

export interface SaleFilters {
  keyword?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export async function getSales(filters?: SaleFilters): Promise<SaleRecord[]> {
  if (!filters) return saleRecords;

  return saleRecords.filter((item) => {
    const keywordMatch =
      !filters.keyword ||
      item.productName.toLowerCase().includes(filters.keyword.toLowerCase());

    const categoryMatch =
      !filters.category ||
      filters.category === "all" ||
      item.category.toLowerCase() === filters.category.toLowerCase();

    const startMatch = !filters.startDate || item.date >= filters.startDate;
    const endMatch = !filters.endDate || item.date <= filters.endDate;

    return keywordMatch && categoryMatch && startMatch && endMatch;
  });
}
