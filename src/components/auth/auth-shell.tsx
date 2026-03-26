import Link from "next/link";
import { BarChart3, CircleCheckBig } from "lucide-react";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const valuePoints = [
  "Track sales and revenue in one dashboard",
  "Role-based access for owners and administrators",
  "Fast setup and scalable SaaS-ready UI",
];

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#f3f4f6] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto grid w-full max-w-[1100px] overflow-hidden rounded-3xl border border-[#e4e7ec] bg-white shadow-[0_25px_60px_rgba(16,24,40,0.08)] lg:grid-cols-[1fr_1.08fr]">
        <section className="relative hidden overflow-hidden bg-[#0f172a] p-10 text-white lg:block">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#d4af35]/20 blur-2xl" />
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-[#1f3c88]/35 blur-2xl" />

          <Link href="/" className="relative z-10 inline-flex items-center gap-2 text-sm text-white/85 hover:text-white">
            <BarChart3 className="size-5 text-[#d4af35]" />
            Syntrix Analytics
          </Link>

          <div className="relative z-10 mt-16 max-w-sm">
            <p className="font-heading text-4xl leading-tight font-semibold">Smart Business Analytics SaaS</p>
            <p className="mt-4 text-base text-white/75">
              Build a data-driven business with clean workflows, modern dashboards, and consistent performance insights.
            </p>
          </div>

          <div className="relative z-10 mt-12 space-y-4">
            {valuePoints.map((point) => (
              <div key={point} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <CircleCheckBig className="mt-0.5 size-4 text-[#d4af35]" />
                <span className="text-sm text-white/90">{point}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="p-6 sm:p-8 md:p-10">
          <div className="mx-auto w-full max-w-[460px]">
            <div className="mb-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-[#8a6b0b] uppercase">Authentication</p>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-[#101828]">{title}</h1>
              <p className="mt-2 text-sm text-[#667085]">{subtitle}</p>
            </div>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
