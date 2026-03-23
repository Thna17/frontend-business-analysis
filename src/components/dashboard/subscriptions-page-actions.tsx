"use client";

import { ArrowUpRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubscriptionsPageActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        disabled
        className="h-11 rounded-full border-[#e4e7ec] bg-white px-5 text-sm text-[#98a2b3] disabled:opacity-100"
      >
        <Settings className="size-4" />
        Manage Billing
      </Button>
      <Button
        className="h-11 rounded-full bg-[#d4af35] px-6 text-sm font-medium text-[#101828] hover:bg-[#c39f2f]"
        onClick={() => window.dispatchEvent(new Event("subscription:upgrade"))}
      >
        <ArrowUpRight className="size-4" />
        Upgrade Plan
      </Button>
    </div>
  );
}
