"use client";

import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEntitlements } from "@/features/subscriptions/use-entitlements";

export function ReportsPageActions() {
  const entitlements = useEntitlements();

  if (!entitlements.canAccess("reports.export")) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="px-4"
        onClick={() => window.dispatchEvent(new Event("report:export"))}
      >
        <Download className="size-4" />
        Export Data
      </Button>
      <Button
        className="px-5"
        onClick={() => window.dispatchEvent(new Event("report:generate"))}
      >
        <Plus className="size-4" />
        Generate Report
      </Button>
    </div>
  );
}
