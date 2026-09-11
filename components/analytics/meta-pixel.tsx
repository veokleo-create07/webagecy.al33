"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const pixelId = "2047032015931800";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

function RoutePageViews({ ready }: { ready: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousLocation = useRef<string | null>(null);
  const search = searchParams.toString();

  useEffect(() => {
    if (!ready) return;

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
  }, [pathname, ready, search]);

  return null;
}

export function trackMetaLead() {
  window.fbq?.("track", "Lead");
}

export function MetaPixel() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive" onReady={() => setReady(true)}>
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
      <Suspense fallback={null}>
        <RoutePageViews ready={ready} />
      </Suspense>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
