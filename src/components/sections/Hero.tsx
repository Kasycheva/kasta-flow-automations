import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' as const },
});

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <motion.div {...fadeUp(0.2)}>
              <span className="section-badge">{t('hero.badge')}</span>
            </motion.div>
            <motion.h1 {...fadeUp(0.5)} className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-[1.1] mb-6">
              {t('hero.title1')}<br />{t('hero.title2')}
            </motion.h1>
            <motion.p {...fadeUp(0.8)} className="text-lg text-muted-foreground max-w-lg mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </motion.p>
            <motion.div {...fadeUp(1.1)} className="flex flex-wrap gap-4 mb-8">
              <a href="#contact" className="btn-primary">{t('hero.ctaPrimary')}</a>
              <a href="#services" className="btn-outline">{t('hero.ctaSecondary')}</a>
            </motion.div>
            <motion.div {...fadeUp(1.4)} className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>{t('hero.proof1')}</span>
              <span>{t('hero.proof2')}</span>
              <span>{t('hero.proof3')}</span>
            </motion.div>
          </div>

          {/* Robot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(200,200,200,0.08),transparent)] rounded-full scale-125" />
              <DotLottieReact
                src="https://lottie.host/6736fad7-3348-473d-89d7-29fa57fce136/VqnXUbDwSr.lottie"
                loop
                autoplay
                className="w-[280px] h-[280px] lg:w-[480px] lg:h-[480px]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
