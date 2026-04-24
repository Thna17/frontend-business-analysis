"use client";

import { Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductPageActions() {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="h-11 rounded-full px-5 text-sm"
        onClick={() => window.dispatchEvent(new Event("product:export"))}
      >
        <Download className="size-4" />
        Export Product List
      </Button>
      <Button
        className="h-11 rounded-full px-6 text-sm font-medium"
        onClick={() => window.dispatchEvent(new Event("product:add"))}
      >
        <Plus className="size-4" />
        Add Product
      </Button>
    </div>
  );
}
