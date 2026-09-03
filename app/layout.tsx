import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { BookingProvider } from "@/components/booking/booking-provider";
import { LanguageProvider } from "@/components/language-provider";
import { cookies } from "next/headers";
import { languageCookie, translate } from "@/lib/localization";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-inter-tight",
});

export async function generateMetadata(): Promise<Metadata> {
  const language = (await cookies()).get(languageCookie)?.value === "en" ? "en" : "sq";
  return {
    title: translate(language, "KREU WEB — Built for progress"),
    description: translate(language, "We strengthen how your business is seen, trusted and chosen — so it can grow with more confidence."),
  };
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#111110",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const language = (await cookies()).get(languageCookie)?.value === "en" ? "en" : "sq";
  return (
    <html lang={language}>
      <body className={interTight.variable}><LanguageProvider initialLanguage={language}><BookingProvider>{children}</BookingProvider></LanguageProvider></body>
    </html>
  );
}
