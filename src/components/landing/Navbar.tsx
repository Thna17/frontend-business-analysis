"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Platform", href: "#platform" },
  { label: "Features", href: "#solutions" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header className="lp-header">
        <div className="lp-container">
          <div className={cn("lp-header-shell", isScrolled && "is-scrolled")}>
            <BrandLogo
              href="/"
              size="md"
              priority
              linkClassName="lp-brand-lockup"
              className="lp-brand-mark"
              iconClassName="h-10 w-10 rounded-[16px]"
              nameClassName="text-[1.12rem] text-[var(--lp-text)]"
            />

            <nav
              className="lp-nav-panel"
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label="Primary"
            >
              <ul className="lp-nav-links">
                {navLinks.map((link, i) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="lp-nav-link"
                      onMouseEnter={() => setHoveredIndex(i)}
                    >
                      {hoveredIndex === i ? (
                        <motion.span
                          layoutId="nav-pill"
                          className="lp-nav-link-highlight"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        />
                      ) : null}
                      <span className="lp-nav-link-label">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lp-nav-right">
              <ThemeToggle showLabel={false} className="lp-theme-button" />
              <Link href="/login" className="lp-signin">
                Sign in
              </Link>
              <Link href="/signup" className="lp-btn lp-btn-primary lp-header-cta">
                Get started
              </Link>
            </div>

            <button
              type="button"
              className="lp-mobile-toggle"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            className="lp-mobile-menu-backdrop"
          >
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.98 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
              className="lp-mobile-menu"
            >
              <div className="lp-mobile-menu-header">
                <BrandLogo
                  href="/"
                  size="sm"
                  className="text-[var(--lp-text)]"
                  iconClassName="rounded-[14px]"
                  nameClassName="text-[1rem] text-[var(--lp-text)]"
                />
                <button
                  type="button"
                  className="lp-mobile-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <nav className="lp-mobile-nav" aria-label="Mobile primary">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="lp-mobile-nav-link"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <div className="lp-mobile-menu-footer">
                <ThemeToggle showLabel className="lp-mobile-theme-button" />
                <Link href="/login" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-ghost">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)} className="lp-btn lp-btn-primary">
                  Get started
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
