export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
}

export type UnknownRecord = Record<string, unknown>;
