import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

interface SeoProps {
  title?: string;
  description?: string;
  noIndex?: boolean;
}

export default function Seo({ title, description, noIndex = false }: SeoProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language === "no" ? "no" : "en";

  const metaTitle =
    title ??
    t("meta.title", {
      defaultValue: "Kasta Flow Studio | Intelligent Business Automation for Norway",
    });
  const metaDescription =
    description ??
    t("meta.description", {
      defaultValue:
        "Kasta Flow Studio designs intelligent automations, AI agents, and integrations for small and medium businesses in Norway.",
    });
  const siteName = t("meta.siteName", { defaultValue: "Kasta Flow Studio" });
  const imageUrl =
    typeof window !== "undefined"
      ? new URL("/og-image.svg?v=20260424", window.location.origin).toString()
      : "/og-image.svg?v=20260424";
  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "/";
  const canonicalUrl =
    currentLanguage === "no" ? "https://kastaflow.com/no" : "https://kastaflow.com/en";

  return (
    <Helmet>
      <html lang={currentLanguage} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="author" content={siteName} />
      <meta name="theme-color" content="#0A0A0A" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      {import.meta.env.VITE_GOOGLE_SITE_VERIFICATION && (
        <meta name="google-site-verification" content={import.meta.env.VITE_GOOGLE_SITE_VERIFICATION} />
      )}

      <link rel="icon" href="/favicon.svg?v=20260424" type="image/svg+xml" sizes="any" />
      <link rel="shortcut icon" href="/favicon.svg?v=20260424" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.svg?v=20260424" />
      <link rel="manifest" href="/site.webmanifest?v=20260424" />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="en" href="https://kastaflow.com/en" />
      <link rel="alternate" hrefLang="no" href="https://kastaflow.com/no" />
      <link rel="alternate" hrefLang="x-default" href="https://kastaflow.com/en" />

      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={currentLanguage === "no" ? "nb_NO" : "en_US"} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={imageUrl} />
    </Helmet>
  );
}
