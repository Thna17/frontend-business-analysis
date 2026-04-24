import type { NextConfig } from "next";

const backendOrigin = process.env.BACKEND_ORIGIN || "http://localhost:4000";

const nextConfig: NextConfig = {
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
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendOrigin}/api/v1/:path*`,
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
