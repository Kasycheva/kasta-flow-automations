import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  COOKIE_CONSENT_EVENT,
  CookieConsent,
  clearOptionalTrackingCookies,
  getCookieConsent,
} from "../../lib/cookieConsent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    _fbq?: unknown;
  }
}

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function sendGoogleAnalyticsPageView(measurementId: string) {
  if (!measurementId || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
  });
}

function initGoogleAnalytics(measurementId: string) {
  if (!measurementId) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag =
    window.gtag ??
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };

  if (!document.getElementById("kasta-ga-loader")) {
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: false,
    });

    loadScript("kasta-ga-loader", `https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
  }
}

function initMetaPixel(pixelId: string) {
  if (!pixelId || document.getElementById("kasta-meta-pixel-loader")) return;

  const fbq = function fbq(...args: unknown[]) {
    const queue = (window.fbq as unknown as { queue?: unknown[] })?.queue;
    if (queue) queue.push(args);
  };

  window.fbq = window.fbq ?? fbq;
  window._fbq = window.fbq;
  window.fbq("init", pixelId);
  window.fbq("track", "PageView");

  loadScript("kasta-meta-pixel-loader", "https://connect.facebook.net/en_US/fbevents.js");
}

function applyConsent(consent: CookieConsent | null) {
  if (!consent) return;

  if (consent.analytics) {
    const measurementId = import.meta.env.VITE_GA4_ID ?? "";
    initGoogleAnalytics(measurementId);
    sendGoogleAnalyticsPageView(measurementId);
  }

  if (consent.marketing) {
    initMetaPixel(import.meta.env.VITE_META_PIXEL_ID ?? "");
  }

  if (!consent.analytics && !consent.marketing) {
    clearOptionalTrackingCookies();
  }
}

export default function TrackingScripts() {
  const location = useLocation();

  useEffect(() => {
    applyConsent(getCookieConsent());

    const onConsentChange = (event: Event) => {
      applyConsent((event as CustomEvent<CookieConsent>).detail);
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, onConsentChange);
  }, [location.pathname, location.search]);

  return null;
}
