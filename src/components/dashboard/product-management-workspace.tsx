"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  ChevronDown,
  Download,
  Check,
  Pencil,
  Plus,
  XCircle,
  Search,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { DashboardDataTable } from "@/components/shared/dashboard-data-table";
import { ProductEditorDialog, type ProductFormState } from "@/components/dashboard/product-editor-dialog";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateOwnerProductMutation,
  useDeleteOwnerProductMutation,
  useGetOwnerProductUpdateSuggestionsQuery,
  useGetOwnerProductCategoriesQuery,
  useGetOwnerProductsOverviewQuery,
  useGetOwnerProductsQuery,
  useApproveOwnerProductUpdateSuggestionMutation,
  useRejectOwnerProductUpdateSuggestionMutation,
  useUpdateOwnerProductMutation,
  type OwnerProductItem,
} from "@/store/api";

type DateFilter = "all" | "today" | "thisWeek" | "thisMonth";
type SortFilter =
  | "updatedDesc"
  | "nameAsc"
  | "nameDesc"
  | "salesHigh"
  | "revenueHigh"
  | "stockLow"
  | "stockHigh";

const pageSize = 6;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function dateBoundsByPreset(preset: DateFilter): { startDate?: string; endDate?: string } {
  if (preset === "all") return {};

  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);

  if (preset === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (preset === "thisWeek") {
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

const formDefaults: ProductFormState = {
  name: "",
  category: "",
  newCategory: "",
  categoryMode: "existing",
  unitPrice: "",
  stock: "",
  isActive: true,
};

export function ProductManagementWorkspace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortBy, setSortBy] = useState<SortFilter>("updatedDesc");
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<OwnerProductItem | null>(null);
  const [form, setForm] = useState<ProductFormState>(formDefaults);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  const { startDate, endDate } = useMemo(() => dateBoundsByPreset(dateFilter), [dateFilter]);

  const {
    data: productsResponse,
    isFetching,
    refetch: refetchProducts,
  } = useGetOwnerProductsQuery({
    page: currentPage,
    limit: pageSize,
    search: search || undefined,
    category: category === "all" ? undefined : category,
    sortBy,
    startDate,
    endDate,
  });

  const { data: overview } = useGetOwnerProductsOverviewQuery();
  const { data: suggestions = [], isFetching: isSuggestionsFetching } = useGetOwnerProductUpdateSuggestionsQuery({
    status: "pending",
  });

  const { data: categoriesData = [] } = useGetOwnerProductCategoriesQuery({
    limit: 100,
  });

  const [createProduct, { isLoading: isCreating }] = useCreateOwnerProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateOwnerProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteOwnerProductMutation();
  const [approveSuggestion, { isLoading: isApprovingSuggestion }] = useApproveOwnerProductUpdateSuggestionMutation();
  const [rejectSuggestion, { isLoading: isRejectingSuggestion }] = useRejectOwnerProductUpdateSuggestionMutation();

  const isSaving = isCreating || isUpdating;

  const categoryOptions = useMemo(() => {
    const fromRows = (productsResponse?.items ?? []).map((item) => item.category);
    const set = new Set([...categoriesData, ...fromRows]);
    if (editingProduct?.category) {
      set.add(editingProduct.category);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [categoriesData, productsResponse?.items, editingProduct]);

  const rankingItems = overview?.ranking ?? [];
  const isResolvingSuggestion = isApprovingSuggestion || isRejectingSuggestion;

  const onOpenCreate = useCallback(() => {
    setEditingProduct(null);
    setFormError(null);
    setOpen(true);
    setForm({
      ...formDefaults,
      category: categoryOptions[0] ?? "General",
      categoryMode: categoryOptions.length > 0 ? "existing" : "new",
    });
  }, [categoryOptions]);

  const onOpenEdit = (row: OwnerProductItem) => {
    setEditingProduct(row);
    setFormError(null);
    setOpen(true);
    setForm({
      name: row.name,
      category: row.category,
      newCategory: "",
      categoryMode: "existing",
      unitPrice: String(row.unitPrice),
      stock: String(row.stock),
      isActive: row.isActive,
    });
  };

  const onCloseModal = () => {
    if (isSaving) return;
    setOpen(false);
    setEditingProduct(null);
    setForm(formDefaults);
    setFormError(null);
  };

  const exportCsv = useCallback(() => {
    const rows = productsResponse?.items ?? [];
    const header = ["Product", "Category", "Unit Price", "Sales", "Revenue", "Stock", "Last Sold", "Status"];
    const lines = rows.map((row) => [
      row.name,
      row.category,
      row.unitPrice.toString(),
      row.quantitySold.toString(),
      row.revenue.toString(),
      row.stock.toString(),
      row.lastSoldAt ?? "",
      row.isActive ? "Active" : "Archived",
    ]);
    const csv = [header, ...lines].map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-list.csv";
    link.click();
    URL.revokeObjectURL(url);
  }, [productsResponse?.items]);

  useEffect(() => {
    const handleAdd = () => onOpenCreate();
    const handleExport = () => exportCsv();

    window.addEventListener("product:add", handleAdd);
    window.addEventListener("product:export", handleExport);
    return () => {
      window.removeEventListener("product:add", handleAdd);
      window.removeEventListener("product:export", handleExport);
    };
  }, [onOpenCreate, exportCsv]);

  const submit = async () => {
    const resolvedCategory = form.categoryMode === "new" ? form.newCategory.trim() : form.category.trim();
    const unitPrice = Number(form.unitPrice);
    const stock = Number(form.stock);

    if (!form.name.trim()) {
      setFormError("Product name is required.");
      return;
    }
    if (!resolvedCategory) {
      setFormError("Category is required.");
      return;
    }
    if (Number.isNaN(unitPrice) || unitPrice < 0) {
      setFormError("Unit price must be a valid number.");
      return;
    }
    if (Number.isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
      setFormError("Stock must be a non-negative whole number.");
      return;
    }

    try {
      if (editingProduct) {
        await updateProduct({
          id: editingProduct.id,
          body: {
            name: form.name.trim(),
            category: resolvedCategory,
            unitPrice,
            stock,
            isActive: form.isActive,
          },
        }).unwrap();
        setActionSuccess("Product updated successfully.");
      } else {
        await createProduct({
          name: form.name.trim(),
          category: resolvedCategory,
          unitPrice,
          stock,
          isActive: true,
        }).unwrap();
        setActionSuccess("Product added to the catalog.");
      }

      setFormError(null);
      onCloseModal();
    } catch (error) {
      setFormError(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const onDelete = async (id: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await deleteProduct(id).unwrap();
      setActionSuccess("Product removed from the catalog.");
    } catch (error) {
      setActionError(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const onApproveSuggestion = async (id: string) => {
    setSuggestionError(null);
    try {
      await approveSuggestion(id).unwrap();
    } catch (error) {
      setSuggestionError(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const onRejectSuggestion = async (id: string) => {
    setSuggestionError(null);
    try {
      await rejectSuggestion(id).unwrap();
    } catch (error) {
      setSuggestionError(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const total = productsResponse?.meta.total ?? 0;
  const limit = productsResponse?.meta.limit ?? pageSize;
  const page = productsResponse?.meta.page ?? currentPage;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const hasNext = Boolean(productsResponse?.meta.hasNextPage);
  const hasActiveFilters = Boolean(search || category !== "all" || dateFilter !== "all" || sortBy !== "updatedDesc");

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
      <PageSummaryStrip
        eyebrow="Catalog Overview"
        title="Product catalog control"
        description="Track catalog performance, resolve update suggestions, and keep pricing, stock, and categories consistent across analytics surfaces."
        items={[
          {
            label: "Products",
            value: String(overview?.kpi.totalProducts ?? total),
            helper: "Active catalog records",
          },
          {
            label: "Revenue",
            value: formatMoney(overview?.kpi.productRevenue ?? 0),
            helper: "Revenue attributed to products",
          },
          {
            label: "Best Seller",
            value: overview?.kpi.bestSeller ?? "No leader yet",
            helper: "Top-performing product right now",
          },
          {
            label: "Low Stock",
            value: `${overview?.kpi.lowStockCount ?? 0}`,
            helper: "Products that need replenishment",
          },
        ]}
      />
      <section className="dashboard-surface overflow-hidden shadow-none">
        <div className="border-b border-border/80 px-6 py-5 md:px-7">
          <div className="grid flex-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search products"
                className="h-11 rounded-xl border-border bg-surface-subtle pl-10 text-sm"
                placeholder="Search records..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border-border bg-surface-subtle text-sm text-secondary-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category: All</SelectItem>
                {categoryOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={dateFilter}
              onValueChange={(value) => {
                setDateFilter(value as DateFilter);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border-border bg-surface-subtle text-sm text-secondary-foreground">
                <CalendarDays className="size-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Filter Date</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This week</SelectItem>
                <SelectItem value="thisMonth">This month</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortBy}
              onValueChange={(value) => {
                setSortBy(value as SortFilter);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border-border bg-surface-subtle text-sm text-secondary-foreground">
                <SelectValue />
                <ChevronDown className="size-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedDesc">Sort by: Latest</SelectItem>
                <SelectItem value="salesHigh">Sort by: Sales</SelectItem>
                <SelectItem value="revenueHigh">Sort by: Revenue</SelectItem>
                <SelectItem value="stockLow">Sort by: Stock Low</SelectItem>
                <SelectItem value="stockHigh">Sort by: Stock High</SelectItem>
                <SelectItem value="nameAsc">Sort by: Name A-Z</SelectItem>
                <SelectItem value="nameDesc">Sort by: Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="dashboard-filter-summary">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {total > 0 ? `${total} products matched` : "No products matched"}
            </p>
            <div className="dashboard-filter-chip-row">
              {search ? <span className="dashboard-filter-chip">Search: {search}</span> : null}
              {category !== "all" ? <span className="dashboard-filter-chip">Category: {category}</span> : null}
              {dateFilter !== "all" ? <span className="dashboard-filter-chip">Date: {dateFilter}</span> : null}
              {sortBy !== "updatedDesc" ? <span className="dashboard-filter-chip">Sort: {sortBy}</span> : null}
              {!hasActiveFilters ? (
                <span className="text-sm text-muted-foreground">
                  Search products, monitor stock, and review recent updates from one list.
                </span>
              ) : null}
            </div>
          </div>
          {hasActiveFilters ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setDateFilter("all");
                setSortBy("updatedDesc");
                setCurrentPage(1);
              }}
            >
              Clear filters
            </Button>
          ) : null}
        </div>

        <DashboardDataTable
          ariaLabel="Product catalog table"
          caption="Product catalog with category, price, sales, revenue, stock, and actions"
          tableClassName="min-w-[980px]"
        >
            <thead>
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Sales</th>
                <th className="px-5 py-4">Revenue</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Last Sold</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {(productsResponse?.items ?? []).map((row) => (
                <tr key={row.id}>
                  <td className="dashboard-table-title-cell px-6 py-4">{row.name}</td>
                  <td className="dashboard-table-body-text px-5 py-4">{row.category}</td>
                  <td className="dashboard-table-body-text px-5 py-4">{formatMoney(row.unitPrice)}</td>
                  <td className="dashboard-table-body-text px-5 py-4">{row.quantitySold}</td>
                  <td className="dashboard-table-value px-5 py-4">{formatMoney(row.revenue)}</td>
                  <td className="dashboard-table-body-text px-5 py-4">{row.stock}</td>
                  <td className="dashboard-table-body-text px-5 py-4">{formatDate(row.lastSoldAt)}</td>
                  <td className="px-5 py-4">
                    <div className="dashboard-row-actions">
                      <button type="button" onClick={() => onOpenEdit(row)} aria-label={`Edit ${row.name}`} className="dashboard-row-action">
                        <Pencil className="size-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        aria-label={`Delete ${row.name}`}
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
              {!isFetching && (productsResponse?.items ?? []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-9 text-center text-sm text-muted-foreground">
                    No products found.
                  </td>
                </tr>
              ) : null}
            </tbody>
        </DashboardDataTable>

        <div className="dashboard-table-footer">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Showing {from} to {to} of {total} entries
            </p>
            <p className="text-xs text-muted-foreground">
              {hasActiveFilters ? "Filtered product view is active." : "Showing the full product catalog."}
            </p>
          </div>
          <div className="dashboard-pagination">
            <Button
              variant="outline"
              className="h-10 rounded-xl px-4 text-sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              variant="dark"
              className="h-10 rounded-xl px-5 text-sm"
              disabled={!hasNext || isFetching}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
        {actionSuccess ? (
          <div className="px-6 pb-5 md:px-7">
            <div className="dashboard-inline-feedback dashboard-inline-feedback-success">
              <p>{actionSuccess}</p>
            </div>
          </div>
        ) : null}
      </section>
      </div>

      <aside className="space-y-6">
        <section className="dashboard-surface p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <h3 className="dashboard-section-title">Pending Product Updates</h3>
            <span className="rounded-full bg-surface-subtle px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
              {suggestions.length}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Review category and price conflicts from Sales, Voice, and Telegram.
          </p>
          <div className="dashboard-workflow-list mt-4">
            {isSuggestionsFetching ? (
              <p className="text-sm text-muted-foreground">Loading suggestions...</p>
            ) : null}
            {!isSuggestionsFetching && suggestions.length === 0 ? (
              <p className="dashboard-workflow-card dashboard-workflow-card-muted border-dashed text-sm text-muted-foreground">
                No pending updates.
              </p>
            ) : null}
            {suggestions.map((item) => (
              <div key={item.id} className="dashboard-workflow-list-item">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Current: {item.currentCategory} / {formatMoney(item.currentUnitPrice)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Proposed: {item.proposedCategory} / {formatMoney(item.proposedUnitPrice)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Source: {item.source}</p>
                  </div>
                  <AlertTriangle className="size-4 text-amber-700" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 rounded-lg px-3 text-xs"
                    onClick={() => void onApproveSuggestion(item.id)}
                    disabled={isResolvingSuggestion}
                  >
                    <Check className="size-3.5" />
                    Approve
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-lg border-destructive/30 px-3 text-xs text-destructive"
                    onClick={() => void onRejectSuggestion(item.id)}
                    disabled={isResolvingSuggestion}
                  >
                    <XCircle className="size-3.5" />
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {suggestionError ? <p className="mt-3 text-sm text-rose-600">{suggestionError}</p> : null}
        </section>

        <section className="dashboard-surface p-6 shadow-none">
          <h3 className="dashboard-section-title">Product Revenue Ranking</h3>
          <div className="mt-6 space-y-6">
            {rankingItems.length > 0 ? (
              rankingItems.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-base">
                    <span className="font-medium text-secondary-foreground">{item.name}</span>
                    <span className="font-medium text-primary">{formatMoney(item.revenue)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No ranking data yet.</p>
            )}
          </div>
        </section>

        <section className="dashboard-surface p-6 shadow-none">
          <h3 className="dashboard-section-title">Quick Actions</h3>
          <p className="mt-2 text-sm text-muted-foreground">Low stock: {overview?.kpi.lowStockCount ?? 0} items</p>
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={onOpenCreate}
              className="dashboard-quick-action dashboard-quick-action-primary"
            >
              <span className="inline-flex items-center gap-3">
                <Plus className="size-4" />
                Add New Product
              </span>
            </button>

            <button
              type="button"
              onClick={exportCsv}
              className="dashboard-quick-action"
            >
              <span className="inline-flex items-center gap-3">
                <Download className="size-4" />
                Export Product List
              </span>
            </button>

            <button
              type="button"
              onClick={() => refetchProducts()}
              className="dashboard-quick-action"
            >
              <span className="inline-flex items-center gap-3">
                <Search className="size-4" />
                Refresh Data
              </span>
            </button>
          </div>
          {actionError ? (
            <div className="dashboard-inline-feedback dashboard-inline-feedback-danger mt-4">
              <p>{actionError}</p>
            </div>
          ) : null}
        </section>
      </aside>

      <ProductEditorDialog
        open={open}
        isSaving={isSaving}
        editingProductName={editingProduct?.name ?? null}
        form={form}
        categoryOptions={categoryOptions}
        formError={formError}
        onOpenChange={(value) => {
          if (value) {
            setOpen(true);
            return;
          }
          onCloseModal();
        }}
        onFormChange={setForm}
        onSubmit={submit}
      />
    </section>
  );
}
