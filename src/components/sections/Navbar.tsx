import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import KFLogo from '../ui/KFLogo';

/* ── Assembly logo: 4 fragments fly in from corners, then settle into glow.
   To revert entirely: remove this component and use plain
   <KFLogo size={36} className="text-foreground animate-logo-glow" /> in the button. */
const FRAGMENTS = [
  { clip: 'inset(0 50% 50% 0)',  x: -14, y: -14, delay: 0    },
  { clip: 'inset(0 0 50% 50%)',  x:  14, y: -14, delay: 0.08 },
  { clip: 'inset(50% 50% 0 0)',  x: -14, y:  14, delay: 0.14 },
  { clip: 'inset(50% 0 0 50%)',  x:  14, y:  14, delay: 0.20 },
] as const;

function AssemblyLogo({ size = 36 }: { size?: number }) {
  const [done, setDone] = useState(false);

  if (done) {
    return <KFLogo size={size} className="text-foreground animate-logo-glow" />;
  }

  return (
    <div style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      {FRAGMENTS.map((f, i) => (
        <motion.div
          key={i}
          style={{ position: 'absolute', inset: 0, clipPath: f.clip }}
          initial={{ x: f.x, y: f.y, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 1 }}
          transition={{ duration: 0.48, delay: f.delay, ease: [0.34, 1.56, 0.64, 1] }}
          onAnimationComplete={i === FRAGMENTS.length - 1 ? () => setDone(true) : undefined}
        >
          <KFLogo size={size} className="text-foreground" />
        </motion.div>
      ))}
    </div>
  );
}

const navLinks = [
  { key: 'services', href: '#services' },
  { key: 'calculator', href: '#calculator' },
  { key: 'support', href: '#support' },
  { key: 'cases', href: '#cases' },
  { key: 'faq', href: '#faq' },
  { key: 'contact', href: '#contact' },
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={scrollToTop} className="flex items-center gap-3">
            <AssemblyLogo size={36} />
            <span className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.22em] text-foreground leading-tight">
              Kasta Flow<br />Studio
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.key}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 text-sm">
              <button
                onClick={() => switchLang('en')}
                className={`px-2 py-1 transition-colors ${i18n.language === 'en' ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                EN
              </button>
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => switchLang('no')}
                className={`px-2 py-1 transition-colors ${i18n.language === 'no' ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                NO
              </button>
            </div>
            <a href="#contact" className="hidden md:inline-flex btn-primary text-sm">
              {t('nav.cta')}
            </a>
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[60] bg-background flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-foreground"
            >
              <X size={28} />
            </button>
            {navLinks.map(link => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-heading font-bold text-foreground"
              >
                {t(`nav.${link.key}`)}
              </a>
            ))}
            <div className="flex items-center gap-3 text-lg">
              <button
                onClick={() => switchLang('en')}
                className={i18n.language === 'en' ? 'text-foreground' : 'text-muted-foreground'}
              >
                EN
              </button>
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => switchLang('no')}
                className={i18n.language === 'no' ? 'text-foreground' : 'text-muted-foreground'}
              >
                NO
              </button>
            </div>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="btn-primary text-lg"
            >
              {t('nav.cta')}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
