import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Business Analytics SaaS",
  description:
    "Web-based analytics platform for small business owners to track sales, revenue, and subscriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
