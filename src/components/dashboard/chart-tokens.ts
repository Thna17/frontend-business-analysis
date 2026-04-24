export const dashboardChartPalette = {
  primary: "var(--primary)",
  primaryStrong: "#b88910",
  primarySoft: "color-mix(in srgb, var(--primary) 28%, white 72%)",
  primarySoftOpaque: "color-mix(in srgb, var(--primary) 42%, white 58%)",
  neutralTrack: "color-mix(in srgb, var(--surface-contrast) 72%, white 28%)",
  grid: "var(--chart-grid)",
  highlight: "#7a6200",
  muted: "var(--muted-foreground)",
} as const;

export function dashboardHeatmapColor(intensity: number) {
  const clamped = Math.max(0, Math.min(intensity, 5));
  return `color-mix(in srgb, var(--primary) ${12 + clamped * 14}%, transparent)`;
}
