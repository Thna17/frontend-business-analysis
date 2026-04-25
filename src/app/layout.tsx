import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";
import { PwaServiceWorker } from "@/components/pwa/pwa-service-worker";
import { normalizeHttpUrl } from "@/lib/url-config";

function resolveMetadataBase(): URL | undefined {
  const normalized = normalizeHttpUrl(process.env.NEXT_PUBLIC_APP_URL);
  if (normalized) {
    return new URL(normalized);
  }

  if (process.env.NODE_ENV === "production") {
    return undefined;
  }

  return new URL("http://localhost:3000");
}

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  applicationName: "Syntrix",
  title: {
    default: "Syntrix Business Analytics",
    template: "%s | Syntrix",
  },
  description:
    "Web-based analytics platform for small business owners to track sales, revenue, and subscriptions.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Syntrix",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ReduxProvider>
          <AuthBootstrap />
          <PwaServiceWorker />
          {children}
          <Toaster richColors position="top-right" />
        </ReduxProvider>
      </body>
    </html>
  );
}
