const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function stripTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

// URL helpers keep local, preview, and production API endpoints in a consistent format.
export function normalizeHttpUrl(value?: string | null): string | null {
  const candidate = value?.trim();
  if (!candidate) {
    return null;
  }

  try {
    const parsed = new URL(candidate);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return stripTrailingSlashes(parsed.toString());
  } catch {
    return null;
  }
}

export function normalizeApiBaseUrl(value?: string | null): string {
  const candidate = value?.trim();
  if (!candidate) {
    return "/api";
  }

  if (candidate.startsWith("/")) {
    const normalized = stripTrailingSlashes(candidate);
    return normalized.length > 0 ? normalized : "/api";
  }

  return normalizeHttpUrl(candidate) ?? "/api";
}

export function isLocalHostname(value?: string | null): boolean {
  if (!value) {
    return false;
  }

  return LOCAL_HOSTNAMES.has(value);
}
