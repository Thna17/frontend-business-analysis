"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const stats = [
  { icon: TrendingUp, label: "Revenue tracked", value: "Real-time" },
  { icon: ShieldCheck, label: "Role-based access", value: "Owner & Admin" },
  { icon: Zap, label: "AI insights", value: "Always on" },
  { icon: Users, label: "Multi-workspace", value: "Built-in" },
];

const testimonial = {
  quote:
    "Finally a dashboard that shows me exactly what I need — revenue, top products, and where I'm losing money. I check it every morning.",
  author: "Sopheak R.",
  role: "Retail business owner",
};

const authEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

const formVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: authEase } },
};

// Shared auth page frame keeps login, signup, reset, and verification screens consistent.
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <main className="auth-shell">
      <div className="auth-shell-grid">
        {/* ── Dark / brand panel ── */}
        <section className="auth-shell-panel auth-shell-panel-dark">
          <div className="auth-shell-glow auth-shell-glow-primary" aria-hidden="true" />
          <div className="auth-shell-glow auth-shell-glow-secondary" aria-hidden="true" />

          {/* Brand */}
          <BrandLogo
            href="/"
            size="sm"
            linkClassName="auth-shell-brand"
            iconClassName="rounded-[14px]"
            nameClassName="text-white"
            showSubtitle
            subtitle="Analytics Platform"
            subtitleClassName="text-white/58"
          />

          {/* Hero copy */}
          <div className="auth-shell-hero">
            <div className="space-y-5">
              <h2 className="font-heading text-[2.1rem] font-semibold leading-[1.18] tracking-[-0.04em] text-white md:text-[2.6rem]">
                Know your business.<br />
                <span className="text-primary">Make every decision count.</span>
              </h2>
              <p className="max-w-sm text-[0.97rem] leading-7 text-white/64">
                One workspace to track revenue, understand what&apos;s selling,
                and act on AI-powered recommendations — no spreadsheets needed.
              </p>
            </div>
          </div>

          {/* Stat grid */}
          <div className="auth-shell-stats" aria-label="Platform highlights">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="auth-shell-stat">
                <div className="auth-shell-stat-icon">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="auth-shell-stat-value">{value}</p>
                  <p className="auth-shell-stat-label">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <blockquote className="auth-shell-testimonial">
            <p className="auth-shell-testimonial-quote">&ldquo;{testimonial.quote}&rdquo;</p>
            <footer className="auth-shell-testimonial-footer">
              <span className="auth-shell-testimonial-author">{testimonial.author}</span>
              <span className="auth-shell-testimonial-role">{testimonial.role}</span>
            </footer>
          </blockquote>
        </section>

        {/* ── Light / form panel ── */}
        <section className="auth-shell-panel auth-shell-panel-light">
          <div className="mx-auto w-full max-w-[420px]">
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              className="auth-shell-form-inner"
            >
              <motion.div variants={itemVariants} className="auth-shell-copy">
                <BrandLogo
                  href="/"
                  size="sm"
                  linkClassName="auth-shell-brand-mobile"
                  iconClassName="rounded-[14px]"
                  nameClassName="text-foreground"
                  showSubtitle
                  subtitle="Analytics Platform"
                  subtitleClassName="text-muted-foreground"
                />
                <h1 className="auth-shell-title">{title}</h1>
                <p className="auth-shell-subtitle">{subtitle}</p>
              </motion.div>

              <motion.div variants={itemVariants}>
                {children}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
