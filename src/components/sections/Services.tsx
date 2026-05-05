import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft, GitBranch, Zap, Filter,
  MessageSquare, Brain, Monitor, Calendar, Bell,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import SectionReveal from '../ui/SectionReveal';
import { trackEvent } from '../../lib/analytics';

const icons: LucideIcon[] = [
  ArrowRightLeft, GitBranch, Zap, Filter,
  MessageSquare, Brain, Monitor, Calendar, Bell,
];
const cardKeys = [
  'card1', 'card2', 'card3', 'card4', 'card5',
  'card6', 'card7', 'card8', 'card9',
] as const;

const EASE = [0.23, 1, 0.32, 1] as const;

type CardKey = typeof cardKeys[number];

function ServiceCard({ cardKey, index, icons }: { cardKey: CardKey; index: number; icons: LucideIcon[] }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const Icon = icons[cardKeys.indexOf(cardKey)];
  const badge = t(`services.${cardKey}.badge`, { defaultValue: '' });
  const checks = t(`services.${cardKey}.checks`, { returnObjects: true }) as string[];
  const checksNote = t(`services.${cardKey}.checksNote`, { defaultValue: '' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.06 }}
      className={`services-card flex flex-col relative${expanded ? ' services-card--expanded' : ''}`}
      onClick={() => setExpanded(p => !p)}
    >
      {/* Badge — top right corner */}
      {badge && (
        <span className="absolute top-4 right-4 h-6 px-3 rounded-full bg-white text-[#0a0a0a] font-semibold text-[10px] tracking-[0.14em] uppercase shrink-0 inline-flex items-center whitespace-nowrap">
          {badge}
        </span>
      )}

      {/* Icon — centered */}
      <div className="flex justify-center mb-5">
        <motion.div
          className="services-icon shrink-0"
          initial={{ scale: 0, rotate: -15 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ type: 'spring', stiffness: 220, damping: 14, delay: index * 0.05 }}
        >
          <Icon size={18} color="#C8C8C8" />
        </motion.div>
      </div>

      {/* Title + description — centered */}
      <h3 className="text-[1.1rem] font-heading font-semibold text-foreground mb-2 leading-snug text-center">
        {t(`services.${cardKey}.name`)}
      </h3>
      <p className="text-[13.5px] text-muted-foreground leading-relaxed text-center">
        {t(`services.${cardKey}.desc`)}
      </p>

      {/* Checklist — hover on desktop, tap-toggle on mobile */}
      <ul className="services-checklist">
        {checks.map((item, j) => (
          <li key={j} className="flex items-start gap-2 text-[13px] text-muted-foreground">
            <span className="text-accent mt-0.5 shrink-0">✓</span>
            {item}
          </li>
        ))}
      </ul>

      {/* Mobile expand button */}
      <button
        className="services-expand-btn md:hidden mt-3 text-[11px] text-muted-foreground/60 underline underline-offset-2 self-center"
        onClick={e => { e.stopPropagation(); setExpanded(p => !p); }}
        aria-label={expanded ? t('services.collapse', 'Hide details') : t('services.expand', 'Show details')}
      >
        {expanded ? '▲ ' + t('services.collapse', 'Hide details') : '▼ ' + t('services.expand', 'Show details')}
      </button>

      {checksNote && (
        <p className="services-checksNote text-[11px] text-muted-foreground/50 italic leading-relaxed">
          {checksNote}
        </p>
      )}

      {/* Price + CTA — centered, stacked */}
      <div className="services-price mt-auto pt-4">
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <span className="text-xs text-muted-foreground">{t('services.from')} </span>
            <span className="text-[1.35rem] font-heading font-bold text-foreground">
              {t(`services.${cardKey}.price`)}
            </span>
            <span className="text-xs text-muted-foreground ml-1.5">NOK {t('services.exVat')}</span>
          </div>
          <a
            href="#contact"
            onClick={() => {
              trackEvent('cta_click', {
                cta_type: 'service_card',
                cta_location: 'services',
                cta_id: cardKey,
                target: '#contact',
              });
            }}
            className="w-full justify-center text-[12px] font-medium text-[#0a0a0a] bg-white hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(255,255,255,0.18)] rounded-full px-3 py-1.5 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] inline-flex items-center gap-1 group whitespace-nowrap"
          >
            {t('services.orderCta')}
            <span className="group-hover:translate-x-0.5 transition-transform duration-200" aria-hidden>→</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const { t, i18n } = useTranslation();

  return (
    <section id="services" className="pt-16 md:pt-28 pb-8 md:pb-10 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div key={i18n.language} className="text-center mb-16">
          <motion.span
            className="section-badge"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '0px' }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {t('services.badge')}
          </motion.span>
          <SectionReveal as="h2" className="section-title" delay={0.1}>
            {`${t('services.title1')} ${t('services.title2')}`}
          </SectionReveal>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          >
            {t('services.subtitle')}
          </motion.p>
        </div>

        {/* 3-column grid — 3x3 = 9 cards, 3 cols from md to avoid orphan */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {cardKeys.map((key, i) => (
            <ServiceCard key={key} cardKey={key} index={i} icons={icons} />
          ))}
        </div>

        {/* Bottom section: custom CTA centered + pricing fine-print */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="pt-8 border-t border-white/[0.08] flex flex-col items-center gap-4 text-center"
        >
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            {t('services.customTitle')}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            {t('services.customDesc')}
          </p>
          <a
            href="#contact"
            onClick={() => trackEvent('cta_click', {
              cta_type: 'service_custom',
              cta_location: 'services',
              cta_id: 'custom_services',
              target: '#contact',
            })}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/[0.04] text-sm text-foreground hover:border-white/35 hover:bg-white/[0.07] transition-all duration-200"
          >
            {t('services.customCta')} <span aria-hidden>→</span>
          </a>
          <p className="text-xs text-muted-foreground/45 max-w-3xl leading-relaxed mt-1">
            {t('services.pricingNote')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
