"use client";

import { ArrowRight, Search } from "lucide-react";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { DashboardDataTable } from "@/components/shared/dashboard-data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/shared/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SalesTransaction } from "@/features/owner-dashboard/dashboard-mock";

interface RecentSalesCardProps {
  rows: SalesTransaction[];
  search: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  categories: string[];
  date: string;
  onDateChange: (value: string) => void;
  page: number;
  total: number;
  pageSize: number;
  hasNextPage: boolean;
  onPreviousPage: () => void;
  onNextPage: () => void;
  isLoading?: boolean;
}

export function RecentSalesCard({
  rows,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  date,
  onDateChange,
  page,
  total,
  pageSize,
  hasNextPage,
  onPreviousPage,
  onNextPage,
  isLoading = false,
}: RecentSalesCardProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <DashboardPanel
      title="Recent Sales Transactions"
      description="Review the latest transactions and narrow the list quickly with search, category, and date filters."
      action={
        <Button type="button" variant="outline" className="px-4">
          View all
          <ArrowRight className="size-4" />
        </Button>
      }
      bodyClassName="p-0"
    >
      <div className="dashboard-toolbar">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              aria-label="Search sales records"
              className="pl-10"
              placeholder="Search records..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category: All</SelectItem>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DatePicker 
            value={date}
            onChange={onDateChange}
            ariaLabel="Filter sales records by date"
          />
        </div>
      </div>

      <div className="dashboard-mobile-list">
        {rows.map((row) => (
          <article key={`mobile-${row.id}`} className="dashboard-mobile-card">
            <div className="dashboard-mobile-card-header">
              <div>
                <p className="dashboard-table-title-cell">{row.product}</p>
                <p className="mt-1 text-sm text-muted-foreground">{row.date}</p>
              </div>
              <Badge variant="success" className="px-3 py-1 text-xs">
                {row.status}
              </Badge>
            </div>
            <div className="dashboard-mobile-card-grid">
              <div>
                <p className="dashboard-mobile-card-label">Category</p>
                <p className="dashboard-mobile-card-value">{row.category}</p>
              </div>
              <div>
                <p className="dashboard-mobile-card-label">Total</p>
                <p className="dashboard-mobile-card-value">{row.total}</p>
              </div>
            </div>
          </article>
        ))}
        {!isLoading && rows.length === 0 ? (
          <EmptyState
            title="No transactions found"
            description="Try widening the date range or removing a filter to see more transaction data."
            className="rounded-2xl"
          />
        ) : null}
      </div>

      <DashboardDataTable
        hiddenBelow="md"
        ariaLabel="Recent sales transactions table"
        caption="Recent sales transactions with product, category, total, date, and status"
        tableClassName="min-w-[920px]"
      >
          <thead>
            <tr>
              <th className="px-7 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-7 py-5 dashboard-table-title-cell">{row.product}</td>
                <td className="px-5 py-5 dashboard-table-body-text">{row.category}</td>
                <td className="px-5 py-5 dashboard-table-value">{row.total}</td>
                <td className="px-5 py-5 dashboard-table-body-text">{row.date}</td>
                <td className="px-5 py-5">
                  <Badge variant="success" className="px-3 py-1 text-sm">
                    {row.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-7 py-8">
                  <EmptyState
                    title="No transactions found"
                    description="Try widening the date range or removing a filter to see more transaction data."
                    className="rounded-2xl"
                  />
                </td>
              </tr>
            ) : null}
          </tbody>
      </DashboardDataTable>

      <div className="dashboard-table-footer px-7">
        <p className="text-sm text-muted-foreground">
          Showing {from} to {to} of {total} entries
        </p>
        <div className="dashboard-pagination">
          <Button
            variant="outline"
            onClick={onPreviousPage}
            disabled={page <= 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            onClick={onNextPage}
            disabled={!hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </DashboardPanel>
  );
}
