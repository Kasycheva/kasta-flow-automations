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

type ConsentModeValue = "granted" | "denied";

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function updateGoogleTagConsent(consent: CookieConsent) {
  const analyticsStorage: ConsentModeValue = consent.analytics ? "granted" : "denied";
  const marketingStorage: ConsentModeValue = consent.marketing ? "granted" : "denied";

  window.gtag?.("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: marketingStorage,
    ad_user_data: marketingStorage,
    ad_personalization: marketingStorage,
  });
}

function sendGoogleAnalyticsPageView(measurementId: string) {
  if (!measurementId || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: `${window.location.pathname}${window.location.search}`,
  });
}

let gaConfigured = false;

function initGoogleAnalytics(measurementId: string) {
  if (!measurementId || gaConfigured || !window.gtag) return;

  gaConfigured = true;
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });
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

  updateGoogleTagConsent(consent);

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
