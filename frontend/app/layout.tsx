import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AppShell } from "@/components/app-shell";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pensive.ai - Smart Expense Manager",
  description:
    "Full-stack expense management with CRUD operations, interactive dashboards, and AI-powered stock investment advisor. Built by Abhay Bisht.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        <Providers>
          <AppShell>{children}</AppShell>
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
