import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter-tight",
});

export const metadata: Metadata = {
  title: "KREU WEB — Digital experiences with intent",
  description:
    "KREU WEB is an independent digital agency shaping distinctive websites for ambitious brands.",
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#111110",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={interTight.variable}>{children}</body>
    </html>
  );
}
