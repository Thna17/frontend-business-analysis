export type TelegramMessageType = "sale" | "expense" | "voice" | "file";

export type TelegramMediaKind = "voice" | "document" | "audio" | "video" | "photo" | "";

export interface TelegramRecordItem {
  id: string;
  messageType: TelegramMessageType;
  type: "sale" | "expense" | null;
  amount: number | null;
  item: string;
  source: string;
  chatId: string;
  username: string;
  fullName: string;
  caption: string;
  telegramMessageId: string;
  file: {
    fileId: string;
    fileUniqueId: string;
    fileName: string;
    mimeType: string;
    fileSize: number | null;
    durationSeconds: number | null;
    mediaKind: TelegramMediaKind;
  };
  createdAt: string | null;
  updatedAt: string | null;
}

export interface TelegramRecordsResponse {
  data: TelegramRecordItem[];
  meta: {
    count: number;
    total: number;
    page: number;
    limit: number;
    hasNextPage: boolean;
  };
}

export interface TelegramRecordsSummary {
  total: number;
  sale: number;
  expense: number;
  voice: number;
  file: number;
}
