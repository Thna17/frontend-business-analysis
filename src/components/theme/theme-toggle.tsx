"use client";

import { useMemo, useSyncExternalStore } from "react";
import { Check, ChevronDown, Moon, Palette, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
            "h-12 rounded-full border border-border bg-card px-4 text-sm text-foreground shadow-sm hover:bg-accent hover:text-accent-foreground",
            className,
          )}
          aria-label={`Theme menu. Current theme: ${activeTheme.label}`}
          title={`Theme: ${activeTheme.label}`}
        >
          <ActiveIcon className="size-5" />
          {showLabel ? (
            <>
              <span>{activeTheme.label}</span>
              <ChevronDown className="size-4 opacity-60" />
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[220px] rounded-[22px] border-border/70 bg-background/95 p-2 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl"
      >
        <div className="px-3 pb-2 pt-1">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Theme
          </p>
        </div>
        {themeOptions.map((option) => {
          const OptionIcon = option.icon;
          const isActive = option.key === currentThemeKey;

          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setTheme(option.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[16px] px-3 py-3 text-left transition-colors",
                isActive
                  ? "bg-muted text-foreground"
                  : "bg-transparent text-foreground hover:bg-muted/55",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  isActive ? "bg-background shadow-sm" : "bg-muted/70",
                )}
              >
                <OptionIcon className="size-[18px]" />
              </span>
              <span className="min-w-0 flex-1 text-sm font-medium">
                {option.label}
              </span>
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-transparent text-transparent",
                )}
                aria-hidden="true"
              >
                <Check className="size-[14px]" />
              </span>
            </button>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
