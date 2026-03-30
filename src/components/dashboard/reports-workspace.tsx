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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  useDeleteReportMutation,
  useGenerateReportMutation,
  useGetReportsDashboardQuery,
} from "@/store/api";

type ReportType = "Sales" | "Revenue" | "Product" | "Customer";
type ExportFormat = "PDF" | "CSV" | "Excel";
type DateRange = "Last 7 Days" | "Last 30 Days" | "This Quarter" | "This Year";

function normalizeError(error: unknown) {
  const payload = error as { data?: { message?: string } };
  return payload?.data?.message ?? "Something went wrong. Please try again.";
}

function toneClass(tone: "amber" | "slate") {
  return tone === "amber"
    ? "border-[#ead9a2] bg-[#fffaf0]"
    : "border-[#e4e7ec] bg-[#f8fafc]";
}

function statusClass(status: "READY" | "PROCESSING") {
  return status === "READY"
    ? "bg-[#d7f2e3] text-[#067647]"
    : "bg-[#fef3d2] text-[#b67a08]";
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

  const handleGenerate = useCallback(async () => {
    setActionError(null);
    try {
      await generateReport({
        reportType,
        categoryFilter: category,
        dateRange,
        exportFormat: format,
      }).unwrap();
    } catch (error) {
      setActionError(normalizeError(error));
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
    try {
      await deleteReport(reportId).unwrap();
    } catch (error) {
      setActionError(normalizeError(error));
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
        <article className="dashboard-surface border-[#e7e9ee] shadow-none">
          <div className="border-b border-[#edf1f5] px-6 py-5">
            <h3 className="dashboard-section-title">Generate New Report</h3>
          </div>
          <div className="grid gap-6 px-6 py-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#344054]">Report Type</p>
                <div className="flex flex-wrap gap-2">
                  {reportTypes.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setReportType(type)}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        reportType === type
                          ? "bg-[#d4af35] text-[#101828]"
                          : "bg-[#eef1f5] text-[#475467]"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-[#344054]">Category Filter</p>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="h-11 w-full rounded-full border border-[#dfe3e8] bg-[#f6f7f9] px-4 text-sm text-[#344054]"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="mb-2 text-sm font-semibold text-[#344054]">Date Range</p>
                <select
                  value={dateRange}
                  onChange={(event) => setDateRange(event.target.value as DateRange)}
                  className="h-11 w-full rounded-full border border-[#dfe3e8] bg-[#f6f7f9] px-4 text-sm text-[#344054]"
                >
                  {dateRanges.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold text-[#344054]">Export Format</p>
                <div className="flex gap-2">
                  {formatOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setFormat(item)}
                      className={`h-11 rounded-full border px-8 text-sm font-semibold ${
                        format === item
                          ? "border-[#d4af35] bg-[#fffaf0] text-[#8a6b0b]"
                          : "border-[#e4e7ec] bg-[#f8fafc] text-[#667085]"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="h-12 rounded-full bg-[#d4af35] px-8 text-base font-semibold text-[#101828] hover:bg-[#c39f2f]"
                onClick={() => {
                  void handleGenerate();
                }}
                disabled={isGenerating}
              >
                <Plus className="size-4" />
                {isGenerating ? "Generating..." : "Generate Report"}
              </Button>
            </div>
            {actionError ? <p className="text-sm text-rose-600">{actionError}</p> : null}
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] shadow-none">
          <div className="flex items-center justify-between border-b border-[#edf1f5] px-6 py-5">
            <h3 className="dashboard-section-title">Report History</h3>
            <button
              type="button"
              className="text-sm font-medium text-[#d4af35]"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isFetching}
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left">
              <thead className="bg-[#f5f6f8] text-xs font-semibold tracking-[0.06em] text-[#667085] uppercase">
                <tr>
                  <th className="px-4 py-4">Report Name</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Date Generated</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef1f4] bg-white">
                {(data?.history ?? []).map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4 text-base font-semibold text-[#101828]">
                      <span className="inline-flex items-center gap-2">
                        <FileText className="size-4 text-[#d4af35]" />
                        {row.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-[#475467]">{row.type}</td>
                    <td className="px-4 py-4 text-sm text-[#475467]">{formatDate(row.dateGenerated)}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3 text-[#98a2b3]">
                        <button type="button" onClick={() => onDownloadHistory(row)}>
                          <Download className="size-4" />
                        </button>
                        <button type="button" onClick={() => openReportPreview(row.id)}>
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            void removeReport(row.id);
                          }}
                          disabled={isDeleting}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(data?.history ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#667085]">
                      No reports yet. Generate your first report.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </article>
      </div>

      <aside className="space-y-6">
        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="size-5 text-[#d4af35]" />
            <h3 className="dashboard-section-title">Business Insights</h3>
          </div>
          <div className="space-y-3">
            {(data?.insights ?? []).map((insight) => (
              <div key={insight.title} className={`rounded-3xl border p-4 ${toneClass(insight.tone)}`}>
                <p className="text-base font-semibold text-[#1f2937]">{insight.title}</p>
                <p className="mt-1 text-sm text-[#667085]">{insight.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-surface border-[#e7e9ee] p-5 shadow-none">
          <h3 className="dashboard-section-title">Quick Data Export</h3>
          <div className="mt-4 space-y-3">
            {(data?.quickExports ?? []).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => exportShortcut(item)}
                className="flex w-full items-center justify-between rounded-full border border-[#e4e7ec] bg-[#f8fafc] px-4 py-3 text-left text-base font-medium text-[#344054]"
              >
                {item}
                <ChevronRight className="size-4 text-[#98a2b3]" />
              </button>
            ))}
          </div>
          <p className="mt-6 text-sm text-[#98a2b3]">
            Exports are typically processed within 5-10 minutes. You will receive an email once your data is ready.
          </p>
        </article>
      </aside>

      <Dialog open={openPreview} onOpenChange={setOpenPreview}>
        <DialogContent className="max-w-[520px] rounded-2xl border-[#e4e7ec]">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
          </DialogHeader>
          {selectedReport ? (
            <div className="space-y-3 text-sm text-[#475467]">
              <p>
                <strong className="text-[#101828]">Name:</strong> {selectedReport.name}
              </p>
              <p>
                <strong className="text-[#101828]">Type:</strong> {selectedReport.type}
              </p>
              <p>
                <strong className="text-[#101828]">Generated:</strong> {formatDate(selectedReport.dateGenerated)}
              </p>
              <p>
                <strong className="text-[#101828]">Status:</strong> {selectedReport.status}
              </p>
              <div className="pt-2">
                <Button
                  className="h-10 rounded-xl bg-[#d4af35] text-[#101828] hover:bg-[#c39f2f]"
                  onClick={() => onDownloadHistory(selectedReport)}
                >
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
