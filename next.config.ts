import type { NextConfig } from "next";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

function normalizeAbsoluteHttpUrl(value?: string): URL | null {
  const candidate = value?.trim();
  if (!candidate) {
    return null;
  }

  try {
    const parsed = new URL(candidate);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    parsed.pathname = parsed.pathname.replace(/\/+$/, "") || "/";
    return parsed;
  } catch {
    return null;
  }
}

function resolveBackendOrigin(): string | null {
  const normalized = normalizeAbsoluteHttpUrl(process.env.BACKEND_ORIGIN);
  if (normalized) {
    if (
      process.env.NODE_ENV === "production" &&
      LOCAL_HOSTNAMES.has(normalized.hostname)
    ) {
      return null;
    }

    return normalized.toString().replace(/\/+$/, "");
  }

  return process.env.NODE_ENV === "production" ? null : "http://localhost:4000";
}

const backendOrigin = resolveBackendOrigin();

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bakong-deeplink.nbc.gov.kh",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    if (!backendOrigin) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendOrigin}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/auth/login",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/auth/signup",
        destination: "/signup",
        permanent: true,
      },
      {
        source: "/auth/verify-email",
        destination: "/verify-email",
        permanent: true,
      },
      {
        source: "/auth/forgot-password",
        destination: "/forgot-password",
        permanent: true,
      },
      {
        source: "/auth/reset-password",
        destination: "/reset-password",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
