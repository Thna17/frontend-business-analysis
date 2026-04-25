"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ChevronRight,
  Download,
  Eye,
  FileText,
  Lightbulb,
  Plus,
  Trash2,
  Info,
} from "lucide-react";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { PageSummaryStrip } from "@/components/shared/page-summary-strip";
import { DashboardDataTable } from "@/components/shared/dashboard-data-table";
import { StateMessage } from "@/components/shared/state-message";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useDeleteReportMutation,
  useGenerateReportMutation,
  useGetReportsDashboardQuery,
} from "@/store/api";
import { FeatureGate } from "@/components/shared/feature-gate";

type ReportType = "Sales" | "Revenue" | "Product" | "Customer";
type ExportFormat = "PDF" | "CSV" | "Excel";
type DateRange = "Last 7 Days" | "Last 30 Days" | "This Quarter" | "This Year";

function toneClass(tone: "amber" | "slate") {
  return tone === "amber"
    ? "border-amber-200 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10"
    : "border-border bg-muted/40";
}

function statusClass(status: "READY" | "PROCESSING") {
  return status === "READY"
    ? "dashboard-status-positive"
    : "dashboard-status-warning";
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function ReportsWorkspace() {
  const [page, setPage] = useState(1);
  const [reportType, setReportType] = useState<ReportType>("Sales");
  const [category, setCategory] = useState("All Categories");
  const [dateRange, setDateRange] = useState<DateRange>("Last 30 Days");
  const [format, setFormat] = useState<ExportFormat>("PDF");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const {
    data,
    isFetching,
  } = useGetReportsDashboardQuery({ page, limit: 5 });

  const [generateReport, { isLoading: isGenerating }] = useGenerateReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  const selectedReport = useMemo(
    () => (data?.history ?? []).find((item) => item.id === selectedReportId) ?? null,
    [data?.history, selectedReportId],
  );

  const reportTypes = data?.generator.reportTypes ?? ["Sales", "Revenue", "Product", "Customer"];
  const categories = data?.generator.categories ?? ["All Categories"];
  const dateRanges = data?.generator.dateRanges ?? ["Last 30 Days"];
  const formatOptions = data?.generator.exportFormats ?? ["PDF", "CSV", "Excel"];
  const historyRows = data?.history ?? [];
  const hasNextPage = historyRows.length === 5;
  const summaryCards = [
    {
      label: "Generated Reports",
      value: `${data?.summary.generatedReports ?? 0}`,
      note: "Total export jobs tracked",
    },
    {
      label: "Current Revenue Snapshot",
      value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(data?.summary.currentRevenue ?? 0),
      note: "Included in reporting exports",
    },
    {
      label: "Product Download Requests",
      value: `${data?.summary.productDownloads ?? 0}`,
      note: "High-demand export activity",
    },
  ];

  const handleGenerate = useCallback(async () => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await generateReport({
        reportType,
        categoryFilter: category,
        dateRange,
        exportFormat: format,
      }).unwrap();
      setActionSuccess(`${reportType} report queued in ${format}. You can track its status in report history.`);
    } catch (error) {
      setActionError(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  }, [generateReport, reportType, category, dateRange, format]);

  const exportData = useCallback(() => {
    const content = [
      `Report Type: ${reportType}`,
      `Category: ${category}`,
      `Date Range: ${dateRange}`,
      `Export Format: ${format}`,
      "",
      `Business: ${data?.summary.businessName ?? "Syntrix"}`,
      `Generated Reports: ${data?.summary.generatedReports ?? 0}`,
    ].join("\n");

    const extension = format === "Excel" ? "xlsx" : format.toLowerCase();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `syntrix-report.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  }, [reportType, category, dateRange, format, data?.summary.businessName, data?.summary.generatedReports]);

  useEffect(() => {
    const onGenerate = () => {
      void handleGenerate();
    };
    const onExport = () => exportData();
    window.addEventListener("report:generate", onGenerate);
    window.addEventListener("report:export", onExport);
    return () => {
      window.removeEventListener("report:generate", onGenerate);
      window.removeEventListener("report:export", onExport);
    };
  }, [handleGenerate, exportData]);

  const onDownloadHistory = (row: { name: string; type: string; dateGenerated: string; status: string; format: string }) => {
    if (row.status !== "READY") return;
    const text = [
      `Report: ${row.name}`,
      `Type: ${row.type}`,
      `Generated: ${formatDate(row.dateGenerated)}`,
      `Status: ${row.status}`,
      `Format: ${row.format}`,
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${row.name.replace(/\s+/g, "-").toLowerCase()}.${row.format.toLowerCase() === "excel" ? "xlsx" : row.format.toLowerCase()}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const openReportPreview = (reportId: string) => {
    setSelectedReportId(reportId);
    setOpenPreview(true);
  };

  const removeReport = async (reportId: string) => {
    setActionError(null);
    setActionSuccess(null);
    try {
      await deleteReport(reportId).unwrap();
      setActionSuccess("Report removed from history.");
    } catch (error) {
      setActionError(getApiErrorMessage(error, "Something went wrong. Please try again."));
    }
  };

  const exportShortcut = (label: string) => {
    const blob = new Blob(
      [`${label}\nGenerated at ${new Date().toISOString()}\nBusiness: ${data?.summary.businessName ?? "Syntrix"}`],
      { type: "text/plain;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${label.toLowerCase().replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <PageSummaryStrip
          eyebrow="Reporting Workspace"
          title="Generate exports with less friction"
          description="Keep report generation focused on the few choices that matter, then monitor readiness and download state from one workspace."
          items={summaryCards.map((item) => ({
            label: item.label,
            value: item.value,
            helper: item.note,
          }))}
        />

        <FeatureGate feature="reports.export" className="min-h-[200px]">
          <DashboardPanel
            title="Generate New Report"
            description="Create export-ready reports with a consistent structure and a smaller number of high-signal choices."
            bodyClassName="grid gap-6 pt-5"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="dashboard-field-label">Report Type</p>
                <div className="flex flex-wrap gap-2">
                  {reportTypes.map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={reportType === type ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setReportType(type)}
                      className="rounded-full px-4"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="dashboard-field-label">Category Filter</p>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                  {categories.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="dashboard-field-label">Date Range</p>
                <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                  {dateRanges.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="dashboard-field-label">Export Format</p>
                <div className="flex flex-wrap gap-2">
                  {formatOptions.map((item) => (
                    <Button
                      key={item}
                      type="button"
                      variant={format === item ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setFormat(item)}
                      className="rounded-full px-5"
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1.2fr_auto]">
              <div className="dashboard-inline-feedback dashboard-inline-feedback-info">
                <Info className="mt-0.5 size-4 shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">Current export setup</p>
                  <p>{reportType} report for {category} over {dateRange}, exported as {format}.</p>
                </div>
              </div>
              <div className="dashboard-soft-tile space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Delivery</p>
                <p className="text-sm text-foreground">Exports are processed in the background and stay available in history.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="h-12 px-8 text-base font-semibold"
                onClick={() => {
                  void handleGenerate();
                }}
                disabled={isGenerating}
              >
                <Plus className="size-4" />
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
            {actionSuccess ? <StateMessage tone="success" message={actionSuccess} /> : null}
            {actionError ? (
              <StateMessage tone="danger" title="Unable to generate report" message={actionError} />
            ) : null}
          </DashboardPanel>
        </FeatureGate>

        <DashboardPanel
          title="Report History"
          description="Track generated exports, check status, and re-open prior reports without leaving the reporting workspace."
          action={<p className="text-sm text-muted-foreground">{isFetching ? "Refreshing history..." : `${historyRows.length} items loaded`}</p>}
          bodyClassName="p-0"
        >
          <div className="dashboard-mobile-list">
            {historyRows.map((row) => (
              <article key={`mobile-${row.id}`} className="dashboard-mobile-card">
                <div className="dashboard-mobile-card-header">
                  <div className="min-w-0">
                    <p className="dashboard-table-title-cell">{row.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{formatDate(row.dateGenerated)}</p>
                  </div>
                  <Badge className={`px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                    {row.status}
                  </Badge>
                </div>
                <div className="dashboard-mobile-card-grid">
                  <div>
                    <p className="dashboard-mobile-card-label">Type</p>
                    <p className="dashboard-mobile-card-value">{row.type}</p>
                  </div>
                  <div>
                    <p className="dashboard-mobile-card-label">Format</p>
                    <p className="dashboard-mobile-card-value">{row.format}</p>
                  </div>
                </div>
                <div className="dashboard-row-actions pt-1">
                  <button type="button" onClick={() => onDownloadHistory(row)} className="dashboard-row-action">
                    <Download className="size-4" />
                    Download
                  </button>
                  <button type="button" onClick={() => openReportPreview(row.id)} className="dashboard-row-action">
                    <Eye className="size-4" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void removeReport(row.id);
                    }}
                    disabled={isDeleting}
                    className="dashboard-row-action dashboard-row-action-danger"
                  >
                    <Trash2 className="size-4" />
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {historyRows.length === 0 ? (
              <EmptyState
                eyebrow="Report history"
                title="No reports yet"
                description="Generate your first report to start building a reusable history of exports and business summaries."
                className="rounded-2xl"
              />
            ) : null}
          </div>

          <DashboardDataTable
            hiddenBelow="md"
            ariaLabel="Report history table"
            caption="Report history with report name, type, generation date, status, and actions"
            tableClassName="min-w-[780px]"
          >
              <thead>
                <tr>
                  <th className="px-4 py-4">Report Name</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Date Generated</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {historyRows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2">
                        <FileText className="size-4 text-primary" />
                        <span className="dashboard-table-title-cell">{row.name}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 dashboard-table-body-text">{row.type}</td>
                    <td className="px-4 py-4 dashboard-table-body-text">{formatDate(row.dateGenerated)}</td>
                    <td className="px-4 py-4">
                      <Badge className={`px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="dashboard-row-actions">
                        <button type="button" onClick={() => onDownloadHistory(row)} className="dashboard-row-action">
                          <Download className="size-4" />
                          Download
                        </button>
                        <button type="button" onClick={() => openReportPreview(row.id)} className="dashboard-row-action">
                          <Eye className="size-4" />
                          Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void removeReport(row.id);
                        }}
                          disabled={isDeleting}
                          className="dashboard-row-action dashboard-row-action-danger"
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {historyRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8">
                      <EmptyState
                        eyebrow="Report history"
                        title="No reports yet"
                        description="Generate your first report to start building a reusable history of exports and business summaries."
                        className="rounded-2xl"
                      />
                    </td>
                  </tr>
                ) : null}
              </tbody>
          </DashboardDataTable>
          <div className="dashboard-table-footer">
            <p className="text-sm text-muted-foreground">
              Page {page} {hasNextPage ? "with more history available" : "of current report history"}
            </p>
            <div className="dashboard-pagination">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1 || isFetching}
              >
                Previous
              </Button>
              <Button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasNextPage || isFetching}
              >
                Next
              </Button>
            </div>
          </div>
        </DashboardPanel>
      </div>

      <aside className="space-y-6">
        <DashboardPanel
          title="Business Insights"
          description="Surface guidance and anomalies next to the reporting workflow so insights remain actionable."
          bodyClassName="space-y-3 pt-5"
        >
          <div className="space-y-3">
            {(data?.insights ?? []).map((insight) => (
              <div key={insight.title} className={`rounded-[calc(var(--radius-panel)-4px)] border p-4 ${toneClass(insight.tone)}`}>
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="size-4 text-primary" />
                  <p className="dashboard-table-title-cell">{insight.title}</p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel
          title="Quick Data Export"
          description="Common export shortcuts for teams that need fast access to operational data."
          bodyClassName="space-y-3 pt-5"
        >
          <div className="mt-4 space-y-3">
            {(data?.quickExports ?? []).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => exportShortcut(item)}
                className="flex w-full items-center justify-between rounded-[calc(var(--radius-panel)-4px)] border border-border/80 bg-[color:var(--surface-subtle)] px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-accent/60"
              >
                {item}
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            Exports are typically processed within 5-10 minutes. You will receive an email once your data is ready.
          </p>
        </DashboardPanel>
      </aside>

      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-[520px] rounded-[var(--radius-panel)] border border-border/80 shadow-[var(--shadow-overlay)]">
          <DialogHeader>
            <DialogTitle className="dashboard-panel-title">Report Preview</DialogTitle>
          </DialogHeader>
          {selectedReport ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Name:</strong> {selectedReport.name}
              </p>
              <p>
                <strong className="text-foreground">Type:</strong> {selectedReport.type}
              </p>
              <p>
                <strong className="text-foreground">Generated:</strong> {formatDate(selectedReport.dateGenerated)}
              </p>
              <p>
                <strong className="text-foreground">Status:</strong> {selectedReport.status}
              </p>
              <div className="pt-2">
                <Button onClick={() => onDownloadHistory(selectedReport)}>
                  Download
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
}
