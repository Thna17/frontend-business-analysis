"use client";

import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportsPageActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-11 rounded-full border-[#dfe3e8] bg-white px-5 text-sm text-[#344054]"
        onClick={() => window.dispatchEvent(new Event("report:export"))}
      >
        <Download className="size-4" />
        Export Data
      </Button>
      <Button
        className="h-11 rounded-full bg-[#d4af35] px-6 text-sm font-medium text-[#101828] hover:bg-[#c39f2f]"
        onClick={() => window.dispatchEvent(new Event("report:generate"))}
      >
        <Plus className="size-4" />
        Generate Report
      </Button>
    </div>
  );
}
