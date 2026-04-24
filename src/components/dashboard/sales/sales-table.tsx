"use client";

import { Pencil, Trash2 } from "lucide-react";
import { DashboardDataTable } from "@/components/shared/dashboard-data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SalesListItem } from "@/store/api";

interface SalesTableProps {
  sortedRows: SalesListItem[];
  isLoading: boolean;
  currency: string;
  isDeleting: boolean;
  openEditModal: (row: SalesListItem) => void;
  handleDelete: (id: string) => Promise<void>;
  currentPage: number;
  pageSize: number;
  totalEntries: number;
  hasNextPage: boolean;
  isFetching: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  hasActiveFilters: boolean;
}

export function SalesTable({
  sortedRows, isLoading, currency, isDeleting,
  openEditModal, handleDelete,
  currentPage, pageSize, totalEntries,
  hasNextPage, isFetching, setCurrentPage, hasActiveFilters
}: SalesTableProps) {
  
  function formatMoney(value: number, currList: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currList.substring(0, 3),
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatDate(isoRaw: string) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(isoRaw));
  }

  return (
    <>
      <div className="dashboard-mobile-list">
        {sortedRows.map((row) => (
          <article key={`mobile-${row.id}`} className="dashboard-mobile-card">
            <div className="dashboard-mobile-card-header">
              <div>
                <p className="dashboard-table-title-cell">{row.productName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{formatDate(row.soldAt)}</p>
              </div>
              <Badge className="dashboard-status-positive px-3 py-1 text-xs font-semibold">
                Completed
              </Badge>
            </div>
            <div className="dashboard-mobile-card-grid">
              <div>
                <p className="dashboard-mobile-card-label">Category</p>
                <p className="dashboard-mobile-card-value">{row.category}</p>
              </div>
              <div>
                <p className="dashboard-mobile-card-label">Quantity</p>
                <p className="dashboard-mobile-card-value">{row.quantity}</p>
              </div>
              <div>
                <p className="dashboard-mobile-card-label">Unit Price</p>
                <p className="dashboard-mobile-card-value">{formatMoney(row.price, currency)}</p>
              </div>
              <div>
                <p className="dashboard-mobile-card-label">Total</p>
                <p className="dashboard-mobile-card-value">{formatMoney(row.price * row.quantity, currency)}</p>
              </div>
            </div>
            <div className="dashboard-row-actions pt-1">
              <button
                type="button"
                onClick={() => openEditModal(row)}
                disabled={isDeleting}
                className="dashboard-row-action"
              >
                <Pencil className="size-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(row.id)}
                disabled={isDeleting}
                className="dashboard-row-action dashboard-row-action-danger"
              >
                <Trash2 className="size-4" />
                Delete
              </button>
            </div>
          </article>
        ))}
        {!isLoading && sortedRows.length === 0 ? (
          <EmptyState
            title="No sale records found"
            description="Add a new record or adjust the filters to see the sales history for this workspace."
            className="rounded-2xl"
          />
        ) : null}
      </div>

      <DashboardDataTable
        hiddenBelow="md"
        ariaLabel="Sales records table"
        caption="Sales records with product, category, quantity, price, total, date, status, and actions"
        tableClassName="min-w-[980px]"
      >
          <thead>
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Quantity</th>
              <th className="px-5 py-4">Price</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4">
                  <div className="dashboard-table-title-cell">{row.productName}</div>
                </td>
                <td className="px-5 py-4 dashboard-table-body-text">{row.category}</td>
                <td className="px-5 py-4 dashboard-table-body-text">{row.quantity}</td>
                <td className="px-5 py-4 dashboard-table-body-text">{formatMoney(row.price, currency)}</td>
                <td className="px-5 py-4 dashboard-table-value">
                  {formatMoney(row.price * row.quantity, currency)}
                </td>
                <td className="px-5 py-4 dashboard-table-body-text">{formatDate(row.soldAt)}</td>
                <td className="px-5 py-4">
                  <Badge className="dashboard-status-positive px-3 py-1 text-sm font-semibold">
                    Completed
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="dashboard-row-actions">
                    <button
                      type="button"
                      onClick={() => openEditModal(row)}
                      disabled={isDeleting}
                      className="dashboard-row-action"
                    >
                      <Pencil className="size-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.id)}
                      disabled={isDeleting}
                      className="dashboard-row-action dashboard-row-action-danger"
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && sortedRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-9">
                  <EmptyState
                    title="No sale records found"
                    description="Add a new record or adjust the filters to see the sales history for this workspace."
                    className="rounded-2xl"
                  />
                </td>
              </tr>
            ) : null}
          </tbody>
      </DashboardDataTable>

      <div className="dashboard-table-footer">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Showing {totalEntries ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
            {Math.min(currentPage * pageSize, totalEntries)} of {totalEntries} entries
          </p>
          <p className="text-xs text-muted-foreground">
            {hasActiveFilters ? "Filtered view is active." : "All recent sale records are shown."}
          </p>
        </div>
        <div className="dashboard-pagination">
          <Button
            variant="outline"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            disabled={!hasNextPage || isFetching}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
