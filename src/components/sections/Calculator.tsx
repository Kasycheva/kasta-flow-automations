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

function Slider({
  label, helper, min, max, step, value, onChange, displayValue,
}: {
  label: string; helper?: string; min: number; max: number;
  step: number; value: number; onChange: (v: number) => void; displayValue: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</label>
        <span className="text-sm font-heading font-bold text-foreground tabular-nums">{displayValue}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-white/40 to-white/80 transition-[width] duration-100"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-foreground border-2 border-background shadow-lg pointer-events-none transition-[left] duration-100"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      {helper && <p className="text-[11px] text-muted-foreground/60 mt-1.5">{helper}</p>}
    </div>
  );
}

function MetricCard({
  label, value, color = 'text-foreground', size = 'md',
}: {
  label: string; value: React.ReactNode; color?: string; size?: 'md' | 'lg';
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <p className={`font-heading font-bold tabular-nums ${color} ${size === 'lg' ? 'text-3xl' : 'text-xl'}`}>
        {value}
      </p>
    </div>
  );
}

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
      { threshold: 0.15 }
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

  const EASE = [0.23, 1, 0.32, 1] as const;

  return (
    <section
      ref={sectionRef}
      id="calculator"
      className="py-16 md:py-24 px-4 md:px-8"
      style={{
        background: 'linear-gradient(180deg, #0A0A0A 0%, #111111 50%, #0A0A0A 100%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="section-badge">{t('calculator.badge')}</span>
          <h2 className="section-title">{t('calculator.title1')}<br />{t('calculator.title2')}</h2>
          <p className="section-subtitle">{t('calculator.subtitle')}</p>
        </motion.div>

        {/* Dashboard card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.25)',
            background: '#0D0D0D',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        >
          {/* Terminal top bar */}
          <div
            className="flex items-center gap-3 px-5 py-3.5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="flex-1 text-center text-[11px] text-muted-foreground/50 tracking-widest uppercase">
              kasta flow — roi calculator
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-kasta-green">
              <span className="w-1.5 h-1.5 rounded-full bg-kasta-green animate-pulse" />
              live
            </span>
          </div>

          {/* Body */}
          <div className="grid md:grid-cols-[1fr_1.1fr] divide-y md:divide-y-0 md:divide-x divide-white/[0.07]">

            {/* Left — sliders */}
            <div className="p-7 md:p-10 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
              >
                <Slider
                  label={t('calculator.hoursLabel')}
                  min={1} max={40} step={1} value={hours} onChange={setHours}
                  displayValue={`${hours} ${t('calculator.hoursUnit')}`}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.48, ease: EASE }}
              >
                <Slider
                  label={t('calculator.rateLabel')}
                  helper={t('calculator.rateHelper')}
                  min={200} max={1200} step={50} value={rate} onChange={setRate}
                  displayValue={`${fmt(rate)} ${t('calculator.rateUnit')}`}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.61, ease: EASE }}
              >
                <Slider
                  label={t('calculator.employeesLabel')}
                  min={1} max={10} step={1} value={employees} onChange={setEmployees}
                  displayValue={String(employees)}
                />
              </motion.div>

              {/* Payback bar — inside left panel */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
                className="pt-2"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{t('calculator.progressLabel')}</p>
                  <p className="text-xs font-heading font-bold text-foreground tabular-nums">
                    {paybackMonths < 2 ? '< 2' : paybackMonths} {t('calculator.months')}
                  </p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0.85))' }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/50 mt-1.5">
                  Est. automation cost: {fmt(avgAutomationPrice)} NOK
                </p>
              </motion.div>
            </div>

            {/* Right — metrics */}
            <div className="p-7 md:p-10 flex flex-col gap-4">

              {/* Hero metric — annual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
                className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">{t('calculator.annualWaste')}</p>
                <p
                  className="text-4xl md:text-5xl font-heading font-bold text-foreground tabular-nums leading-none"
                  style={{ textShadow: '0 0 32px rgba(255,255,255,0.12)' }}
                >
                  <AnimatedNumber value={annualCost} format={fmt} />
                  <span className="text-lg font-normal text-muted-foreground ml-2">NOK</span>
                </p>
              </motion.div>

              {/* 2-col smaller metrics */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.5, ease: EASE }}
                >
                  <MetricCard
                    label={t('calculator.weeklyWaste')}
                    value={<><AnimatedNumber value={weeklyCost} format={fmt} /><span className="text-xs font-normal text-muted-foreground ml-1">NOK</span></>}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.6, ease: EASE }}
                >
                  <MetricCard
                    label={t('calculator.monthlyWaste')}
                    color="text-accent"
                    value={<><AnimatedNumber value={monthlyCost} format={fmt} /><span className="text-xs font-normal text-muted-foreground ml-1">NOK</span></>}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.68, ease: EASE }}
                  className="col-span-2"
                >
                  <MetricCard
                    label={t('calculator.payback')}
                    color="text-kasta-green"
                    size="lg"
                    value={<>{paybackMonths < 2 ? '< 2' : paybackMonths} <span className="text-sm font-normal text-muted-foreground">{t('calculator.months')}</span></>}
                  />
                </motion.div>
              </div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.78, ease: EASE }}
                className="mt-auto pt-2"
              >
                <p className="text-xs text-muted-foreground mb-3">{t('calculator.resultNote')}</p>
                <a href="#contact" className="btn-primary w-full text-center block">{t('calculator.cta')}</a>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
