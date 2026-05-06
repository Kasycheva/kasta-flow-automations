import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import TrackingScripts from "./components/widgets/TrackingScripts";
import CookieBanner from "./components/widgets/CookieBanner";

const LegalPage = lazy(() => import("./pages/LegalPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

type SupportedLanguage = "en" | "no";

function LanguageRoute({ language }: { language: SupportedLanguage }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    localStorage.setItem("kasta-language", language);
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  return <Index />;
}

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <TrackingScripts />
        <Routes>
          <Route path="/" element={<LanguageRoute language="en" />} />
          <Route path="/en" element={<LanguageRoute language="en" />} />
          <Route path="/no" element={<LanguageRoute language="no" />} />
          <Route path="/privacy" element={<Suspense fallback={null}><LegalPage kind="privacy" /></Suspense>} />
          <Route path="/cookies" element={<Suspense fallback={null}><LegalPage kind="cookies" /></Suspense>} />
          <Route path="/terms" element={<Suspense fallback={null}><LegalPage kind="terms" /></Suspense>} />
          <Route path="*" element={<Suspense fallback={null}><NotFound /></Suspense>} />
        </Routes>
      </BrowserRouter>
      <CookieBanner />
    </TooltipProvider>
  </HelmetProvider>
);

export default App;
