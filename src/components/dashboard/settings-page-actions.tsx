"use client";

import { Button } from "@/components/ui/button";

export function SettingsPageActions() {
  return (
    <Button
      variant="default"
      className="h-11 rounded-full px-6 text-sm"
      onClick={() => window.dispatchEvent(new Event("settings:save"))}
    >
      Save Changes
    </Button>
  );
}
