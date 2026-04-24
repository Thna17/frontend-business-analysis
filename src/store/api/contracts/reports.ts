export interface ReportsDashboardResponse {
  generator: {
    reportTypes: Array<"Sales" | "Revenue" | "Product" | "Customer">;
    categories: string[];
    dateRanges: Array<"Last 7 Days" | "Last 30 Days" | "This Quarter" | "This Year">;
    exportFormats: Array<"PDF" | "CSV" | "Excel">;
  };
  insights: Array<{
    title: string;
    description: string;
    tone: "amber" | "slate";
  }>;
  quickExports: string[];
  history: Array<{
    id: string;
    name: string;
    type: "Sales" | "Revenue" | "Product" | "Customer";
    status: "READY" | "PROCESSING";
    dateGenerated: string;
    format: "PDF" | "CSV" | "Excel";
  }>;
  summary: {
    generatedReports: number;
    currentRevenue: number;
    previousRevenue: number;
    productDownloads: number;
    churnDownPercentage: number;
    businessName: string;
  };
}

export interface GenerateReportRequest {
  reportType: "Sales" | "Revenue" | "Product" | "Customer";
  categoryFilter: string;
  dateRange: "Last 7 Days" | "Last 30 Days" | "This Quarter" | "This Year";
  exportFormat: "PDF" | "CSV" | "Excel";
}
