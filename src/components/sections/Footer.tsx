import { useEffect, useRef, useState } from 'react';
import { Check, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import KFLogo from '../ui/KFLogo';

const serviceLinks = [
  { key: 'automationSystems', href: '#services' },
  { key: 'crmLeadFlow', href: '#services' },
  { key: 'aiAssistants', href: '#services' },
  { key: 'paymentAutomation', href: '#services' },
  { key: 'customWorkflows', href: '#services' },
];

const exploreLinks = [
  { key: 'howItWorks', href: '#faq' },
  { key: 'caseStudies', href: '#cases' },
  { key: 'faq', href: '#faq' },
  { key: 'contact', href: '#contact' },
];

const supportNotes = ['asyncFirst', 'responseTime'];

const socialLinks = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/profile.php?id=61573183250223&locale=ru_RU',
    Icon: Facebook,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/maria-kasta-flow/',
    Icon: Linkedin,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/',
    Icon: Instagram,
  },
];

export default function Footer() {
  const { t } = useTranslation();
  const statement = t('footer.statement');
  const footerRef = useRef<HTMLElement>(null);
  const [typedStatement, setTypedStatement] = useState('');
  const [statementMode, setStatementMode] = useState<'typing' | 'shine'>('typing');
  const [shouldAnimateStatement, setShouldAnimateStatement] = useState(false);

  useEffect(() => {
    let frameId: number | undefined;

    const checkFooterVisibility = () => {
      const footer = footerRef.current;
      if (!footer) return;

      const rect = footer.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.82 && rect.bottom > 0;

      if (isVisible) {
        setShouldAnimateStatement(true);
        window.removeEventListener('scroll', scheduleCheck);
        window.removeEventListener('resize', scheduleCheck);
      }
    };

    const scheduleCheck = () => {
      if (frameId) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = undefined;
        checkFooterVisibility();
      });
    };

    scheduleCheck();
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', scheduleCheck);

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', scheduleCheck);
      window.removeEventListener('resize', scheduleCheck);
    };
  }, []);

  useEffect(() => {
    if (!shouldAnimateStatement) return;

    let index = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (index >= statement.length) {
        setTypedStatement(statement);
        setStatementMode('shine');
        return;
      }

      const nextIndex = index + 1;
      setTypedStatement(statement.slice(0, nextIndex));
      index = nextIndex;
      timeoutId = setTimeout(tick, 68);
    };

    setStatementMode('typing');
    setTypedStatement('');
    timeoutId = setTimeout(tick, 350);
    return () => clearTimeout(timeoutId);
  }, [statement, shouldAnimateStatement]);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-[hsl(0,0%,3%)] border-t border-white/10">
      <div className="footer-grid-mask absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="footer-flow-line footer-flow-line-a" aria-hidden="true" />
      <div className="footer-flow-line footer-flow-line-b" aria-hidden="true" />
      <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-white/[0.055] blur-[120px]" aria-hidden="true" />
      <div className="absolute left-12 bottom-16 h-44 w-44 rounded-full bg-white/[0.035] blur-[90px]" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-14 md:pt-20 pb-5 md:pb-6">
        <div className="grid min-h-[390px] items-start gap-12 mb-10 md:mb-14 lg:grid-cols-[1.15fr_0.8fr_0.7fr_0.95fr] lg:gap-10 xl:gap-16">
          <div className="max-w-md mx-auto lg:mx-0 text-center lg:text-left">
            <a href="#" className="group inline-flex items-center gap-3 mb-7 mx-auto lg:mx-0" aria-label="Kasta Flow Studio">
              {/* Brand monogram — to revert: replace KFLogo with the original 3-span block */}
              <span className="relative flex h-11 w-11 items-center justify-center rounded-sm border border-white/15 bg-white/[0.035]">
                <span className="absolute inset-1 border border-white/[0.06]" />
                <KFLogo size={28} className="text-foreground" />
              </span>
              <span className="text-[12px] font-medium uppercase tracking-[0.24em] text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
                Kasta Flow Studio
              </span>
            </a>

            <h2 className="footer-statement text-3xl md:text-[2.45rem] font-semibold leading-tight" aria-label={statement}>
              <span className="footer-statement-ghost" aria-hidden="true">{statement}</span>
              <span className={statementMode === 'shine' ? 'footer-shine-text' : undefined}>
                {typedStatement}
              </span>
            </h2>
            <p className="mt-5 max-w-sm text-sm md:text-base leading-7 text-muted-foreground">
              {t('footer.supporting')}
            </p>
          </div>

          <nav aria-label={t('footer.servicesHeading')} className="lg:pt-24 text-center lg:text-left">
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground">
              {t('footer.servicesHeading')}
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.key}>
                  <a className="footer-link" href={link.href}>
                    {t(`footer.services.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t('footer.exploreHeading')} className="lg:pt-24 text-center lg:text-left">
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground">
              {t('footer.exploreHeading')}
            </h3>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.key}>
                  <a className="footer-link" href={link.href}>
                    {t(`footer.explore.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:pt-24 text-center lg:text-left">
            <h3 className="mb-5 text-[12px] font-semibold uppercase tracking-[0.18em] text-foreground">
              {t('footer.socialHeading')}
            </h3>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.035] text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10 hover:text-foreground"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>

            <ul className="mt-6 space-y-2.5">
              {supportNotes.map((note) => (
                <li key={note} className="flex items-center gap-2 text-sm text-muted-foreground justify-center lg:justify-start">
                  <Check size={14} className="text-foreground/80" />
                  <span>{t(`footer.notes.${note}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 flex flex-col gap-2 text-xs leading-none text-muted-foreground items-center sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:pr-32">
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
            <p>{t('footer.copyright')}</p>
            <p>
              {t('footer.madePrefix')}{' '}
              <span className="footer-heart" aria-hidden="true">♥</span>
              <span className="sr-only">{t('footer.heartLabel')}</span>{' '}
              {t('footer.madeSuffix')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="transition-colors duration-200 hover:text-foreground">{t('footer.privacyPolicy')}</button>
            <span className="text-white/25">·</span>
            <button className="transition-colors duration-200 hover:text-foreground">{t('footer.terms')}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
