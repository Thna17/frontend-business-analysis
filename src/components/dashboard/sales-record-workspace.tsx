"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  Download,
  Pencil,
  Plus,
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
  type SaleWriteInput,
  type SalesListItem,
  useCreateSaleMutation,
  useDeleteSaleMutation,
  useGetSaleProductSuggestionsQuery,
  useGetSalesQuery,
  useUpdateSaleMutation,
} from "@/store/api";

type SortFilter = "newest" | "oldest" | "totalHigh" | "totalLow";

interface SalesRecordWorkspaceProps {
  currency?: string;
}

interface RecordForm {
  productName: string;
  category: string;
  quantity: string;
  price: string;
  soldAt: string;
}

const pageSize = 8;

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return input;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatMoney(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function toDateInput(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().toISOString().slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function serializePayload(form: RecordForm): SaleWriteInput | null {
  const price = Number(form.price);
  const quantity = Number(form.quantity);
  const soldAtDate = new Date(form.soldAt);

  if (
    !form.productName.trim()
    || !form.category.trim()
    || Number.isNaN(price)
    || Number.isNaN(quantity)
    || Number.isNaN(soldAtDate.getTime())
  ) {
    return null;
  }

  return {
    productName: form.productName.trim(),
    category: form.category.trim(),
    price,
    quantity,
    soldAt: soldAtDate.toISOString(),
  };
}

export function SalesRecordWorkspace({ currency = "USD" }: SalesRecordWorkspaceProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortFilter>("newest");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<SalesListItem | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [customProductName, setCustomProductName] = useState("");
  const [form, setForm] = useState<RecordForm>({
    productName: "",
    category: "",
    quantity: "1",
    price: "0",
    soldAt: new Date().toISOString().slice(0, 10),
  });

  const {
    data: salesResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetSalesQuery({
    search: search || undefined,
    category: category === "all" ? undefined : category,
    startDate: startDate ? new Date(startDate).toISOString() : undefined,
    endDate: endDate ? new Date(endDate).toISOString() : undefined,
    page: currentPage,
    limit: pageSize,
  });

  const {
    data: productSuggestions = [],
    isFetching: isProductsFetching,
  } = useGetSaleProductSuggestionsQuery({
    search: form.productName || undefined,
    limit: 30,
  });

  const [createSale, { isLoading: isCreating }] = useCreateSaleMutation();
  const [updateSale, { isLoading: isUpdating }] = useUpdateSaleMutation();
  const [deleteSale, { isLoading: isDeleting }] = useDeleteSaleMutation();

  const categories = useMemo(() => {
    const set = new Set((salesResponse?.items ?? []).map((item) => item.category));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [salesResponse?.items]);

  const sortedRows = useMemo(() => {
    const rows = [...(salesResponse?.items ?? [])];

    return rows.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.soldAt).getTime() - new Date(a.soldAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.soldAt).getTime() - new Date(b.soldAt).getTime();
      }
      const totalA = a.price * a.quantity;
      const totalB = b.price * b.quantity;
      return sortBy === "totalHigh" ? totalB - totalA : totalA - totalB;
    });
  }, [salesResponse?.items, sortBy]);

  const productOptions = useMemo(() => {
    const map = new Map<string, { name: string; category: string; price: number }>();
    for (const suggestion of productSuggestions) {
      map.set(suggestion.name, {
        name: suggestion.name,
        category: suggestion.category,
        price: suggestion.price,
      });
    }
    if (editingSale && !map.has(editingSale.productName)) {
      map.set(editingSale.productName, {
        name: editingSale.productName,
        category: editingSale.category,
        price: editingSale.price,
      });
    }
    return Array.from(map.values());
  }, [productSuggestions, editingSale]);

  const openCreateModal = () => {
    setEditingSale(null);
    setCustomProductName("");
    setFormError(null);
    setForm({
      productName: "",
      category: "",
      quantity: "1",
      price: "0",
      soldAt: new Date().toISOString().slice(0, 10),
    });
    setOpen(true);
  };

  const openEditModal = (item: SalesListItem) => {
    setEditingSale(item);
    setCustomProductName("");
    setFormError(null);
    setForm({
      productName: item.productName,
      category: item.category,
      quantity: String(item.quantity),
      price: String(item.price),
      soldAt: toDateInput(item.soldAt),
    });
    setOpen(true);
  };

  const handleProductSelect = (value: string) => {
    if (value === "__custom") {
      setForm((prev) => ({ ...prev, productName: "" }));
      return;
    }

    const selected = productOptions.find((item) => item.name === value);
    if (!selected) return;

    setForm((prev) => ({
      ...prev,
      productName: selected.name,
      category: selected.category,
      price: String(selected.price),
    }));
  };

  const handleSave = async () => {
    setFormError(null);
    const effectiveName = customProductName.trim() || form.productName;
    const payload = serializePayload({
      ...form,
      productName: effectiveName,
    });

    if (!payload) {
      setFormError("Please complete all fields correctly before saving.");
      return;
    }

    try {
      if (editingSale) {
        await updateSale({ id: editingSale.id, body: payload }).unwrap();
      } else {
        await createSale(payload).unwrap();
      }
      setOpen(false);
      void refetch();
    } catch (error) {
      const message = (error as { data?: { message?: string } })?.data?.message;
      setFormError(message || "Unable to save sales record.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSale(id).unwrap();
      void refetch();
    } catch {
      // Keep UI silent for now; table refetch preserves consistency.
    }
  };

  const exportCsv = () => {
    const header = ["Product", "Category", "Quantity", "Price", "Total", "Date"];
    const lines = sortedRows.map((row) => [
      row.productName,
      row.category,
      row.quantity,
      row.price.toFixed(2),
      (row.price * row.quantity).toFixed(2),
      formatDate(row.soldAt),
    ]);
    const csv = [header, ...lines].map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sales-records.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="dashboard-surface overflow-hidden border-border/80 bg-card/90 shadow-[0_20px_48px_rgba(15,23,42,0.08)]">
      <div className="border-b border-border/80 bg-gradient-to-r from-accent/35 via-transparent to-accent/15 px-6 py-5 md:px-7">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="h-11 rounded-xl border-border bg-background/80 pl-10 text-[15px]"
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
              <SelectTrigger className="h-11 rounded-xl border-border bg-background/80 text-[15px] text-foreground">
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

            <div className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3">
              <CalendarDays className="size-4 text-muted-foreground" />
              <Input
                type="date"
                value={startDate}
                onChange={(event) => {
                  setStartDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background/80 px-3">
              <CalendarDays className="size-4 text-muted-foreground" />
              <Input
                type="date"
                value={endDate}
                onChange={(event) => {
                  setEndDate(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-11 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortFilter)}>
              <SelectTrigger className="h-11 rounded-xl border-border bg-background/80 text-[15px] text-foreground">
                <SelectValue />
                <ChevronDown className="size-4" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Sort by: Newest</SelectItem>
                <SelectItem value="oldest">Sort by: Oldest</SelectItem>
                <SelectItem value="totalHigh">Sort by: Total High</SelectItem>
                <SelectItem value="totalLow">Sort by: Total Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-11 rounded-xl border-border bg-card px-4 text-[15px] text-foreground"
              onClick={exportCsv}
              disabled={isLoading || sortedRows.length === 0}
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button
              className="h-11 rounded-xl bg-primary px-5 text-[15px] text-primary-foreground hover:bg-primary/90"
              onClick={openCreateModal}
            >
              <Plus className="size-4" />
              Add Sales Record
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-muted/70 text-xs font-semibold tracking-[0.06em] text-muted-foreground uppercase">
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
          <tbody className="divide-y divide-border/70 bg-card">
            {sortedRows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-accent/25">
                <td className="px-6 py-4 text-base font-semibold text-foreground">{row.productName}</td>
                <td className="px-5 py-4 text-base text-muted-foreground">{row.category}</td>
                <td className="px-5 py-4 text-base text-muted-foreground">{row.quantity}</td>
                <td className="px-5 py-4 text-base text-muted-foreground">{formatMoney(row.price, currency)}</td>
                <td className="px-5 py-4 text-base font-semibold text-foreground">
                  {formatMoney(row.price * row.quantity, currency)}
                </td>
                <td className="px-5 py-4 text-base text-muted-foreground">{formatDate(row.soldAt)}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    Completed
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => openEditModal(row)}
                      disabled={isDeleting}
                      className="rounded-lg p-2 transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Pencil className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(row.id)}
                      disabled={isDeleting}
                      className="rounded-lg p-2 transition-colors hover:bg-red-100 hover:text-red-700 dark:hover:bg-red-500/20 dark:hover:text-red-300"
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && sortedRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-9 text-center text-sm text-muted-foreground">
                  No sale records found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-border/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <p className="text-[15px] text-muted-foreground">
          Showing {salesResponse?.meta.total ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, salesResponse?.meta.total ?? 0)} of {salesResponse?.meta.total ?? 0} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-border bg-card px-4 text-[15px] text-muted-foreground"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            className="h-10 rounded-xl bg-primary px-5 text-[15px] text-primary-foreground hover:bg-primary/90"
            disabled={!salesResponse?.meta.hasNextPage || isFetching}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[640px] overflow-hidden rounded-2xl border border-border p-0 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
          <DialogHeader className="flex-row items-center justify-between border-b border-border bg-accent/25 px-6 py-4 text-left">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-foreground">
              {editingSale ? "Update Sales Record" : "Add New Sales Record"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
            >
              <X className="size-6" />
            </button>
          </DialogHeader>

          <div className="grid gap-4.5 px-6 py-6">
            <div className="grid gap-2.5">
              <label className="text-sm font-semibold text-foreground" htmlFor="product-select">
                Product Name
              </label>
              <Select value={form.productName || "__custom"} onValueChange={handleProductSelect}>
                <SelectTrigger
                  id="product-select"
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground"
                >
                  <SelectValue placeholder={isProductsFetching ? "Loading products..." : "Select product"} />
                </SelectTrigger>
                <SelectContent>
                  {productOptions.map((item) => (
                    <SelectItem key={item.name} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="__custom">Custom product...</SelectItem>
                </SelectContent>
              </Select>
              {form.productName === "" ? (
                <Input
                  value={customProductName}
                  onChange={(event) => setCustomProductName(event.target.value)}
                  placeholder="Type custom product name"
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground placeholder:text-muted-foreground"
                />
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="category">
                  Category
                </label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground"
                />
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="quantity">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="price">
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground placeholder:text-muted-foreground"
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="date">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={form.soldAt}
                  onChange={(event) => setForm((prev) => ({ ...prev, soldAt: event.target.value }))}
                  className="h-12 rounded-xl border-border bg-card text-base text-foreground"
                />
              </div>
            </div>

            {formError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                {formError}
              </p>
            ) : null}

            <div className="mt-3 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-11 rounded-xl border-border bg-card px-6 text-base text-muted-foreground"
              >
                Cancel
              </Button>
              <Button
                className="h-11 rounded-xl bg-primary px-7 text-base text-primary-foreground shadow-[0_8px_20px_rgba(15,23,42,0.18)] hover:bg-primary/90"
                onClick={() => void handleSave()}
                disabled={isCreating || isUpdating}
              >
                {isCreating || isUpdating ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
