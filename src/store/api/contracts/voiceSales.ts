export type VoiceSaleJobStatus =
  | "pending"
  | "transcribed"
  | "extracted"
  | "reviewed"
  | "failed";

export type VoiceSaleSourceType = "telegram" | "web_upload";

export interface VoiceSaleDraftEntry {
  productName: string;
  category: string;
  quantity: number;
  price: number;
  soldAt: string;
  confidence: number;
  notes: string | null;
}

export interface VoiceSaleJob {
  id: string;
  ownerUserId: string;
  businessId: string;
  sourceType: VoiceSaleSourceType;
  sourceRef: Record<string, unknown> | null;
  transcriptText: string | null;
  status: VoiceSaleJobStatus;
  draftEntries: VoiceSaleDraftEntry[];
  failureReason: string | null;
  reviewedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface VoiceSaleJobListMeta {
  count: number;
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface VoiceSaleJobListResponse {
  items: VoiceSaleJob[];
  meta: VoiceSaleJobListMeta;
}

export interface VoiceSaleJobListQuery {
  status?: VoiceSaleJobStatus;
  sourceType?: VoiceSaleSourceType;
  page?: number;
  limit?: number;
}

export interface VoiceSaleJobConfirmPayload {
  entries: Array<{
    productName: string;
    category: string;
    quantity: number;
    price: number;
    soldAt: string;
    confidence?: number;
    notes?: string | null;
  }>;
}

export interface VoiceSaleProductSyncSummary {
  created: number;
  unchanged: number;
  suggestionCreated: number;
  suggestionExists: number;
}

export interface VoiceSaleConfirmResponse {
  job: VoiceSaleJob;
  createdCount: number;
  productSync?: VoiceSaleProductSyncSummary;
}
