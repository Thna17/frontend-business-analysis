"use client";

import { Download, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/shared/date-picker";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SortFilter } from "@/components/dashboard/sales-record-workspace";

interface SalesFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  categories: string[];
  category: string;
  setCategory: (val: string) => void;
  startDate: string;
  setStartDate: (val: string) => void;
  endDate: string;
  setEndDate: (val: string) => void;
  sortBy: SortFilter;
  setSortBy: (val: SortFilter) => void;
  setCurrentPage: (val: number) => void;
  exportCsv: () => void;
  openCreateModal: () => void;
  isLoading: boolean;
  hasRows: boolean;
  totalEntries: number;
}

export function SalesFilterBar({
  search, setSearch,
  categories, category, setCategory,
  startDate, setStartDate, endDate, setEndDate,
  sortBy, setSortBy, setCurrentPage,
  exportCsv, openCreateModal, isLoading, hasRows
  , totalEntries
}: SalesFilterBarProps) {
  const hasActiveFilters = Boolean(search || category !== "all" || startDate || endDate || sortBy !== "newest");

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStartDate("");
    setEndDate("");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <>
      <div className="dashboard-toolbar">
        <div className="dashboard-toolbar-group">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }}
              placeholder="Search by product or category"
              className="pl-10"
            />
          </div>
          <Select value={category} onValueChange={(value) => { setCategory(value); setCurrentPage(1); }}>
            <SelectTrigger className="w-full min-w-0 sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category: All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(v) => { setStartDate(v); setCurrentPage(1); }}
            onEndDateChange={(v) => { setEndDate(v); setCurrentPage(1); }}
            className="w-full sm:w-auto"
          />

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortFilter)}>
            <SelectTrigger className="w-full min-w-0 sm:w-[190px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sort by: Newest</SelectItem>
              <SelectItem value="oldest">Sort by: Oldest</SelectItem>
              <SelectItem value="totalHigh">Sort by: Total High</SelectItem>
              <SelectItem value="totalLow">Sort by: Total Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="dashboard-toolbar-actions">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={exportCsv}
            disabled={isLoading || !hasRows}
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button
            className="w-full gap-2 px-5 sm:w-auto"
            onClick={openCreateModal}
          >
            <Plus className="size-4 shrink-0" />
            Add Record
          </Button>
        </div>
      </div>
      <div className="dashboard-filter-summary">
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">
            {totalEntries > 0 ? `${totalEntries} records matched` : "No records matched"}
          </p>
          <div className="dashboard-filter-chip-row">
            {search ? <span className="dashboard-filter-chip">Search: {search}</span> : null}
            {category !== "all" ? <span className="dashboard-filter-chip">Category: {category}</span> : null}
            {startDate || endDate ? (
              <span className="dashboard-filter-chip">
                Date: {startDate || "Any"} to {endDate || "Any"}
              </span>
            ) : null}
            {sortBy !== "newest" ? <span className="dashboard-filter-chip">Sorted: {sortBy}</span> : null}
            {!hasActiveFilters ? (
              <span className="text-sm text-muted-foreground">
                Search, date, and category filters update the table instantly.
              </span>
            ) : null}
          </div>
        </div>
        {hasActiveFilters ? (
          <Button type="button" variant="ghost" onClick={clearFilters} className="w-full sm:w-auto">
            Clear filters
          </Button>
        ) : null}
      </div>
    </>
  );
}
