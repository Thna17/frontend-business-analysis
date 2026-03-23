const ATTRIBUTION_KEY = "phka_attribution";

export interface AttributionPayload {
  campaignSlug?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
}

type StoredAttribution = AttributionPayload & {
  firstSeenAt?: string;
  lastSeenAt?: string;
};

function safeParse(json: string | null): StoredAttribution | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as StoredAttribution;
  } catch {
    return null;
  }
}

export function getStoredAttribution(): StoredAttribution | null {
  if (typeof window === "undefined") return null;
  return safeParse(window.localStorage.getItem(ATTRIBUTION_KEY));
}

export function saveAttribution(payload: AttributionPayload): void {
  if (typeof window === "undefined") return;
  const now = new Date().toISOString();
  const current = getStoredAttribution();
  const merged: StoredAttribution = {
    ...current,
    ...payload,
    firstSeenAt: current?.firstSeenAt || now,
    lastSeenAt: now,
  };
  window.localStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(merged));
}

export function captureAttributionFromLocation(pathname: string, search: string): void {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(search);

  const campaignSlug = pathname.startsWith("/campaign/")
    ? pathname.split("/campaign/")[1]?.split("/")[0]
    : undefined;

  const payload: AttributionPayload = {
    campaignSlug,
    utmSource: params.get("utm_source") || undefined,
    utmMedium: params.get("utm_medium") || undefined,
    utmCampaign: params.get("utm_campaign") || undefined,
    utmContent: params.get("utm_content") || undefined,
    utmTerm: params.get("utm_term") || undefined,
  };

  const hasAny = Object.values(payload).some(Boolean);
  if (hasAny) saveAttribution(payload);
}

export function getCheckoutAttribution(): AttributionPayload {
  const stored = getStoredAttribution();
  if (!stored) return {};
  return {
    campaignSlug: stored.campaignSlug,
    utmSource: stored.utmSource,
    utmMedium: stored.utmMedium,
    utmCampaign: stored.utmCampaign,
    utmContent: stored.utmContent,
    utmTerm: stored.utmTerm,
  };
}

