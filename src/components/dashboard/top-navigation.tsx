"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CircleUserRound, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardNavItem } from "@/features/owner-dashboard/dashboard-mock";
import { cn } from "@/lib/utils";

interface TopNavigationProps {
  items: DashboardNavItem[];
}

export function TopNavigation({ items }: TopNavigationProps) {
  const pathname = usePathname();

  return (
    <header className="dashboard-container pt-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-full border border-slate-400 text-slate-700">
            <span className="text-xl leading-none">◡</span>
          </div>
          <p className="font-heading text-3xl leading-none font-semibold tracking-tight text-slate-900 md:text-[2rem]">
            Syntrix
          </p>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <nav className="rounded-full bg-white px-2 py-1.5 shadow-sm">
            <ul className="flex items-center gap-1">
              {items.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href ?? "#"}
                    className={cn(
                      "rounded-full px-4 py-2 text-sm font-medium text-slate-900 transition-colors",
                      item.href && pathname === item.href && "bg-slate-800 text-white",
                      !item.href && "cursor-default opacity-90",
                    )}
                    aria-disabled={!item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button variant="ghost" className="h-12 rounded-full bg-white px-4 text-sm text-slate-900">
            <Settings className="size-5" />
            Setting
          </Button>
          <Button variant="ghost" size="icon" className="size-12 rounded-full bg-white text-slate-900">
            <Bell className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-12 rounded-full bg-white text-slate-900">
            <CircleUserRound className="size-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
