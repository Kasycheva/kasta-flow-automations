import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { Check, X, Shield, CheckCircle, Layers, Activity, Zap } from 'lucide-react';
import SectionReveal from '../ui/SectionReveal';

const EASE = [0.23, 1, 0.32, 1] as const;
const stepIcons = [CheckCircle, Layers, Activity, Zap];

export default function Support() {
  const { t, i18n } = useTranslation();
  const plans = ['mini', 'standard', 'pro'] as const;
  const steps = t('support.steps', { returnObjects: true }) as { num: string; title: string; desc: string }[];

  const stepsRef = useRef<HTMLDivElement>(null);
  const stepsInView = useInView(stepsRef, { once: true, margin: '0px' });

  return (
    <section id="support" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div key={i18n.language} className="text-center mb-8">
          <motion.span
            className="section-badge inline-flex items-center gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '0px' }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <Shield size={13} />
            {t('support.badge')}
          </motion.span>
          <SectionReveal as="h2" className="section-title" delay={0.1}>
            {`${t('support.title1')} ${t('support.title2')}`}
          </SectionReveal>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          >
            {t('support.subtitle')}
          </motion.p>
        </div>

        <motion.p
          key={`support-disclaimer-${i18n.language}`}
          className="text-sm text-muted-foreground text-center max-w-[600px] mx-auto mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: '0px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {t('support.disclaimer')}
        </motion.p>

        {/* Pricing cards â€” spring bounce entrance, center card emphasized */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, i) => {
            const isStandard = plan === 'standard';
            const includes = t(`support.${plan}.includes`, { returnObjects: true }) as string[];
            const excludes = t(`support.${plan}.excludes`, { returnObjects: true }) as string[];

            return (
              <motion.div
                key={plan}
                initial={{ opacity: 0, y: 40, scale: isStandard ? 0.94 : 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: isStandard ? 1.02 : 1 }}
                whileHover={{
                  y: -6,
                  scale: isStandard ? 1.04 : 1.01,
                  boxShadow: isStandard
                    ? '0 20px 60px rgba(0,0,0,0.4)'
                    : '0 16px 48px rgba(0,0,0,0.3)',
                }}
                viewport={{ once: true }}
                transition={{
                  type: 'spring',
                  stiffness: 120,
                  damping: 14,
                  delay: i * 0.15,
                  hover: { duration: 0.28, ease: EASE },
                }}
                className={`relative rounded-[20px] p-8 flex flex-col items-center text-center ${
                  isStandard
                    ? 'bg-surface-elevated border border-[rgba(200,200,200,0.4)] shadow-[0_0_30px_rgba(200,200,200,0.06)] hover:border-[rgba(220,220,220,0.6)]'
                    : 'bg-surface border border-[rgba(255,255,255,0.25)] hover:border-[rgba(255,255,255,0.45)]'
                }`}
              >
                {isStandard && (
                  <motion.span
                    className="absolute top-4 right-4 text-[11px] px-3 py-1 rounded-full bg-foreground text-background font-medium"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    {t('support.mostPopular')}
                  </motion.span>
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
                <ul className="space-y-2.5 mb-4 flex-1 w-full">
                  {includes.map((item, j) => (
                    <li key={j} className="flex items-start justify-center gap-2 text-sm text-muted-foreground">
                      <Check size={14} className="text-accent mt-0.5 shrink-0" />
                      <span className="text-left">{item}</span>
                    </li>
                  ))}
                  {excludes.map((item, j) => (
                    <li key={`ex-${j}`} className="flex items-start justify-center gap-2 text-sm text-muted-foreground opacity-50">
                      <X size={14} className="mt-0.5 shrink-0" />
                      <span className="text-left">{item}</span>
                    </li>
                  ))}
                </ul>
                <a href="#contact" className={`w-full ${isStandard ? 'btn-primary text-center' : 'btn-outline text-center'}`}>
                  {t('support.getStarted')}
                </a>
              </motion.div>
            );
          })}
        </div>

        <p className="text-[13px] text-muted-foreground text-center mb-20">{t('support.finePrint')}</p>

        {/* How support works â€” alternating slide-in */}
        <h3 className="text-xl font-heading font-bold text-foreground text-center mb-12">{t('support.howTitle')}</h3>
        <div ref={stepsRef} className="grid md:grid-cols-4 gap-8 mb-16 relative">
          {/* Connecting line â€” draws itself left to right */}
          <motion.div
            className="hidden md:block absolute top-[19px] left-[12.5%] right-[12.5%] h-px border-t border-dashed border-border origin-left"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={stepsInView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          />
          {steps.map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ type: 'spring', stiffness: 80, damping: 18, delay: 0.3 + i * 0.25 }}
                className="text-center relative"
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-foreground mx-auto mb-4 relative z-10"
                  initial={{ scale: 0 }}
                  animate={stepsInView ? { scale: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.35 + i * 0.25 }}
                >
                  <Icon size={18} />
                </motion.div>
                <h4 className="text-sm font-heading font-semibold text-foreground mb-2">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
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


