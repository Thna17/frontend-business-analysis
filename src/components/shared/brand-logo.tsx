import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md" | "lg";

const sizeConfig: Record<
  BrandLogoSize,
  {
    icon: string;
    name: string;
    subtitle: string;
    gap: string;
  }
> = {
  sm: {
    icon: "h-8 w-8",
    name: "text-base",
    subtitle: "text-[0.62rem]",
    gap: "gap-2.5",
  },
  md: {
    icon: "h-10 w-10",
    name: "text-[1.1rem]",
    subtitle: "text-[0.68rem]",
    gap: "gap-3",
  },
  lg: {
    icon: "h-12 w-12",
    name: "text-[1.22rem]",
    subtitle: "text-[0.72rem]",
    gap: "gap-3.5",
  },
};

interface BrandLogoProps {
  href?: string;
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
  nameClassName?: string;
  subtitleClassName?: string;
  size?: BrandLogoSize;
  subtitle?: string;
  showSubtitle?: boolean;
  priority?: boolean;
}

function BrandLogoInner({
  className,
  iconClassName,
  nameClassName,
  subtitleClassName,
  size = "md",
  subtitle = "Smart Business Analytics",
  showSubtitle = false,
  priority = false,
}: Omit<BrandLogoProps, "href">) {
  const config = sizeConfig[size];

  return (
    <span className={cn("inline-flex min-w-0 items-center", config.gap, className)}>
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[18px]",
          config.icon,
          iconClassName,
        )}
      >
        <Image
          src="/logo-syntrix.png"
          alt="Syntrix"
          fill
          sizes="48px"
          className="object-contain"
          priority={priority}
        />
      </span>
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            "truncate font-heading font-semibold tracking-[-0.045em] text-current",
            config.name,
            nameClassName,
          )}
        >
          Syntrix
        </span>
        {showSubtitle ? (
          <span
            className={cn(
              "mt-0.5 truncate font-medium uppercase tracking-[0.18em] text-current/60",
              config.subtitle,
              subtitleClassName,
            )}
          >
            {subtitle}
          </span>
        ) : null}
      </span>
    </span>
  );
}

export function BrandLogo(props: BrandLogoProps) {
  const { href, linkClassName, ...rest } = props;

  if (!href) {
    return <BrandLogoInner {...rest} />;
  }

  return (
    <Link href={href} aria-label="Syntrix home" className={linkClassName}>
      <BrandLogoInner {...rest} />
    </Link>
  );
}
