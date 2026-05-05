type AnalyticsEventName =
  | "cta_click"
  | "contact_form_start"
  | "contact_form_submit"
  | "language_switch"
  | "chat_open"
  | "calculator_interaction";

type AnalyticsParamKey =
  | "cta_type"
  | "cta_location"
  | "cta_id"
  | "target"
  | "form_type"
  | "from_language"
  | "to_language"
  | "open_source"
  | "calculator_control"
  | "page_path"
  | "language";

type AnalyticsParams = Partial<Record<AnalyticsParamKey, string>>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: AnalyticsEventName, params: AnalyticsParams = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    page_path: `${window.location.pathname}${window.location.search}`,
    language: document.documentElement.lang || undefined,
    ...params,
  });
}
