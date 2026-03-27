"use client";

import { CalendarDays, ChevronDown, Pencil, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SalesTransaction } from "@/features/owner-dashboard/dashboard-mock";

interface RecentSalesCardProps {
  rows: SalesTransaction[];
}

export function RecentSalesCard({ rows }: RecentSalesCardProps) {
  return (
    <section className="dashboard-surface overflow-hidden border-[#e7e9ee] shadow-none">
      <div className="flex items-center justify-between border-b border-[#edf1f5] px-7 py-6">
        <h3 className="dashboard-section-title">Recent Sales Transactions</h3>
        <button type="button" className="text-sm font-medium text-[#d4af35]">
          View all
        </button>
      </div>

      <div className="border-b border-[#edf1f5] px-7 py-5">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#98a2b3]" />
            <Input
              className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] pl-10 text-[15px]"
              placeholder="Search records..."
            />
          </div>

          <Select defaultValue="all">
            <SelectTrigger className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-[15px] text-[#344054] lg:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category: All</SelectItem>
              <SelectItem value="coffee">Coffee</SelectItem>
              <SelectItem value="tea">Tea</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-[15px] text-[#344054]">
            <CalendarDays className="size-4" />
            Filter Date
          </Button>
          <Button variant="outline" className="h-11 rounded-xl border-[#dfe3e8] bg-[#f6f7f9] text-[15px] text-[#344054]">
            Sort by
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left">
          <thead className="bg-[#f5f6f8] text-[13px] font-semibold tracking-[0.03em] text-[#667085] uppercase">
            <tr>
              <th className="px-7 py-4">Product</th>
              <th className="px-5 py-4">Product</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#eef1f4] bg-white">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-7 py-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-11 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${row.avatar}')` }}
                    />
                    <p className="text-sm font-medium text-[#101828]">{row.customer}</p>
                  </div>
                </td>
                <td className="px-5 py-5 text-sm text-[#667085]">{row.product}</td>
                <td className="px-5 py-5 text-sm font-semibold text-[#101828]">{row.total}</td>
                <td className="px-5 py-5 text-sm text-[#667085]">{row.date}</td>
                <td className="px-5 py-5">
                  <span className="inline-flex rounded-full bg-[#d7f2e3] px-3 py-1 text-sm font-medium text-[#067647]">
                    {row.status}
                  </span>
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-3 text-[#98a2b3]">
                    <button type="button">
                      <Pencil className="size-4" />
                    </button>
                    <button type="button">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 border-t border-[#edf1f5] px-7 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#667085]">Showing 1 to 3 of 58 entries</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-[#dfe3e8] bg-white text-[15px] text-[#667085]">
            Previous
          </Button>
          <Button className="h-10 rounded-xl bg-slate-900 px-5 text-[15px] text-white hover:bg-slate-800">
            Next
          </Button>
        </div>
      </div>
    </section>
  );
}
