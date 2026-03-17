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

export default function Calculator() {
  const { t } = useTranslation();
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(500);
  const [employees, setEmployees] = useState(1);

  const weeklyCost = hours * rate * employees;
  const monthlyCost = Math.round(weeklyCost * 4.3);
  const annualCost = monthlyCost * 12;
  const avgAutomationPrice = 25000;
  const paybackMonths = +(avgAutomationPrice / monthlyCost).toFixed(1);
  const barWidth = Math.min((paybackMonths / 12) * 100, 100);

  return (
    <section id="calculator" className="pt-10 md:pt-16 pb-10 md:pb-14 px-4 md:px-8 bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{t('calculator.badge')}</span>
          <h2 className="section-title">{t('calculator.title1')}<br />{t('calculator.title2')}</h2>
          <p className="section-subtitle">{t('calculator.subtitle')}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-[720px] mx-auto card-base rounded-3xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-10">
            {/* Sliders */}
            <div className="space-y-8">
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">{t('calculator.hoursLabel')}</label>
                <input type="range" min={1} max={40} step={1} value={hours} onChange={e => setHours(+e.target.value)}
                  className="w-full accent-accent h-1.5 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded-full" />
                <p className="text-foreground font-heading font-bold mt-2">{hours} {t('calculator.hoursUnit')}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">{t('calculator.rateLabel')}</label>
                <input type="range" min={200} max={1200} step={50} value={rate} onChange={e => setRate(+e.target.value)}
                  className="w-full accent-accent h-1.5 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded-full" />
                <p className="text-foreground font-heading font-bold mt-2">{fmt(rate)} {t('calculator.rateUnit')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('calculator.rateHelper')}</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-3 block">{t('calculator.employeesLabel')}</label>
                <input type="range" min={1} max={10} step={1} value={employees} onChange={e => setEmployees(+e.target.value)}
                  className="w-full accent-accent h-1.5 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded-full" />
                <p className="text-foreground font-heading font-bold mt-2">{employees}</p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              <div className="bg-background rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{t('calculator.weeklyWaste')}</p>
                <p className="text-2xl font-heading font-bold text-foreground"><AnimatedNumber value={weeklyCost} format={fmt} /> NOK</p>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{t('calculator.monthlyWaste')}</p>
                <p className="text-2xl font-heading font-bold text-accent"><AnimatedNumber value={monthlyCost} format={fmt} /> NOK</p>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{t('calculator.annualWaste')}</p>
                <p className="text-3xl font-heading font-bold text-foreground"><AnimatedNumber value={annualCost} format={fmt} /> NOK</p>
              </div>
              <div className="bg-background rounded-xl p-4 border border-border">
                <p className="text-xs text-muted-foreground mb-1">{t('calculator.payback')}</p>
                <p className="text-2xl font-heading font-bold text-kasta-green">
                  {paybackMonths < 2 ? '< 2' : paybackMonths} {t('calculator.months')}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">{t('calculator.progressLabel')}</p>
              <p className="text-sm font-heading font-bold text-foreground">{paybackMonths} {t('calculator.months')}</p>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent to-foreground"
                animate={{ width: `${barWidth}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t('calculator.resultNote')}</p>
            <a href="#contact" className="btn-primary">{t('calculator.cta')}</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
