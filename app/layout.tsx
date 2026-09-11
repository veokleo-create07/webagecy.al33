import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import { MetaPixel } from "@/components/analytics/meta-pixel";
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
  const title = translate(language, "Kreu Web — Strategy, Design & Digital Development");
  const description = translate(language, "Kreu Web helps ambitious businesses build credible brands, high-performing websites, effective marketing and scalable digital products.");
  return {
    metadataBase: new URL("https://www.kreuweb.com"),
    title,
    description,
    applicationName: "Kreu Web",
    alternates: { canonical: "/" },
    icons: {
      icon: [{ url: "/brand/kreu-chrome-mark.png", type: "image/png", sizes: "500x500" }],
      apple: [{ url: "/brand/kreu-chrome-mark.png", type: "image/png", sizes: "500x500" }],
    },
    openGraph: {
      type: "website",
      url: "/",
      siteName: "Kreu Web",
      title,
      description,
      locale: language === "sq" ? "sq_AL" : "en_US",
    },
    twitter: { card: "summary", title, description },
    robots: { index: true, follow: true },
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
      <body className={interTight.variable}>
        <MetaPixel />
        <LanguageProvider initialLanguage={language}>
          <BookingProvider>{children}</BookingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
