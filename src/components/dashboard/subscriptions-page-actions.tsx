"use client";

import { useRouter } from "next/navigation";
import { ArrowUpRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SubscriptionsPageActions() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        disabled
        className="h-11 rounded-full px-5 text-sm text-muted-foreground disabled:opacity-100"
      >
        <Settings className="size-4" />
        Manage Billing
      </Button>
      <Button
        variant="default"
        className="h-11 rounded-full px-6 text-sm"
        onClick={() => router.push("/payments")}
      >
        <ArrowUpRight className="size-4" />
        Upgrade Plan
      </Button>
    </div>
  );
}
