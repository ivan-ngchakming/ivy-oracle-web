import "@fortawesome/fontawesome-free/css/all.min.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import Script from "next/script";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";
import * as gtag from "../lib/gtm";
import { Web3Provider } from "../lib/providers";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const handleRouteChangeStart = (url: string) => {
    // toast.info(`Loading...`, { toastId: `load-${url}` });
    NProgress.start();
    gtag.pageview(url);
  };

  const handleRouteChangeComplete = (url: string) => {
    // toast.dismiss(`load-${url}`);
    NProgress.done();
  };

  const handleRouteChangeError = (url: string) => {
    toast.error(`Failed to load page ${url}, please try again later.`, {
      toastId: `load-${url}-error`,
    });
  };

  useEffect(() => {
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}

      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_ID}');
        `}
      </Script>

      <Web3Provider>
        <Component {...pageProps} />
        <ToastContainer
          hideProgressBar={true}
          theme="dark"
          position={toast.POSITION.TOP_CENTER}
        />
      </Web3Provider>
    </>
  );
}

export default MyApp;
