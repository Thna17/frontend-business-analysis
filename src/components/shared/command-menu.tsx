"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useTheme } from "next-themes";

type CommandLink = {
  label: string;
  href: string;
};

interface CommandMenuProps {
  quickLinks: CommandLink[];
  settingsHref: string;
  onLogout: () => Promise<void> | void;
  isLoggingOut?: boolean;
}

export function CommandMenu({
  quickLinks,
  settingsHref,
  onLogout,
  isLoggingOut = false,
}: CommandMenuProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-11 items-center justify-between whitespace-nowrap rounded-[calc(var(--radius-panel)-6px)] border border-border/70 bg-card/85 px-3.5 text-sm font-medium text-muted-foreground shadow-[var(--shadow-control)] transition-[background-color,color,border-color] duration-200 hover:bg-accent/65 hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 xl:w-[240px]"
      >
        <span className="hidden lg:inline-flex">Search workspace...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded-md border border-border/70 bg-muted/80 px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {quickLinks.map((link, index) => (
              <CommandItem
                key={link.href}
                onSelect={() => runCommand(() => router.push(link.href))}
              >
                {index === 0 ? (
                  <RocketIcon className="mr-2 h-4 w-4" />
                ) : (
                  <CalendarIcon className="mr-2 h-4 w-4" />
                )}
                <span>{link.label}</span>
              </CommandItem>
            ))}
            <CommandItem onSelect={() => runCommand(() => router.push(settingsHref))}>
              <GearIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <FaceIcon className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <FaceIcon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("ocean"))}>
              <FaceIcon className="mr-2 h-4 w-4" />
              <span>Ocean Theme</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(async () => {
                if (isLoggingOut) return;
                await onLogout();
              })}
            >
              <PersonIcon className="mr-2 h-4 w-4" />
              <span>Log out</span>
              <CommandShortcut>⇧⌘Q</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
