import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/provider";
import { AuthBootstrap } from "@/components/auth/auth-bootstrap";

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smart Business Analytics SaaS",
  description:
    "Web-based analytics platform for small business owners to track sales, revenue, and subscriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${spaceGrotesk.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        <ReduxProvider>
          <AuthBootstrap />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
