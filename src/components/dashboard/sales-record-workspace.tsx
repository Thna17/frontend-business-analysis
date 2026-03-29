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
} from "@/redux/services/api";

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
    <section className="dashboard-surface overflow-hidden border-[#e7e9ee] shadow-none">
      <div className="border-b border-[#edf1f5] px-6 py-5 md:px-7">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[1fr_auto_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a2b3]" />
              <Input
                className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] pl-10 text-[15px]"
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
              <SelectTrigger className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-[15px] text-[#344054]">
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

            <div className="flex items-center gap-2 rounded-xl border border-[#dfe3e8] bg-[#f6f7f9] px-3">
              <CalendarDays className="size-4 text-[#98a2b3]" />
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
            <div className="flex items-center gap-2 rounded-xl border border-[#dfe3e8] bg-[#f6f7f9] px-3">
              <CalendarDays className="size-4 text-[#98a2b3]" />
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
              <SelectTrigger className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-[15px] text-[#344054]">
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
              className="h-11 rounded-xl border-[#dfe3e8] bg-white px-4 text-[15px] text-[#344054]"
              onClick={exportCsv}
              disabled={isLoading || sortedRows.length === 0}
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button
              className="h-11 rounded-xl bg-[#0f172a] px-5 text-[15px] text-white hover:bg-[#111d3a]"
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
          <thead className="bg-[#f5f6f8] text-xs font-semibold tracking-[0.06em] text-[#667085] uppercase">
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
          <tbody className="divide-y divide-[#eef1f4] bg-white">
            {sortedRows.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 text-base font-semibold text-[#101828]">{row.productName}</td>
                <td className="px-5 py-4 text-base text-[#667085]">{row.category}</td>
                <td className="px-5 py-4 text-base text-[#667085]">{row.quantity}</td>
                <td className="px-5 py-4 text-base text-[#667085]">{formatMoney(row.price, currency)}</td>
                <td className="px-5 py-4 text-base font-semibold text-[#101828]">
                  {formatMoney(row.price * row.quantity, currency)}
                </td>
                <td className="px-5 py-4 text-base text-[#667085]">{formatDate(row.soldAt)}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#d7f2e3] px-3 py-1 text-base font-medium text-[#067647]">
                    Completed
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 text-[#98a2b3]">
                    <button type="button" onClick={() => openEditModal(row)} disabled={isDeleting}>
                      <Pencil className="size-5" />
                    </button>
                    <button type="button" onClick={() => void handleDelete(row.id)} disabled={isDeleting}>
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoading && sortedRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-9 text-center text-sm text-[#667085]">
                  No sale records found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#edf1f5] px-6 py-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
        <p className="text-[15px] text-[#667085]">
          Showing {salesResponse?.meta.total ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(currentPage * pageSize, salesResponse?.meta.total ?? 0)} of {salesResponse?.meta.total ?? 0} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-[#dfe3e8] bg-white px-4 text-[15px] text-[#667085]"
            disabled={currentPage <= 1 || isFetching}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            className="h-10 rounded-xl bg-[#0f172a] px-5 text-[15px] text-white hover:bg-[#111d3a]"
            disabled={!salesResponse?.meta.hasNextPage || isFetching}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[640px] overflow-hidden rounded-2xl border border-[#e4e7ec] p-0 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
          <DialogHeader className="flex-row items-center justify-between border-b border-[#eceff3] bg-[#f9fafb] px-6 py-4 text-left">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-[#101828]">
              {editingSale ? "Update Sales Record" : "Add New Sales Record"}
            </DialogTitle>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md p-1.5 text-[#98a2b3] transition-colors hover:bg-white hover:text-[#475467]"
            >
              <X className="size-6" />
            </button>
          </DialogHeader>

          <div className="grid gap-4.5 px-6 py-6">
            <div className="grid gap-2.5">
              <label className="text-sm font-semibold text-[#344054]" htmlFor="product-select">
                Product Name
              </label>
              <Select value={form.productName || "__custom"} onValueChange={handleProductSelect}>
                <SelectTrigger
                  id="product-select"
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
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
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054] placeholder:text-[#98a2b3]"
                />
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="category">
                  Category
                </label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
                />
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="quantity">
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="price">
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054] placeholder:text-[#98a2b3]"
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="date">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={form.soldAt}
                  onChange={(event) => setForm((prev) => ({ ...prev, soldAt: event.target.value }))}
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
                />
              </div>
            </div>

            {formError ? (
              <p className="rounded-lg border border-[#fecaca] bg-[#fff1f2] px-3 py-2 text-sm text-[#b42318]">
                {formError}
              </p>
            ) : null}

            <div className="mt-3 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="h-11 rounded-xl border-[#dfe3e8] bg-white px-6 text-base text-[#475467]"
              >
                Cancel
              </Button>
              <Button
                className="h-11 rounded-xl bg-[#0f172a] px-7 text-base text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)] hover:bg-[#111d3a]"
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
