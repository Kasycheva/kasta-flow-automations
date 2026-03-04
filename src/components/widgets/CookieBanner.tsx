import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function CookieBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const accept = (choice: 'all' | 'essential') => {
    localStorage.setItem('cookie-consent', choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] bg-surface border-t border-border px-6 md:px-8 py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">{t('cookie.text')}</p>
        <div className="flex gap-3">
          <button onClick={() => accept('all')} className="btn-primary text-xs py-2 px-4">{t('cookie.acceptAll')}</button>
          <button onClick={() => accept('essential')} className="btn-outline text-xs py-2 px-4">{t('cookie.essentialOnly')}</button>
        </div>
      </div>
    </div>
  );
}
