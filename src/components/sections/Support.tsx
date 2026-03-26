import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

export default function Support() {
  const { t } = useTranslation();
  const plans = ['mini', 'standard', 'pro'] as const;
  const steps = t('support.steps', { returnObjects: true }) as { num: string; title: string; desc: string }[];

  return (
    <section id="support" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-badge">{t('support.badge')}</span>
          <h2 className="section-title">{t('support.title1')}<br />{t('support.title2')}</h2>
          <p className="section-subtitle">{t('support.subtitle')}</p>
        </div>

        <p className="text-sm text-muted-foreground text-center max-w-[600px] mx-auto mb-16">{t('support.disclaimer')}</p>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, i) => {
            const isStandard = plan === 'standard';
            const includes = t(`support.${plan}.includes`, { returnObjects: true }) as string[];
            const excludes = t(`support.${plan}.excludes`, { returnObjects: true }) as string[];

            return (
              <motion.div
                key={plan}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative rounded-[20px] p-8 flex flex-col transition-all duration-300 ${
                  isStandard
                    ? 'bg-surface-elevated border border-[rgba(200,200,200,0.4)] shadow-[0_0_30px_rgba(200,200,200,0.06)]'
                    : 'bg-surface border border-[rgba(255,255,255,0.25)] hover:border-[rgba(255,255,255,0.3)]'
                }`}
              >
                {isStandard && (
                  <span className="absolute top-4 right-4 text-[11px] px-3 py-1 rounded-full bg-foreground text-background font-medium">
                    {t('support.mostPopular')}
                  </span>
                )}
                <h3 className="text-2xl font-heading font-bold text-foreground mb-1">
                  {t(`support.${plan}.name`)}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{t(`support.${plan}.subtitle`)}</p>
                <div className="mb-6">
                  <span className="text-3xl font-heading font-bold text-foreground">{t(`support.${plan}.price`)}</span>
                  <span className="text-sm text-muted-foreground ml-2">NOK</span>
                  <p className="text-xs text-muted-foreground mt-1">{t('support.perMonth')}</p>
                </div>
                <ul className="space-y-2.5 mb-4 flex-1">
                  {includes.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-accent mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                  {excludes.map((item, j) => (
                    <li key={`ex-${j}`} className="flex items-start gap-2 text-sm text-muted-foreground opacity-50">
                      <X size={14} className="mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={isStandard ? 'btn-primary text-center' : 'btn-outline text-center'}>
                  {t('support.getStarted')}
                </a>
              </motion.div>
            );
          })}
        </div>

        <p className="text-[13px] text-muted-foreground text-center mb-20">{t('support.finePrint')}</p>

        {/* How support works */}
        <h3 className="text-xl font-heading font-bold text-foreground text-center mb-12">{t('support.howTitle')}</h3>
        <div className="grid md:grid-cols-4 gap-8 mb-16 relative">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-border" />
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center relative"
            >
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-heading font-bold text-foreground mx-auto mb-4 relative z-10">
                {step.num}
              </div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-2">{step.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="card-base rounded-[20px] p-8 md:p-12 text-center">
          <h3 className="text-xl font-heading font-bold text-foreground mb-3">{t('support.ctaTitle')}</h3>
          <p className="text-muted-foreground mb-6">{t('support.ctaDesc')}</p>
          <a href="#contact" className="btn-outline">{t('support.ctaButton')}</a>
        </div>
      </div>
    </section>
  );
}
