import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

function CountUpStat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-1"
      >
        {value}
      </motion.p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export default function Cases() {
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = t('cases.testimonials', { returnObjects: true }) as { quote: string; author: string; role: string }[];
  const stats = t('cases.stats', { returnObjects: true }) as { value: string; label: string }[];
  const caseKeys = ['case1', 'case2', 'case3'] as const;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section id="cases" className="section-padding bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{t('cases.badge')}</span>
          <h2 className="section-title">{t('cases.title1')}<br />{t('cases.title2')}</h2>
          <p className="section-subtitle">{t('cases.subtitle')}</p>
        </div>

        {/* Case cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {caseKeys.map((key, i) => {
            const metrics = t(`cases.${key}.metrics`, { returnObjects: true }) as string[];
            const stack = t(`cases.${key}.stack`, { returnObjects: true }) as string[];

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="card-base card-hover overflow-hidden rounded-[20px] p-0 group"
              >
                {/* Image placeholder */}
                <div className="relative h-[200px] bg-gradient-to-b from-surface-elevated to-surface flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-10" />
                  <div className="text-4xl opacity-20 font-heading font-bold text-muted-foreground">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <span className="absolute bottom-3 left-4 z-20 text-[11px] px-2.5 py-1 rounded-full bg-background/80 backdrop-blur text-foreground border border-border">
                    {t(`cases.${key}.badge`)}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-xs text-muted-foreground mb-2">{t(`cases.${key}.industry`)}</p>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-3">{t(`cases.${key}.title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t(`cases.${key}.desc`)}</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {metrics.map((m, j) => (
                      <div key={j} className="bg-background rounded-lg p-2 text-center border border-border">
                        <p className="text-xs text-muted-foreground leading-tight">{m}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {stack.map(s => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded border border-border text-muted-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12">
          <span className="section-badge">{t('cases.testimonialsBadge')}</span>
          <h2 className="section-title">{t('cases.testimonialsTitle1')}<br />{t('cases.testimonialsTitle2')}</h2>
        </div>

        <div className="relative max-w-3xl mx-auto mb-16">
          <div className="card-base rounded-2xl p-8 min-h-[200px]">
            <span className="text-5xl text-accent opacity-40 font-heading leading-none block mb-4">"</span>
            <p className="text-foreground text-base leading-relaxed mb-6">
              {testimonials[currentTestimonial]?.quote}
            </p>
            <div className="border-t border-border pt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center text-sm font-heading font-bold text-foreground">
                {testimonials[currentTestimonial]?.author.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{testimonials[currentTestimonial]?.author}</p>
                <p className="text-xs text-muted-foreground">{testimonials[currentTestimonial]?.role}</p>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-accent fill-accent" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            <button onClick={() => setCurrentTestimonial(p => (p - 1 + testimonials.length) % testimonials.length)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === currentTestimonial ? 'bg-foreground' : 'bg-border'}`} />
              ))}
            </div>
            <button onClick={() => setCurrentTestimonial(p => (p + 1) % testimonials.length)} className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-surface rounded-2xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <CountUpStat key={i} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
