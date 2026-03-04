import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Zap, Filter, MessageSquare, Brain, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const icons: LucideIcon[] = [ArrowRightLeft, Zap, Filter, MessageSquare, Brain, Rocket];
const cardKeys = ['card1', 'card2', 'card3', 'card4', 'card5', 'card6'] as const;

export default function Services() {
  const { t } = useTranslation();

  return (
    <section id="services" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="section-badge">{t('services.badge')}</span>
          <h2 className="section-title">
            {t('services.title1')}<br />{t('services.title2')}
          </h2>
          <p className="section-subtitle">{t('services.subtitle')}</p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cardKeys.map((key, i) => {
            const Icon = icons[i];
            const badge = t(`services.${key}.badge`, { defaultValue: '' });
            const checks = t(`services.${key}.checks`, { returnObjects: true }) as string[];

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-base card-hover flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon size={32} className="text-accent" />
                  {badge && (
                    <span className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted-foreground">
                      {badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  {t(`services.${key}.name`)}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">
                  {t(`services.${key}.desc`)}
                </p>
                <div className="border-t border-border my-4" />
                <ul className="space-y-2 mb-6 flex-1">
                  {checks.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-accent mt-0.5">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto">
                  <span className="text-xs text-muted-foreground">{t('services.from')}</span>
                  <span className="text-2xl font-heading font-bold text-foreground ml-2">
                    {t(`services.${key}.price`)}
                  </span>
                  <span className="text-sm text-muted-foreground ml-1">NOK</span>
                  <span className="text-xs text-muted-foreground ml-2">{t('services.exVat')}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Custom task block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-surface-elevated border border-border rounded-[20px] p-8 md:p-12 flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8"
        >
          <div>
            <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">
              {t('services.customTitle')}
            </h3>
            <p className="text-muted-foreground max-w-xl leading-relaxed">
              {t('services.customDesc')}
            </p>
          </div>
          <a href="#contact" className="btn-outline whitespace-nowrap self-start md:self-center">
            {t('services.customCta')}
          </a>
        </motion.div>

        {/* Pricing note */}
        <div className="border-t border-border pt-6">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-4xl">
            {t('services.pricingNote')}
          </p>
        </div>
      </div>
    </section>
  );
}
