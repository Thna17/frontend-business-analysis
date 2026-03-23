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
import { SaleRecordRow } from "@/features/owner-dashboard/dashboard-mock";

interface SalesRecordWorkspaceProps {
  initialRows: SaleRecordRow[];
}

type DateFilter = "all" | "today" | "thisWeek" | "thisMonth";
type SortFilter = "newest" | "oldest" | "totalHigh" | "totalLow";

interface RecordForm {
  product: string;
  category: string;
  quantity: string;
  price: string;
  date: string;
  status: "Completed" | "Pending";
}

const defaultAvatar =
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=64&q=60";

const pageSize = 3;

function toTotal(row: SaleRecordRow) {
  return row.quantity * row.price;
}

function parseDate(input: string) {
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function formatDate(input: Date) {
  return input.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatDateInputDisplay(input: string) {
  if (!input) return formatDate(new Date());
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? formatDate(new Date()) : formatDate(date);
}

export function SalesRecordWorkspace({ initialRows }: SalesRecordWorkspaceProps) {
  const [rows, setRows] = useState<SaleRecordRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortBy, setSortBy] = useState<SortFilter>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RecordForm>({
    product: "",
    category: "Digital",
    quantity: "1",
    price: "10",
    date: new Date().toISOString().slice(0, 10),
    status: "Completed",
  });

  const categories = useMemo(
    () => ["all", ...new Set(rows.map((item) => item.category.toLowerCase()))],
    [rows],
  );

  const filteredRows = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const filtered = rows.filter((row) => {
      const rowDate = parseDate(row.date);
      const searchMatch =
        !search ||
        row.product.toLowerCase().includes(search.toLowerCase()) ||
        row.category.toLowerCase().includes(search.toLowerCase());
      const categoryMatch = category === "all" || row.category.toLowerCase() === category;
      const dateMatch =
        dateFilter === "all" ||
        (dateFilter === "today" && rowDate >= startOfToday) ||
        (dateFilter === "thisWeek" && rowDate >= startOfWeek) ||
        (dateFilter === "thisMonth" && rowDate >= startOfMonth);
      return searchMatch && categoryMatch && dateMatch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "newest") return parseDate(b.date).getTime() - parseDate(a.date).getTime();
      if (sortBy === "oldest") return parseDate(a.date).getTime() - parseDate(b.date).getTime();
      if (sortBy === "totalHigh") return toTotal(b) - toTotal(a);
      return toTotal(a) - toTotal(b);
    });
  }, [rows, search, category, dateFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage]);

  const exportCsv = () => {
    const header = ["Product", "Category", "Quantity", "Price", "Total", "Date", "Status"];
    const lines = filteredRows.map((row) => [
      row.product,
      row.category,
      row.quantity,
      row.price.toFixed(2),
      toTotal(row).toFixed(2),
      row.date,
      row.status,
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

  const onOpenCreate = () => {
    setEditingId(null);
    setForm({
      product: "",
      category: "Digital",
      quantity: "1",
      price: "10",
      date: new Date().toISOString().slice(0, 10),
      status: "Completed",
    });
    setOpen(true);
  };

  const onOpenEdit = (row: SaleRecordRow) => {
    setEditingId(row.id);
    setForm({
      product: row.product,
      category: row.category,
      quantity: row.quantity.toString(),
      price: row.price.toString(),
      date: new Date(row.date).toISOString().slice(0, 10),
      status: row.status,
    });
    setOpen(true);
  };

  const onSave = () => {
    const quantity = Number(form.quantity);
    const price = Number(form.price);
    if (!form.product || !form.category || Number.isNaN(quantity) || Number.isNaN(price)) return;

    if (editingId) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                product: form.product,
                category: form.category,
                quantity,
                price,
                date: formatDateInputDisplay(form.date),
                status: form.status,
              }
            : row,
        ),
      );
    } else {
      const created: SaleRecordRow = {
        id: `sr-${Date.now()}`,
        product: form.product,
        category: form.category,
        quantity,
        price,
        date: formatDateInputDisplay(form.date),
        status: form.status,
        customerAvatar: defaultAvatar,
      };
      setRows((prev) => [created, ...prev]);
      setCurrentPage(1);
    }
    setOpen(false);
  };

  const onDelete = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
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
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item === "all" ? "Category: All" : item}
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
              <SelectTrigger className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-[15px] text-[#344054]">
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
            >
              <Download className="size-4" />
              Export
            </Button>
            <Button
              className="h-11 rounded-xl bg-[#0f172a] px-5 text-[15px] text-white hover:bg-[#111d3a]"
              onClick={onOpenCreate}
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
            {paginatedRows.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-11 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${row.customerAvatar}')` }}
                    />
                    <p className="text-base font-semibold text-[#101828]">{row.product}</p>
                  </div>
                </td>
                <td className="px-5 py-4 text-base text-[#667085]">{row.category}</td>
                <td className="px-5 py-4 text-base text-[#667085]">{row.quantity}</td>
                <td className="px-5 py-4 text-base text-[#667085]">${row.price.toFixed(2)}</td>
                <td className="px-5 py-4 text-base font-semibold text-[#101828]">${toTotal(row).toFixed(2)}</td>
                <td className="px-5 py-4 text-base text-[#667085]">{row.date}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-[#d7f2e3] px-3 py-1 text-base font-medium text-[#067647]">
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3 text-[#98a2b3]">
                    <button type="button" onClick={() => onOpenEdit(row)}>
                      <Pencil className="size-5" />
                    </button>
                    <button type="button" onClick={() => onDelete(row.id)}>
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedRows.length === 0 ? (
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
          Showing {paginatedRows.length === 0 ? 0 : (safePage - 1) * pageSize + 1} to{" "}
          {Math.min(safePage * pageSize, filteredRows.length)} of {filteredRows.length} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-[#dfe3e8] bg-white px-4 text-[15px] text-[#667085]"
            disabled={safePage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </Button>
          <Button
            className="h-10 rounded-xl bg-[#0f172a] px-5 text-[15px] text-white hover:bg-[#111d3a]"
            disabled={safePage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[640px] overflow-hidden rounded-2xl border border-[#e4e7ec] p-0 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
          <DialogHeader className="flex-row items-center justify-between border-b border-[#eceff3] bg-[#f9fafb] px-6 py-4 text-left">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-[#101828]">
              {editingId ? "Update Sales Record" : "Add New Sales Record"}
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
              <label className="text-sm font-semibold text-[#344054]" htmlFor="product">
                Product Name
              </label>
              <Input
                id="product"
                value={form.product}
                onChange={(event) => setForm((prev) => ({ ...prev, product: event.target.value }))}
                placeholder="e.g. Enterprise License"
                className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054] placeholder:text-[#98a2b3]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="category">
                  Category
                </label>
                <Select
                  value={form.category}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger
                    id="category"
                    className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digital">Digital</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                    <SelectItem value="Subscription">Subscription</SelectItem>
                    <SelectItem value="Coffee">Coffee</SelectItem>
                  </SelectContent>
                </Select>
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
                  Price ($)
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
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
                />
              </div>
            </div>

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
                onClick={onSave}
              >
                {editingId ? "Save Record" : "Save Record"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
