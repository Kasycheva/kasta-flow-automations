import { useTranslation } from 'react-i18next';
import { Mail, MapPin, Clock } from 'lucide-react';

const serviceLinks = [
  { label: 'Simple Integrations', href: '#services' },
  { label: 'Vipps + Fiken', href: '#services' },
  { label: 'CRM Setup', href: '#services' },
  { label: 'FAQ Chatbot', href: '#services' },
  { label: 'Smart AI Agent', href: '#services' },
  { label: 'Landing Page', href: '#services' },
  { label: 'Monthly Support', href: '#support' },
];

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer className="bg-[hsl(0,0%,3%)] border-t border-border">
      {/* Gradient strip (replaces Spline) */}
      <div className="h-20 md:h-36 bg-gradient-to-b from-surface to-[hsl(0,0%,3%)]" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 100 100">
                <text x="50" y="70" textAnchor="middle" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="52" fill="hsl(0 0% 96%)">KF</text>
              </svg>
              <span className="text-[13px] text-muted-foreground tracking-[0.15em] uppercase">Kasta Flow Studio</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">{t('footer.tagline')}</p>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[13px] text-foreground uppercase tracking-[0.1em] mb-5">{t('footer.servicesHeading')}</h4>
            <ul className="space-y-2.5">
              {serviceLinks.map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[13px] text-foreground uppercase tracking-[0.1em] mb-5">{t('footer.companyHeading')}</h4>
            <ul className="space-y-2.5">
              <li><a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.howItWorks')}</a></li>
              <li><a href="#cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.caseStudies')}</a></li>
              <li><a href="#calculator" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.roiCalc')}</a></li>
              <li><a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a></li>
              <li><a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.freeAudit')}</a></li>
              <li><button className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.privacyPolicy')}</button></li>
              <li><button className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footer.terms')}</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[13px] text-foreground uppercase tracking-[0.1em] mb-5">{t('footer.contactHeading')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={14} /> <a href="mailto:kontakt@kastaflow.no" className="hover:text-foreground transition-colors">kontakt@kastaflow.no</a>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={14} /> {t('footer.location')}
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={14} /> {t('footer.responseTime')}
              </li>
            </ul>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[hsl(142,50%,8%)] border border-[hsl(142,50%,15%)] text-kasta-green text-xs">
              🟢 {t('footer.accepting')}
            </div>
          </div>
        </div>
      </div>

      {/* Legal strip */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">{t('footer.copyright')}</p>
          <div className="flex items-center gap-1 text-xs">
            <button onClick={() => i18n.changeLanguage('en')}
              className={`px-2 py-1 ${i18n.language === 'en' ? 'text-foreground' : 'text-muted-foreground'}`}>EN</button>
            <span className="text-muted-foreground">·</span>
            <button onClick={() => i18n.changeLanguage('no')}
              className={`px-2 py-1 ${i18n.language === 'no' ? 'text-foreground' : 'text-muted-foreground'}`}>NO</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
