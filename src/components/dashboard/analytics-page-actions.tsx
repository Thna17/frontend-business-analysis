"use client";

import { Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEntitlements } from "@/features/subscriptions/use-entitlements";

export function AnalyticsPageActions() {
  const entitlements = useEntitlements();
  const canExport = entitlements.canAccess("reports.export");

  if (!canExport) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="px-4"
        onClick={() => window.dispatchEvent(new Event("analytics:export"))}
      >
        <Share2 className="size-4" />
        Export Analytics
      </Button>
      <Button
        className="px-5"
        onClick={() => window.dispatchEvent(new Event("analytics:download"))}
      >
        <Download className="size-4" />
        Download Report
      </Button>
    </div>
  );
}
