import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Seo from "../components/Seo";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <Seo
        title={t("notFound.metaTitle")}
        description={t("notFound.metaDescription")}
        noIndex
      />
      <div className="text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Kasta Flow Studio
        </p>
        <h1 className="mb-4 text-5xl font-heading font-bold text-foreground">404</h1>
        <p className="mb-6 text-lg text-muted-foreground">{t("notFound.title")}</p>
        <a href="/" className="btn-outline">
          {t("notFound.cta")}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
