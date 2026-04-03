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
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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

interface ProductFormState {
  name: string;
  category: string;
  newCategory: string;
  categoryMode: "existing" | "new";
  unitPrice: string;
  stock: string;
  isActive: boolean;
}

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

function normalizeError(error: unknown) {
  const payload = error as { data?: { message?: string } };
  return payload?.data?.message ?? "Something went wrong. Please try again.";
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
      } else {
        await createProduct({
          name: form.name.trim(),
          category: resolvedCategory,
          unitPrice,
          stock,
          isActive: true,
        }).unwrap();
      }

      setFormError(null);
      onCloseModal();
    } catch (error) {
      setFormError(normalizeError(error));
    }
  };

  const onDelete = async (id: string) => {
    setActionError(null);
    try {
      await deleteProduct(id).unwrap();
    } catch (error) {
      setActionError(normalizeError(error));
    }
  };

  const onApproveSuggestion = async (id: string) => {
    setSuggestionError(null);
    try {
      await approveSuggestion(id).unwrap();
    } catch (error) {
      setSuggestionError(normalizeError(error));
    }
  };

  const onRejectSuggestion = async (id: string) => {
    setSuggestionError(null);
    try {
      await rejectSuggestion(id).unwrap();
    } catch (error) {
      setSuggestionError(normalizeError(error));
    }
  };

  const total = productsResponse?.meta.total ?? 0;
  const limit = productsResponse?.meta.limit ?? pageSize;
  const page = productsResponse?.meta.page ?? currentPage;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const hasNext = Boolean(productsResponse?.meta.hasNextPage);

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <section className="dashboard-surface overflow-hidden border-[#e7e9ee] shadow-none">
        <div className="border-b border-[#edf1f5] px-6 py-5 md:px-7">
          <div className="grid flex-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <Input
                className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] pl-10 text-sm"
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
              <SelectTrigger className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-sm text-[#344054]">
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
              <SelectTrigger className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-sm text-[#344054]">
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
              <SelectTrigger className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-sm text-[#344054]">
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left">
            <thead className="bg-[#f5f6f8] text-xs font-semibold tracking-[0.06em] text-[#667085] uppercase">
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
            <tbody className="divide-y divide-[#eef1f4] bg-white">
              {(productsResponse?.items ?? []).map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4 text-sm font-semibold text-[#101828]">{row.name}</td>
                  <td className="px-5 py-4 text-sm text-[#667085]">{row.category}</td>
                  <td className="px-5 py-4 text-sm text-[#667085]">{formatMoney(row.unitPrice)}</td>
                  <td className="px-5 py-4 text-sm text-[#667085]">{row.quantitySold}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#101828]">{formatMoney(row.revenue)}</td>
                  <td className="px-5 py-4 text-sm text-[#667085]">{row.stock}</td>
                  <td className="px-5 py-4 text-sm text-[#667085]">{formatDate(row.lastSoldAt)}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 text-[#98a2b3]">
                      <button type="button" onClick={() => onOpenEdit(row)} aria-label={`Edit ${row.name}`}>
                        <Pencil className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        aria-label={`Delete ${row.name}`}
                        disabled={isDeleting}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!isFetching && (productsResponse?.items ?? []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-9 text-center text-sm text-[#667085]">
                    No products found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#edf1f5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
          <p className="text-sm text-[#667085]">
            Showing {from} to {to} of {total} entries
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-xl border-[#dfe3e8] bg-white px-4 text-sm text-[#667085]"
              disabled={page <= 1 || isFetching}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            <Button
              className="h-10 rounded-xl bg-[#0f172a] px-5 text-sm text-white hover:bg-[#111d3a]"
              disabled={!hasNext || isFetching}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </section>

      <aside className="space-y-6">
        <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <div className="flex items-center justify-between gap-3">
            <h3 className="dashboard-section-title">Pending Product Updates</h3>
            <span className="rounded-full bg-[#f2f4f7] px-2.5 py-1 text-xs font-semibold text-[#475467]">
              {suggestions.length}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#667085]">
            Review category and price conflicts from Sales, Voice, and Telegram.
          </p>
          <div className="mt-4 space-y-3">
            {isSuggestionsFetching ? (
              <p className="text-sm text-[#667085]">Loading suggestions...</p>
            ) : null}
            {!isSuggestionsFetching && suggestions.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#d0d5dd] bg-[#f9fafb] px-3 py-4 text-sm text-[#667085]">
                No pending updates.
              </p>
            ) : null}
            {suggestions.map((item) => (
              <div key={item.id} className="rounded-xl border border-[#e4e7ec] bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#101828]">{item.productName}</p>
                    <p className="mt-1 text-xs text-[#667085]">
                      Current: {item.currentCategory} / {formatMoney(item.currentUnitPrice)}
                    </p>
                    <p className="text-xs text-[#667085]">
                      Proposed: {item.proposedCategory} / {formatMoney(item.proposedUnitPrice)}
                    </p>
                    <p className="mt-1 text-xs text-[#98a2b3]">Source: {item.source}</p>
                  </div>
                  <AlertTriangle className="size-4 text-[#b54708]" />
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="h-8 rounded-lg bg-[#067647] px-3 text-xs text-white hover:bg-[#05603a]"
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
                    className="h-8 rounded-lg border-[#fecaca] px-3 text-xs text-[#b42318]"
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

        <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Product Revenue Ranking</h3>
          <div className="mt-6 space-y-6">
            {rankingItems.length > 0 ? (
              rankingItems.map((item, index) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-base">
                    <span className="font-medium text-[#344054]">{item.name}</span>
                    <span className="font-medium text-[#d4af35]">{formatMoney(item.revenue)}</span>
                  </div>
                  <div className="h-3 rounded-full bg-[#eceff3]">
                    <div
                      className="h-full rounded-full bg-[#d4af35]"
                      style={{ width: `${item.percent}%`, opacity: 1 - index * 0.17 }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#98a2b3]">No ranking data yet.</p>
            )}
          </div>
        </section>

        <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Quick Actions</h3>
          <p className="mt-2 text-sm text-[#667085]">Low stock: {overview?.kpi.lowStockCount ?? 0} items</p>
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={onOpenCreate}
              className="flex w-full items-center gap-3 rounded-full border border-[#ead9a2] bg-[#fffaf0] px-4 py-3 text-left text-sm font-medium text-[#7a5e0b]"
            >
              <Plus className="size-4" />
              Add New Product
            </button>

            <button
              type="button"
              onClick={exportCsv}
              className="flex w-full items-center gap-3 rounded-full border border-[#e4e7ec] bg-white px-4 py-3 text-left text-sm font-medium text-[#344054]"
            >
              <Download className="size-4" />
              Export Product List
            </button>

            <button
              type="button"
              onClick={() => refetchProducts()}
              className="flex w-full items-center gap-3 rounded-full border border-[#e4e7ec] bg-white px-4 py-3 text-left text-sm font-medium text-[#344054]"
            >
              <Search className="size-4" />
              Refresh Data
            </button>
          </div>
          {actionError ? <p className="mt-4 text-sm text-rose-600">{actionError}</p> : null}
        </section>
      </aside>

      <Dialog open={open} onOpenChange={(value) => (value ? setOpen(true) : onCloseModal())}>
        <DialogContent className="max-w-[640px] overflow-hidden rounded-2xl border border-[#e4e7ec] p-0 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
          <DialogHeader className="flex-row items-center justify-between border-b border-[#eceff3] bg-[#f9fafb] px-6 py-4 text-left">
            <DialogTitle className="text-[1.625rem] font-semibold tracking-tight text-[#101828]">
              {editingProduct ? "Update Product" : "Add New Product"}
            </DialogTitle>
            <button
              type="button"
              onClick={onCloseModal}
              className="rounded-md p-1.5 text-[#98a2b3] transition-colors hover:bg-white hover:text-[#475467]"
              disabled={isSaving}
            >
              <X className="size-5" />
            </button>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium text-[#344054]" htmlFor="product-name">
                Product Name
              </label>
              <Input
                id="product-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="e.g. Enterprise License"
                className="h-11 rounded-xl border-[#dfe3e8] bg-white text-sm text-[#344054] placeholder:text-[#98a2b3]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#344054]" htmlFor="category-mode">
                  Category
                </label>
                <Select
                  value={form.categoryMode}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, categoryMode: value as "existing" | "new" }))}
                >
                  <SelectTrigger id="category-mode" className="h-11 rounded-xl border-[#dfe3e8] bg-white text-sm text-[#344054]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="existing">Select Existing Category</SelectItem>
                    <SelectItem value="new">Add New Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.categoryMode === "existing" ? (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#344054]" htmlFor="category-select">
                    Existing Category
                  </label>
                  <Select
                    value={form.category}
                    onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger id="category-select" className="h-11 rounded-xl border-[#dfe3e8] bg-white text-sm text-[#344054]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-[#344054]" htmlFor="new-category">
                    New Category Name
                  </label>
                  <Input
                    id="new-category"
                    value={form.newCategory}
                    onChange={(event) => setForm((prev) => ({ ...prev, newCategory: event.target.value }))}
                    placeholder="e.g. Bakery"
                    className="h-11 rounded-xl border-[#dfe3e8] bg-white text-sm text-[#344054]"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#344054]" htmlFor="unit-price">
                  Price ($)
                </label>
                <Input
                  id="unit-price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(event) => setForm((prev) => ({ ...prev, unitPrice: event.target.value }))}
                  className="h-11 rounded-xl border-[#dfe3e8] bg-white text-sm text-[#344054]"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-[#344054]" htmlFor="stock">
                  Stock
                </label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  step="1"
                  value={form.stock}
                  onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
                  className="h-11 rounded-xl border-[#dfe3e8] bg-white text-sm text-[#344054]"
                />
              </div>
            </div>

            {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}

            <div className="mt-2 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onCloseModal}
                className="h-10 rounded-xl border-[#dfe3e8] bg-white px-6 text-sm text-[#475467]"
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                className="h-10 rounded-xl bg-[#0f172a] px-7 text-sm text-white hover:bg-[#111d3a]"
                onClick={submit}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : editingProduct ? "Save Product" : "Add Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
