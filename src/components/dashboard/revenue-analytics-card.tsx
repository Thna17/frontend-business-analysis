import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RevenueAnalyticsCard() {
  return (
    <Card className="dashboard-surface border-[#e7e9ee] shadow-none">
      <CardHeader className="flex flex-row items-start justify-between px-7 pt-7 pb-0">
        <div>
          <CardTitle className="dashboard-section-title">
            Revenue Analytics
          </CardTitle>
          <p className="mt-1 text-[15px] text-[#667085]">Monthly revenue trends for the current year</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-xl border border-[#eaecf0] bg-[#f7f8fa] px-4 py-2 text-[15px] text-[#344054]"
        >
          Last 6 months
          <ChevronDown className="size-4" />
        </button>
      </CardHeader>

      <CardContent className="px-6 pb-7">
        <div className="mt-7 h-[350px]">
          <svg viewBox="0 0 1000 350" className="h-full w-full">
            <defs>
              <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d4af35" stopOpacity="0.20" />
                <stop offset="100%" stopColor="#d4af35" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            <line x1="0" y1="82" x2="1000" y2="82" stroke="#edf0f5" strokeDasharray="6 6" />
            <line x1="0" y1="162" x2="1000" y2="162" stroke="#edf0f5" strokeDasharray="6 6" />
            <line x1="0" y1="242" x2="1000" y2="242" stroke="#edf0f5" strokeDasharray="6 6" />

            <path
              d="M0,288 C74,250 120,260 170,278 C220,296 255,244 320,154 C375,74 436,98 500,162 C562,224 634,192 706,135 C792,68 862,54 932,24 L932,318 L0,318 Z"
              fill="url(#rev-gradient)"
            />
            <path
              d="M0,288 C74,250 120,260 170,278 C220,296 255,244 320,154 C375,74 436,98 500,162 C562,224 634,192 706,135 C792,68 862,54 932,24"
              fill="none"
              stroke="#cba52b"
              strokeWidth="4"
              strokeLinecap="round"
            />

            <g fill="#98a2b3" fontSize="18">
              <text x="12" y="340">Jan</text>
              <text x="198" y="340">Feb</text>
              <text x="382" y="340">Mar</text>
              <text x="568" y="340">Apr</text>
              <text x="753" y="340">May</text>
              <text x="934" y="340">Jun</text>
            </g>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
