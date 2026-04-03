"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Check, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type ThemeOption = {
  key: "light" | "dark" | "ocean";
  label: string;
  icon: typeof Sun;
};

const themeOptions: ThemeOption[] = [
  { key: "light", label: "Light", icon: Sun },
  { key: "dark", label: "Dark", icon: Moon },
  { key: "ocean", label: "Ocean", icon: Palette },
];

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel = true }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const currentThemeKey = useMemo(() => {
    if (!mounted) return "light";
    if (resolvedTheme === "dark" || resolvedTheme === "ocean") return resolvedTheme;
    return "light";
  }, [mounted, resolvedTheme]);

  const activeTheme =
    themeOptions.find((option) => option.key === currentThemeKey) ?? themeOptions[0];
  const ActiveIcon = activeTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "h-12 rounded-full border border-border bg-card px-4 text-sm text-foreground hover:bg-accent hover:text-accent-foreground",
            className,
          )}
          aria-label={`Theme menu. Current theme: ${activeTheme.label}`}
          title={`Theme: ${activeTheme.label}`}
        >
          <ActiveIcon className="size-5" />
          {showLabel ? activeTheme.label : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel>Theme Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themeOptions.map((option) => {
          const OptionIcon = option.icon;
          const isActive = option.key === currentThemeKey;

          return (
            <DropdownMenuItem
              key={option.key}
              onClick={() => setTheme(option.key)}
              className="cursor-pointer"
            >
              <OptionIcon className="size-4" />
              <span className="flex-1">{option.label}</span>
              {isActive ? <Check className="size-4" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
