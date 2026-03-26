import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const [display, setDisplay] = useState(value);
  const ref = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const diff = value - start;
    const duration = 400;
    const startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else ref.current = value;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{format(display)}</>;
}

const fmt = (n: number) => new Intl.NumberFormat('no-NO').format(n);

const SLIDER_CLASS =
  'w-full accent-accent h-1.5 bg-border rounded-full appearance-none cursor-pointer ' +
  '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 ' +
  '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-foreground ' +
  '[&::-webkit-slider-thumb]:rounded-full';

const RESULT_CARD_STYLE = {
  border: '1px solid rgba(255,255,255,0.22)',
  background: 'rgba(255,255,255,0.04)',
};

export default function Calculator() {
  const { t } = useTranslation();
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(500);
  const [employees, setEmployees] = useState(1);
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const weeklyCost = hours * rate * employees;
  const monthlyCost = Math.round(weeklyCost * 4.3);
  const annualCost = monthlyCost * 12;
  const avgAutomationPrice = Math.min(Math.max(hours * employees * 800, 3200), 15000);
  const paybackMonths = +(avgAutomationPrice / monthlyCost).toFixed(1);
  const barWidth = Math.min((paybackMonths / 12) * 100, 100);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 40 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    transition: { duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] as const },
  });

  const fadeLeft = (delay: number) => ({
    initial: { opacity: 0, x: -20 },
    animate: inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 },
    transition: { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] as const },
  });

  const fadeRight = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: { duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] as const },
  });

  return (
    <section
      ref={sectionRef}
      id="calculator"
      className="min-h-screen flex flex-col justify-center py-16 px-4 md:px-8"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #141414 50%, #0A0A0A 100%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-7xl mx-auto w-full">

        {/* Heading */}
        <motion.div {...fadeUp(0.1)} className="text-center mb-14">
          <span className="section-badge">{t('calculator.badge')}</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-foreground leading-[1.02] tracking-tight mb-5">
            {t('calculator.title1')}<br />{t('calculator.title2')}
          </h2>
          <p className="section-subtitle">{t('calculator.subtitle')}</p>
        </motion.div>

        {/* Main grid: sliders | big number | results */}
        <div className="grid md:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 items-center mb-10">

          {/* Sliders */}
          <div className="space-y-8">
            <motion.div {...fadeLeft(0.2)}>
              <label className="text-sm text-muted-foreground mb-3 block">{t('calculator.hoursLabel')}</label>
              <input type="range" min={1} max={40} step={1} value={hours}
                onChange={e => setHours(+e.target.value)} className={SLIDER_CLASS} />
              <p className="text-foreground font-heading font-bold mt-2">{hours} {t('calculator.hoursUnit')}</p>
            </motion.div>
            <motion.div {...fadeLeft(0.35)}>
              <label className="text-sm text-muted-foreground mb-3 block">{t('calculator.rateLabel')}</label>
              <input type="range" min={200} max={1200} step={50} value={rate}
                onChange={e => setRate(+e.target.value)} className={SLIDER_CLASS} />
              <p className="text-foreground font-heading font-bold mt-2">{fmt(rate)} {t('calculator.rateUnit')}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('calculator.rateHelper')}</p>
            </motion.div>
            <motion.div {...fadeLeft(0.5)}>
              <label className="text-sm text-muted-foreground mb-3 block">{t('calculator.employeesLabel')}</label>
              <input type="range" min={1} max={10} step={1} value={employees}
                onChange={e => setEmployees(+e.target.value)} className={SLIDER_CLASS} />
              <p className="text-foreground font-heading font-bold mt-2">{employees}</p>
            </motion.div>
          </div>

          {/* Big annual number — desktop only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="hidden md:flex flex-col items-center text-center px-6"
          >
            <p
              className="text-7xl lg:text-8xl font-heading font-bold text-foreground leading-none mb-3 tabular-nums"
              style={{ textShadow: '0 0 40px rgba(200,200,200,0.25), 0 0 80px rgba(200,200,200,0.1)' }}
            >
              <AnimatedNumber value={inView ? annualCost : 0} format={fmt} />
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest max-w-[140px] leading-relaxed">
              NOK you lose per year on manual work
            </p>
          </motion.div>

          {/* Result cards — 2×2 grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div {...fadeRight(0.2)} className="rounded-xl p-4" style={RESULT_CARD_STYLE}>
              <p className="text-xs text-muted-foreground mb-1">{t('calculator.weeklyWaste')}</p>
              <p className="text-xl font-heading font-bold text-foreground">
                <AnimatedNumber value={weeklyCost} format={fmt} /> <span className="text-xs font-normal">NOK</span>
              </p>
            </motion.div>
            <motion.div {...fadeRight(0.3)} className="rounded-xl p-4" style={RESULT_CARD_STYLE}>
              <p className="text-xs text-muted-foreground mb-1">{t('calculator.monthlyWaste')}</p>
              <p className="text-xl font-heading font-bold text-accent">
                <AnimatedNumber value={monthlyCost} format={fmt} /> <span className="text-xs font-normal">NOK</span>
              </p>
            </motion.div>
            <motion.div {...fadeRight(0.4)} className="rounded-xl p-4 col-span-2" style={RESULT_CARD_STYLE}>
              <p className="text-xs text-muted-foreground mb-1">{t('calculator.annualWaste')}</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                <AnimatedNumber value={annualCost} format={fmt} /> <span className="text-xs font-normal">NOK</span>
              </p>
            </motion.div>
            <motion.div {...fadeRight(0.5)} className="rounded-xl p-4 col-span-2" style={RESULT_CARD_STYLE}>
              <p className="text-[10px] text-muted-foreground/60 mb-1">
                Estimated automation cost: {fmt(avgAutomationPrice)} NOK
              </p>
              <p className="text-xs text-muted-foreground mb-1">{t('calculator.payback')}</p>
              <p className="text-2xl font-heading font-bold text-kasta-green">
                {paybackMonths < 2 ? '< 2' : paybackMonths} {t('calculator.months')}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Big annual number — mobile only */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="md:hidden text-center mb-10"
        >
          <p
            className="text-6xl font-heading font-bold text-foreground leading-none mb-2 tabular-nums"
            style={{ textShadow: '0 0 40px rgba(200,200,200,0.2)' }}
          >
            <AnimatedNumber value={inView ? annualCost : 0} format={fmt} />
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            NOK / year — manual work cost
          </p>
        </motion.div>

        {/* Progress bar */}
        <motion.div {...fadeUp(0.5)} className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">{t('calculator.progressLabel')}</p>
            <p className="text-sm font-heading font-bold text-foreground">{paybackMonths} {t('calculator.months')}</p>
          </div>
          <div className="h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent to-foreground"
              animate={{ width: `${barWidth}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 18 }}
            />
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div {...fadeUp(0.6)} className="text-center">
          <p className="text-sm text-muted-foreground mb-4">{t('calculator.resultNote')}</p>
          <a href="#contact" className="btn-primary">{t('calculator.cta')}</a>
        </motion.div>

      </div>
    </section>
  );
}
