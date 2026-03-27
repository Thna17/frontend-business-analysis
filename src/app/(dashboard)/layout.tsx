import Link from "next/link";
import { Building2 } from "lucide-react";

const navItems = [
  { href: "/owner", label: "Business Owner" },
  { href: "/admin", label: "Administrator" },
];

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="rounded-md bg-slate-900 p-1.5 text-white">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="font-heading text-sm font-semibold sm:text-base">
              Smart Business Analytics
            </span>
          </Link>

          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
