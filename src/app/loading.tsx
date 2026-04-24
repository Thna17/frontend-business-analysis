export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-5 text-center">
        {/* Spinner */}
        <div className="relative h-11 w-11">
          <div className="absolute inset-0 rounded-full border-[2.5px] border-border/60" />
          <div className="absolute inset-0 animate-spin rounded-full border-[2.5px] border-primary border-t-transparent" />
          <div className="absolute inset-[9px] rounded-full bg-[color:var(--surface-subtle)]" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold tracking-tight text-foreground">Just a moment</p>
          <p className="text-sm text-muted-foreground">Getting your workspace ready…</p>
        </div>
      </div>
    </div>
  );
}
