"use client";

import { Button } from "@/components/ui/button";

export function SettingsPageActions() {
  return (
    <Button
      className="h-11 rounded-full bg-[#d4af35] px-6 text-sm font-semibold text-[#101828] hover:bg-[#c39f2f]"
      onClick={() => window.dispatchEvent(new Event("settings:save"))}
    >
      Save Changes
    </Button>
  );
}
