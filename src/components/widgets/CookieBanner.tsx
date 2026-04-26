import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  COOKIE_SETTINGS_EVENT,
  clearOptionalTrackingCookies,
  getCookieConsent,
  saveCookieConsent,
} from "../../lib/cookieConsent";

export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent) {
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
      setVisible(false);
    } else {
      setVisible(true);
    }

    const openSettings = () => {
      const latest = getCookieConsent();
      setAnalytics(latest?.analytics ?? false);
      setMarketing(latest?.marketing ?? false);
      setCustomize(true);
      setVisible(true);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, openSettings);
  }, []);

  const saveChoice = (choice: { analytics: boolean; marketing: boolean }) => {
    saveCookieConsent(choice);
    if (!choice.analytics && !choice.marketing) clearOptionalTrackingCookies();
    setVisible(false);
    setCustomize(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[9998] border-t border-border bg-surface px-4 py-4 shadow-[0_-18px_60px_rgba(0,0,0,0.45)] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm font-semibold text-foreground">{t("cookie.title")}</p>
            <p className="text-sm leading-6 text-muted-foreground">{t("cookie.text")}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              <a href="/cookies" className="text-foreground underline underline-offset-4 hover:text-muted-foreground">
                {t("cookie.cookiePolicy")}
              </a>
              <a href="/privacy" className="text-foreground underline underline-offset-4 hover:text-muted-foreground">
                {t("cookie.privacyPolicy")}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <button onClick={() => saveChoice({ analytics: true, marketing: true })} className="btn-primary text-xs">
              {t("cookie.acceptAll")}
            </button>
            <button onClick={() => saveChoice({ analytics: false, marketing: false })} className="btn-outline text-xs">
              {t("cookie.rejectOptional")}
            </button>
            <button onClick={() => setCustomize((value) => !value)} className="btn-outline text-xs">
              {t("cookie.customize")}
            </button>
          </div>
        </div>

        {customize && (
          <div className="mt-5 grid gap-3 border-t border-border pt-4 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-background/35 p-4">
              <p className="mb-1 text-sm font-medium text-foreground">{t("cookie.necessaryTitle")}</p>
              <p className="text-xs leading-5 text-muted-foreground">{t("cookie.necessaryDesc")}</p>
              <p className="mt-3 text-xs text-muted-foreground">{t("cookie.alwaysOn")}</p>
            </div>

            <label className="rounded-lg border border-border bg-background/35 p-4">
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="mb-1 block text-sm font-medium text-foreground">{t("cookie.analyticsTitle")}</span>
                  <span className="block text-xs leading-5 text-muted-foreground">{t("cookie.analyticsDesc")}</span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-accent"
                />
              </span>
            </label>

            <label className="rounded-lg border border-border bg-background/35 p-4">
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="mb-1 block text-sm font-medium text-foreground">{t("cookie.marketingTitle")}</span>
                  <span className="block text-xs leading-5 text-muted-foreground">{t("cookie.marketingDesc")}</span>
                </span>
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-accent"
                />
              </span>
            </label>

            <div className="md:col-span-3">
              <button
                onClick={() => saveChoice({ analytics, marketing })}
                className="w-full rounded-lg bg-foreground px-4 py-3 text-xs font-medium text-background transition-opacity hover:opacity-90 sm:w-auto"
              >
                {t("cookie.saveChoices")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
