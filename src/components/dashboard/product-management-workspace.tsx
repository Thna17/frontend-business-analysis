"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CloudUpload,
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
import { ProductRow, RankingItem } from "@/features/owner-dashboard/dashboard-mock";

type DateFilter = "all" | "today" | "thisWeek" | "thisMonth";
type SortFilter = "nameAsc" | "salesHigh" | "stockLow" | "revenueHigh";

interface ProductForm {
  product: string;
  category: string;
  price: string;
  sales: string;
  stock: string;
  lastUpdated: string;
}

interface ProductManagementWorkspaceProps {
  initialRows: ProductRow[];
  rankingItems: RankingItem[];
}

const defaultAvatar =
  "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&w=64&q=60";

const pageSize = 3;

function formatMoney(value: number) {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function parseDate(input: string) {
  const date = new Date(input);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

export function ProductManagementWorkspace({
  initialRows,
  rankingItems,
}: ProductManagementWorkspaceProps) {
  const [rows, setRows] = useState<ProductRow[]>(initialRows);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortBy, setSortBy] = useState<SortFilter>("salesHigh");
  const [currentPage, setCurrentPage] = useState(1);

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>({
    product: "",
    category: "Coffee",
    price: "4.5",
    sales: "100",
    stock: "20",
    lastUpdated: new Date().toISOString().slice(0, 10),
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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
      const rowDate = parseDate(row.lastUpdated);
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
      if (sortBy === "nameAsc") return a.product.localeCompare(b.product);
      if (sortBy === "stockLow") return a.stock - b.stock;
      if (sortBy === "revenueHigh") return b.revenue - a.revenue;
      return b.sales - a.sales;
    });
  }, [rows, search, category, dateFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, safePage]);

  const exportCsv = () => {
    const header = ["Product", "Category", "Price", "Sales", "Revenue", "Stock", "LastUpdated"];
    const lines = filteredRows.map((row) => [
      row.product,
      row.category,
      row.price.toString(),
      row.sales.toString(),
      row.revenue.toString(),
      row.stock.toString(),
      row.lastUpdated,
    ]);
    const csv = [header, ...lines].map((line) => line.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "product-list.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const onOpenCreate = () => {
    setEditingId(null);
    setForm({
      product: "",
      category: "Coffee",
      price: "4.5",
      sales: "100",
      stock: "20",
      lastUpdated: new Date().toISOString().slice(0, 10),
    });
    setOpen(true);
  };

  const onOpenEdit = (row: ProductRow) => {
    setEditingId(row.id);
    setForm({
      product: row.product,
      category: row.category,
      price: row.price.toString(),
      sales: row.sales.toString(),
      stock: row.stock.toString(),
      lastUpdated: row.lastUpdated,
    });
    setOpen(true);
  };

  const onSave = () => {
    const price = Number(form.price);
    const sales = Number(form.sales);
    const stock = Number(form.stock);

    if (!form.product || !form.category || Number.isNaN(price) || Number.isNaN(sales) || Number.isNaN(stock)) {
      return;
    }

    const revenue = Number((price * Math.max(sales / 10, 1)).toFixed(2));

    if (editingId) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingId
            ? {
                ...row,
                product: form.product,
                category: form.category,
                price,
                sales,
                stock,
                revenue,
                lastUpdated: form.lastUpdated,
              }
            : row,
        ),
      );
    } else {
      const created: ProductRow = {
        id: `pr-${Date.now()}`,
        product: form.product,
        category: form.category,
        price,
        sales,
        stock,
        revenue,
        lastUpdated: form.lastUpdated,
        avatar: defaultAvatar,
      };
      setRows((prev) => [created, ...prev]);
      setCurrentPage(1);
    }

    setOpen(false);
  };

  const onDelete = (id: string) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
  };

  const onImportCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length <= 1) return;

    const imported = lines.slice(1).map((line, index) => {
      const [product, category, price, sales, revenue, stock, lastUpdated] = line.split(",");
      return {
        id: `import-${Date.now()}-${index}`,
        product: product || "Imported Product",
        category: category || "General",
        price: Number(price) || 0,
        sales: Number(sales) || 0,
        revenue: Number(revenue) || 0,
        stock: Number(stock) || 0,
        lastUpdated: lastUpdated || new Date().toISOString().slice(0, 10),
        avatar: defaultAvatar,
      } as ProductRow;
    });

    setRows((prev) => [...imported, ...prev]);
    setCurrentPage(1);
    event.target.value = "";
  };

  const lowStockCount = rows.filter((row) => row.stock <= 12).length;

  useEffect(() => {
    const handleAdd = () => {
      setEditingId(null);
      setForm({
        product: "",
        category: "Coffee",
        price: "4.5",
        sales: "100",
        stock: "20",
        lastUpdated: new Date().toISOString().slice(0, 10),
      });
      setOpen(true);
    };
    const handleExport = () => {
      const header = ["Product", "Category", "Price", "Sales", "Revenue", "Stock", "LastUpdated"];
      const lines = filteredRows.map((row) => [
        row.product,
        row.category,
        row.price.toString(),
        row.sales.toString(),
        row.revenue.toString(),
        row.stock.toString(),
        row.lastUpdated,
      ]);
      const csv = [header, ...lines].map((line) => line.join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "product-list.csv";
      link.click();
      URL.revokeObjectURL(url);
    };

    window.addEventListener("product:add", handleAdd);
    window.addEventListener("product:export", handleExport);

    return () => {
      window.removeEventListener("product:add", handleAdd);
      window.removeEventListener("product:export", handleExport);
    };
  }, [filteredRows]);

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <section className="dashboard-surface overflow-hidden border-[#e7e9ee] shadow-none">
        <div className="border-b border-[#edf1f5] px-6 py-5 md:px-7">
          <div className="flex flex-col gap-3">
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

              <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
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
                  <SelectItem value="salesHigh">Sort by: Sales</SelectItem>
                  <SelectItem value="revenueHigh">Sort by: Revenue</SelectItem>
                  <SelectItem value="stockLow">Sort by: Stock Low</SelectItem>
                  <SelectItem value="nameAsc">Sort by: Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f4] bg-white">
              {paginatedRows.map((row) => (
                <tr key={row.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${row.avatar}')` }} />
                      <p className="text-base font-semibold text-[#101828]">{row.product}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-base text-[#667085]">{row.category}</td>
                  <td className="px-5 py-4 text-base text-[#667085]">${row.price.toFixed(1)}</td>
                  <td className="px-5 py-4 text-base text-[#667085]">{row.sales}</td>
                  <td className="px-5 py-4 text-base font-semibold text-[#101828]">{formatMoney(row.revenue)}</td>
                  <td className="px-5 py-4 text-base text-[#667085]">{row.stock}</td>
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
                  <td colSpan={7} className="px-6 py-9 text-center text-sm text-[#667085]">
                    No products found.
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
      </section>

      <aside className="space-y-6">
        <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Product Revenue Ranking</h3>
          <div className="mt-6 space-y-6">
            {rankingItems.map((item, index) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-lg">
                  <span className="font-medium text-[#344054]">{item.name}</span>
                  <span className="font-medium text-[#d4af35]">${item.value.toLocaleString()}</span>
                </div>
                <div className="h-4 rounded-full bg-[#eceff3]">
                  <div
                    className="h-full rounded-full bg-[#d4af35]"
                    style={{ width: `${item.width}%`, opacity: 1 - index * 0.17 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-surface border-[#e7e9ee] p-6 shadow-none">
          <h3 className="dashboard-section-title">Quick Actions</h3>
          <p className="mt-2 text-sm text-[#667085]">Low stock: {lowStockCount} items</p>
          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={onOpenCreate}
              className="flex w-full items-center gap-3 rounded-full border border-[#ead9a2] bg-[#fffaf0] px-4 py-3 text-left text-base font-medium text-[#7a5e0b]"
            >
              <Plus className="size-4" />
              Add New Product
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-full border border-[#e4e7ec] bg-white px-4 py-3 text-left text-base font-medium text-[#344054]"
            >
              <CloudUpload className="size-4" />
              Import CSV
            </button>

            <button
              type="button"
              onClick={exportCsv}
              className="flex w-full items-center gap-3 rounded-full border border-[#e4e7ec] bg-white px-4 py-3 text-left text-base font-medium text-[#344054]"
            >
              <Download className="size-4" />
              Export Product List
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={onImportCsv} />
        </section>
      </aside>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[640px] overflow-hidden rounded-2xl border border-[#e4e7ec] p-0 shadow-[0_20px_48px_rgba(15,23,42,0.18)]">
          <DialogHeader className="flex-row items-center justify-between border-b border-[#eceff3] bg-[#f9fafb] px-6 py-4 text-left">
            <DialogTitle className="text-2xl font-semibold tracking-tight text-[#101828]">
              {editingId ? "Update Product" : "Add New Product"}
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
                placeholder="e.g. Premium Dashboard UI"
                className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054] placeholder:text-[#98a2b3]"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="category">
                  Category
                </label>
                <Select value={form.category} onValueChange={(value) => setForm((prev) => ({ ...prev, category: value }))}>
                  <SelectTrigger id="category" className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Coffee">Coffee</SelectItem>
                    <SelectItem value="Tea">Tea</SelectItem>
                    <SelectItem value="Digital">Digital</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="price">
                  Price ($)
                </label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  step="0.1"
                  value={form.price}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="sales">
                  Sales
                </label>
                <Input
                  id="sales"
                  type="number"
                  min={0}
                  value={form.sales}
                  onChange={(event) => setForm((prev) => ({ ...prev, sales: event.target.value }))}
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
                />
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="stock">
                  Stock
                </label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
                  className="h-12 rounded-xl border-[#dfe3e8] bg-white text-base text-[#344054]"
                />
              </div>
              <div className="grid gap-2.5">
                <label className="text-sm font-semibold text-[#344054]" htmlFor="lastUpdated">
                  Date
                </label>
                <Input
                  id="lastUpdated"
                  type="date"
                  value={form.lastUpdated}
                  onChange={(event) => setForm((prev) => ({ ...prev, lastUpdated: event.target.value }))}
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
              <Button className="h-11 rounded-xl bg-[#0f172a] px-7 text-base text-white hover:bg-[#111d3a]" onClick={onSave}>
                {editingId ? "Save Product" : "Add Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
