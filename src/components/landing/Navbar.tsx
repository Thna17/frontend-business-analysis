"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Navbar() {
  return (
    <header className="site-header">
      <div className="container nav-container">
        <div className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Syntrix logo"
            width={180}
            height={88}
            className="h-[88px] w-auto object-contain"
            priority
          />
        </div>

        <nav className="desktop-nav">
          <a href="#platform" className="active">
            Platform
          </a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="nav-actions">
          <ThemeToggle className="landing-theme-toggle h-10 px-3 text-sm" />
          <a href="/login" className="signin-link">
            Sign In
          </a>
          <a href="/signup" className="header-btn">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}



