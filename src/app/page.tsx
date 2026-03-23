import Link from "next/link";
import { BarChart3, Building2, ShieldCheck, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const highlights = [
  {
    title: "Sales Transaction Management",
    description:
      "Record, edit, delete, and filter transactions with product, category, quantity, and date.",
    icon: WalletCards,
  },
  {
    title: "Revenue Analytics",
    description:
      "Track total revenue, daily trend, monthly comparison, growth, and top-performing products.",
    icon: BarChart3,
  },
  {
    title: "Business Profile Management",
    description:
      "Manage business profile details and contact information from one place.",
    icon: Building2,
  },
  {
    title: "Role-Based Dashboard",
    description:
      "Business Owner and Administrator each see data and actions based on permissions.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-900 p-8 text-white shadow-2xl sm:p-10">
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">
          Smart Business Analytics SaaS
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-5xl">
          Start Your SRS-Driven Frontend Foundation
        </h1>
        <p className="mt-4 max-w-2xl text-sm text-slate-200 sm:text-base">
          This project is now structured for your training system requirements with Next.js,
          TypeScript, shadcn/ui, and Tailwind.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/auth/login">Go to Login</Link>
          </Button>
          <Button variant="outline" asChild className="border-white/30 bg-white/10 text-white hover:bg-white/20">
            <Link href="/owner">Business Owner Dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="border-white/30 bg-white/10 text-white hover:bg-white/20">
            <Link href="/admin">Admin Dashboard</Link>
          </Button>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="border-slate-200/80 bg-white/90 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Icon className="h-5 w-5 text-cyan-700" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
