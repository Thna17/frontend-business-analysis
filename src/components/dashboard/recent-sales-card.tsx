"use client";

import { CalendarDays, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
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
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
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
    <section className="dashboard-surface overflow-hidden shadow-none">
      <div className="flex items-center justify-between border-b border-border px-7 py-6">
        <h3 className="dashboard-section-title">Recent Sales Transactions</h3>
        <button type="button" className="text-sm font-medium text-primary">
          View all
        </button>
      </div>

      <div className="border-b border-border px-7 py-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 rounded-xl border-border bg-background/70 pl-10 text-[15px]"
              placeholder="Search records..."
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>

          <Select value={category} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-11 rounded-xl border-border bg-background/70 text-[15px] text-foreground lg:w-44">
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

          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 text-muted-foreground" />
            <Input
              type="date"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              className="h-11 rounded-xl border-border bg-background/70 text-[15px] text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <ChevronDown className="size-4 rotate-[-90deg] text-muted-foreground" />
            <Input
              type="date"
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              className="h-11 rounded-xl border-border bg-background/70 text-[15px] text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left">
          <thead className="bg-muted text-[13px] font-semibold tracking-[0.03em] text-muted-foreground uppercase">
            <tr>
              <th className="px-7 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-7 py-5">
                  <p className="text-sm font-semibold text-foreground">{row.product}</p>
                </td>
                <td className="px-5 py-5 text-sm text-muted-foreground">{row.category}</td>
                <td className="px-5 py-5 text-sm font-semibold text-foreground">{row.total}</td>
                <td className="px-5 py-5 text-sm text-muted-foreground">{row.date}</td>
                <td className="px-5 py-5">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
            {!isLoading && rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-7 py-8 text-center text-sm text-muted-foreground">
                  No transactions found for this filter.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-border px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {from} to {to} of {total} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-border bg-card text-[15px] text-foreground"
            onClick={onPreviousPage}
            disabled={page <= 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            className="h-10 rounded-xl bg-primary px-5 text-[15px] text-primary-foreground hover:bg-primary/90"
            onClick={onNextPage}
            disabled={!hasNextPage || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
