export type CookieConsent = {
  version: 2;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export const COOKIE_CONSENT_KEY = "kasta-cookie-consent-v2";
export const COOKIE_CONSENT_EVENT = "kasta-cookie-consent-changed";
export const COOKIE_SETTINGS_EVENT = "kasta-cookie-settings-open";

const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;

function parseConsent(raw: string | null): CookieConsent | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed.version !== 2) return null;

    return {
      version: 2,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
      decidedAt: typeof parsed.decidedAt === "string" ? parsed.decidedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

function readConsentCookie() {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_CONSENT_KEY}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function writeConsentCookie(value: string) {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_CONSENT_KEY}=${encodeURIComponent(value)}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    const parsed = parseConsent(stored);
    if (parsed) return parsed;
  } catch {
    // Safari private mode and strict browsers may block storage.
  }

  return parseConsent(readConsentCookie());
}

export function saveCookieConsent(choice: Pick<CookieConsent, "analytics" | "marketing">) {
  const consent: CookieConsent = {
    version: 2,
    analytics: choice.analytics,
    marketing: choice.marketing,
    decidedAt: new Date().toISOString(),
  };
  const value = JSON.stringify(consent);

  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    // Fall back to a first-party cookie below.
  }

  writeConsentCookie(value);
  window.dispatchEvent(new CustomEvent<CookieConsent>(COOKIE_CONSENT_EVENT, { detail: consent }));
  return consent;
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
}

export function clearOptionalTrackingCookies() {
  if (typeof document === "undefined") return;

  const cookieNames = [
    "_ga",
    "_gid",
    "_gat",
    "_gat_gtag",
    "_fbp",
    "_fbc",
  ];
  const hostname = window.location.hostname;
  const domainParts = hostname.split(".");
  const domains = [
    undefined,
    hostname,
    domainParts.length > 2 ? `.${domainParts.slice(-2).join(".")}` : `.${hostname}`,
  ];

  cookieNames.forEach((name) => {
    domains.forEach((domain) => {
      const domainPart = domain ? `; domain=${domain}` : "";
      document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax${domainPart}`;
    });
  });
}
