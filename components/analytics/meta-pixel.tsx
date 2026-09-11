"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const pixelId = "2047032015931800";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

function RoutePageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousLocation = useRef<string | null>(null);
  const search = searchParams.toString();

  useEffect(() => {
    const location = search ? `${pathname}?${search}` : pathname;

    if (previousLocation.current === null) {
      // The base snippet already records the first page view.
      previousLocation.current = location;
      return;
    }

    if (previousLocation.current !== location) {
      window.fbq?.("track", "PageView");
      previousLocation.current = location;
    }
  }, [pathname, search]);

  return null;
}

export function trackMetaLead() {
  window.fbq?.("track", "Lead");
}

export function MetaPixelScript() {
  return (
    <Script id="meta-pixel" strategy="beforeInteractive">
      {`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `}
    </Script>
  );
}

export function MetaPixelRouteTracker() {
  return (
    <Suspense fallback={null}>
      <RoutePageViews />
    </Suspense>
  );
}

export function MetaPixelNoScript() {
  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
