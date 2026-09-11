import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import Script from "next/script";
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
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2047032015931800');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2047032015931800&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <LanguageProvider initialLanguage={language}>
          <BookingProvider>{children}</BookingProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
