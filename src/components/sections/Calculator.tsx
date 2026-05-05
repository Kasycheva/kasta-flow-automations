import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import SectionReveal from '../ui/SectionReveal';
import { trackEvent } from '../../lib/analytics';

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

  return <span translate="no">{format(display)}</span>;
}

const fmt = (n: number) => new Intl.NumberFormat('no-NO').format(n);

function Slider({
  label, helper, min, max, step, value, onChange, displayValue, trackingControl, onTrackInteraction,
}: {
  label: string; helper?: string; min: number; max: number;
  step: number; value: number; onChange: (v: number) => void; displayValue: string;
  trackingControl: 'hours' | 'rate' | 'employees';
  onTrackInteraction: (control: 'hours' | 'rate' | 'employees') => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;

  const handleChange = (nextValue: number) => {
    onTrackInteraction(trackingControl);
    onChange(nextValue);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs text-muted-foreground uppercase tracking-wider">{label}</label>
        <span className="text-sm font-heading font-bold text-foreground tabular-nums" translate="no">{displayValue}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-white/40 to-white/80 transition-[width] duration-100"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => handleChange(+e.target.value)}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-foreground border-2 border-background shadow-lg pointer-events-none transition-[left] duration-100"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      {helper && <p className="text-[11px] text-muted-foreground/50 mt-1.5">{helper}</p>}
    </div>
  );
}

function MetricCard({ label, value, color = 'text-foreground', large = false }: {
  label: string; value: React.ReactNode; color?: string; large?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">{label}</p>
      <p className={`font-heading font-bold tabular-nums ${color} ${large ? 'text-3xl' : 'text-xl'}`}>
        {value}
      </p>
    </div>
  );
}

const NOK = <span className="text-xs font-normal text-muted-foreground ml-1" translate="no">NOK</span>;

const EASE = [0.23, 1, 0.32, 1] as const;

export default function Calculator() {
  const { t, i18n } = useTranslation();
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(500);
  const [employees, setEmployees] = useState(1);
  const sectionRef = useRef<HTMLElement>(null);
  const trackedControlsRef = useRef(new Set<'hours' | 'rate' | 'employees'>());
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  const trackCalculatorInteraction = (control: 'hours' | 'rate' | 'employees') => {
    if (trackedControlsRef.current.has(control)) return;
    trackedControlsRef.current.add(control);
    trackEvent('calculator_interaction', {
      calculator_control: control,
    });
  };

  const weeklyCost  = hours * rate * employees;
  const monthlyCost = Math.round(weeklyCost * 4.3);
  const annualCost  = monthlyCost * 12;
  const avgAutomationPrice = Math.min(Math.max(hours * employees * 800, 3200), 15000);
  const paybackMonths = +(avgAutomationPrice / monthlyCost).toFixed(1);
  const barWidth = Math.min((paybackMonths / 12) * 100, 100);

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

        {/* Section header */}
        <div key={i18n.language} className="text-center mb-12">
          <motion.span
            className="section-badge inline-flex items-center gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '0px' }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <BarChart3 size={12} />
            {t('calculator.badge')}
          </motion.span>
          <SectionReveal as="h2" className="section-title" delay={0.1}>
            {`${t('calculator.title1')} ${t('calculator.title2')}`}
          </SectionReveal>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          >
            {t('calculator.subtitle')}
          </motion.p>
        </div>

        {/* Dashboard card â€” slides up from below */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.75, delay: 0.1, ease: EASE }}
          className="rounded-2xl overflow-hidden"
          style={{
            border: '1px solid rgba(255,255,255,0.45)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 40px rgba(0,0,0,0.6)',
            background: '#0D0D0D',
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        >
          {/* Top bar */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
          >
            <span className="text-[11px] text-muted-foreground/60 tracking-widest uppercase" translate="no">
              kasta flow studio
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground/70">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
              <span>{t('calculator.live')}</span>
            </span>
          </div>

          {/* Body: left sliders / right metrics */}
          <div className="grid md:grid-cols-[1fr_1.15fr] items-stretch divide-y md:divide-y-0 md:divide-x divide-white/[0.07]">

            {/* â”€â”€ Left: sliders only â”€â”€ */}
            <div className="p-7 md:p-10 flex flex-col justify-center gap-8">
              {[
                {
                  label: t('calculator.hoursLabel'),
                  min: 1, max: 40, step: 1, value: hours, onChange: setHours,
                  displayValue: `${hours} ${t('calculator.hoursUnit')}`,
                  trackingControl: 'hours' as const,
                  onTrackInteraction: trackCalculatorInteraction,
                  delay: 0.3,
                },
                {
                  label: t('calculator.rateLabel'),
                  helper: t('calculator.rateHelper'),
                  min: 200, max: 1200, step: 50, value: rate, onChange: setRate,
                  displayValue: `${fmt(rate)} ${t('calculator.rateUnit')}`,
                  trackingControl: 'rate' as const,
                  onTrackInteraction: trackCalculatorInteraction,
                  delay: 0.42,
                },
                {
                  label: t('calculator.employeesLabel'),
                  min: 1, max: 10, step: 1, value: employees, onChange: setEmployees,
                  displayValue: String(employees),
                  trackingControl: 'employees' as const,
                  onTrackInteraction: trackCalculatorInteraction,
                  delay: 0.54,
                },
              ].map(({ delay, ...props }) => (
                <motion.div
                  key={props.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay, ease: EASE }}
                >
                  <Slider {...props} />
                </motion.div>
              ))}
            </div>

            {/* â”€â”€ Right: metrics â”€â”€ */}
            <div className="p-7 md:p-10 flex flex-col gap-4 justify-between">

              {/* Annual waste â€” hero metric */}
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
                className="rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                  {t('calculator.annualWaste')}
                </p>
                <p
                  className="text-4xl md:text-5xl font-heading font-bold text-foreground tabular-nums leading-none"
                  style={{ textShadow: '0 0 32px rgba(255,255,255,0.1)' }}
                >
                  <AnimatedNumber value={annualCost} format={fmt} />
                  <span className="text-lg font-normal text-muted-foreground ml-2" translate="no">NOK</span>
                </p>
              </motion.div>

              {/* Weekly + Monthly */}
              <div className="grid grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.48, ease: EASE }}
                >
                  <MetricCard
                    label={t('calculator.weeklyWaste')}
                    value={<><AnimatedNumber value={weeklyCost} format={fmt} />{NOK}</>}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.45, delay: 0.56, ease: EASE }}
                >
                  <MetricCard
                    label={t('calculator.monthlyWaste')}
                    color="text-accent"
                    value={<><AnimatedNumber value={monthlyCost} format={fmt} />{NOK}</>}
                  />
                </motion.div>
              </div>

              {/* Payback â€” with embedded progress bar */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.64, ease: EASE }}
                className="flex-1 rounded-xl p-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                  {t('calculator.payback')}
                </p>
                <p className="text-3xl font-heading font-bold tabular-nums text-foreground mb-4">
                  <span translate="no">{paybackMonths < 2 ? '< 2' : paybackMonths}</span>{' '}
                  <span className="text-sm font-normal text-muted-foreground">{t('calculator.months')}</span>
                </p>
                <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.8))' }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ type: 'spring', stiffness: 80, damping: 18 }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/50">
                  {t('calculator.estimatedCost')}{' '}
                  <span translate="no">{fmt(avgAutomationPrice)} NOK</span>
                </p>
              </motion.div>

            </div>
          </div>
        </motion.div>

        {/* CTA â€” centered below card */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8, ease: EASE }}
        >
          <p className="text-sm text-muted-foreground mb-8">{t('calculator.resultNote')}</p>
          <a href="#contact" className="btn-primary">{t('calculator.cta')}</a>
        </motion.div>

      </div>
    </section>
  );
}


