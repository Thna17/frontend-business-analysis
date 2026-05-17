import { BrandLogo } from "@/components/shared/brand-logo";
import { Lock } from "lucide-react";
import { paymentSuccessFooter } from "@/data/payment-success";

export default function SuccessFooter() {
  return (
    <footer className="flex items-center justify-between gap-4 rounded-[calc(var(--radius-panel)-2px)] border border-border/70 bg-card/60 px-5 py-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5">
          <Lock className="size-3.5" />
          Secure checkout
        </span>
        <span className="hidden text-muted-foreground/50 sm:inline">•</span>
        <BrandLogo
          href="/"
          size="sm"
          className="hidden sm:inline-flex"
          iconClassName="rounded-[14px]"
          nameClassName="text-[1rem] text-foreground"
        />
        <p className="hidden sm:block">{paymentSuccessFooter.copyright}</p>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-4">
        {paymentSuccessFooter.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="transition-colors hover:text-foreground"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
