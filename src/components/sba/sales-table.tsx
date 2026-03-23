"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SaleRecord } from "@/types/domain";

interface SalesTableProps {
  sales: SaleRecord[];
}

export function SalesTable({ sales }: SalesTableProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => ["all", ...new Set(sales.map((item) => item.category.toLowerCase()))],
    [sales],
  );

  const filteredSales = useMemo(() => {
    return sales.filter((item) => {
      const keywordMatch =
        keyword.length === 0 ||
        item.productName.toLowerCase().includes(keyword.toLowerCase());

      const categoryMatch =
        category === "all" || item.category.toLowerCase() === category;

      return keywordMatch && categoryMatch;
    });
  }, [sales, keyword, category]);

  return (
    <Card className="bg-white/90">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Sales Records</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by product name"
              className="pl-9"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-52">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item} value={item}>
                  {item === "all" ? "All Categories" : item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Quantity</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.productName}</td>
                  <td className="px-4 py-3 text-slate-600">{item.category}</td>
                  <td className="px-4 py-3 text-slate-600">${item.price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                  <td className="px-4 py-3 text-slate-600">{item.date}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredSales.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No sales match your filters.</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
