import { useEffect } from "react";
import { useRouter } from "next/router";
import Script from "next/script";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Layout } from "@/components/layout";

const GA_TRACKING_ID = "G-CDN077ZVNM";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const handleRouteChange = (url: string) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <Layout>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
