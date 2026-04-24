import * as React from "react"

import { cn } from "@/lib/utils"

import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground w-full min-w-0 rounded-[var(--radius-control)] border border-[color:var(--control-border)] bg-[var(--control-bg)] px-3.5 py-2 text-sm text-foreground shadow-[var(--shadow-control)] transition-[color,box-shadow,background-color,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/60 disabled:text-muted-foreground disabled:opacity-100 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 hover:border-[color:var(--control-border-strong)] hover:bg-[var(--control-bg-hover)]",
  {
    variants: {
      size: {
        default: "h-11",
        sm: "h-9 px-3",
        lg: "h-12 px-4",
      }
    },
    defaultVariants: {
      size: "default",
    }
  }
)

function Input({
  className,
  type,
  size,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ size }), className)}
      {...props}
    />
  )
}

export { Input }
