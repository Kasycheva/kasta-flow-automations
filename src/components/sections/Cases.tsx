import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/* ─── SVG Flow Diagrams ─────────────────────────────────────────── */

const BOX  = { fill: '#111111', stroke: 'rgba(255,255,255,0.13)', strokeWidth: 1.5 } as const;
const ICO  = { stroke: 'rgba(255,255,255,0.8)', strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const LBL  = { fontSize: 10, fill: 'rgba(255,255,255,0.55)', fontFamily: 'system-ui,sans-serif', textAnchor: 'middle' as const };
const ARR  = { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.5, fill: 'none' } as const;

/** Card 1 — 3 inputs branch into n8n → Calendar → Gmail */
function Card1SVG() {
  return (
    <svg viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <marker id="a1" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0.5 L6,3.5 L0,6.5Z" fill="rgba(255,255,255,0.35)"/>
        </marker>
      </defs>

      {/* Typeform — form lines icon */}
      <rect x="24" y="25" width="38" height="38" rx="10" {...BOX}/>
      <g transform="translate(33,34) scale(0.92)" {...ICO}>
        <line x1="2" y1="5" x2="22" y2="5"/>
        <line x1="2" y1="12" x2="18" y2="12"/>
        <line x1="2" y1="19" x2="13" y2="19"/>
      </g>

      {/* Phone */}
      <rect x="24" y="71" width="38" height="38" rx="10" {...BOX}/>
      <g transform="translate(33,80) scale(0.92)" {...ICO}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.63a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </g>

      {/* Chat / MessageSquare */}
      <rect x="24" y="117" width="38" height="38" rx="10" {...BOX}/>
      <g transform="translate(33,126) scale(0.92)" {...ICO}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </g>

      {/* Arrows → n8n (center 183,90) */}
      <path d="M62,44 C108,44 138,90 156,90"  {...ARR} markerEnd="url(#a1)"/>
      <path d="M62,90 C102,90 132,90 156,90"  {...ARR} markerEnd="url(#a1)"/>
      <path d="M62,136 C108,136 138,90 156,90" {...ARR} markerEnd="url(#a1)"/>

      {/* n8n */}
      <rect x="156" y="63" width="54" height="54" rx="13" {...BOX}/>
      <text x="183" y="96" textAnchor="middle" fontSize="19" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">n8n</text>

      {/* n8n → Calendar */}
      <path d="M210,90 L258,90" {...ARR} markerEnd="url(#a1)"/>

      {/* Google Calendar */}
      <rect x="258" y="66" width="48" height="48" rx="11" {...BOX}/>
      <g transform="translate(270,78) scale(1.08)" {...ICO}>
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </g>
      <text x="282" y="128" {...LBL}>Google Calendar</text>

      {/* Calendar → Gmail */}
      <path d="M306,90 L342,90" {...ARR} markerEnd="url(#a1)"/>

      {/* Gmail */}
      <rect x="342" y="66" width="48" height="48" rx="11" {...BOX}/>
      <g transform="translate(354,78) scale(1.08)" {...ICO}>
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M22,6 L12,13 L2,6"/>
      </g>
      <text x="366" y="128" {...LBL}>Gmail</text>
    </svg>
  );
}

/** Card 2 — Landing page → n8n → CRM → Gmail */
function Card2SVG() {
  return (
    <svg viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <marker id="a2" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0.5 L6,3.5 L0,6.5Z" fill="rgba(255,255,255,0.35)"/>
        </marker>
      </defs>

      {/* Landing page — Monitor icon */}
      <rect x="24" y="55" width="48" height="48" rx="11" {...BOX}/>
      <g transform="translate(36,67) scale(1.08)" {...ICO}>
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8"  y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </g>
      <text x="48" y="121" {...LBL}>Landing page</text>

      <path d="M72,79 L132,79" {...ARR} markerEnd="url(#a2)"/>

      {/* n8n */}
      <rect x="132" y="55" width="48" height="48" rx="11" {...BOX}/>
      <text x="156" y="85" textAnchor="middle" fontSize="17" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">n8n</text>
      <text x="156" y="121" {...LBL}>n8n</text>

      <path d="M180,79 L240,79" {...ARR} markerEnd="url(#a2)"/>

      {/* CRM — Database icon */}
      <rect x="240" y="55" width="48" height="48" rx="11" {...BOX}/>
      <g transform="translate(252,67) scale(1.08)" {...ICO}>
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5"/>
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
      </g>
      <text x="264" y="121" {...LBL}>CRM</text>

      <path d="M288,79 L348,79" {...ARR} markerEnd="url(#a2)"/>

      {/* Gmail */}
      <rect x="348" y="55" width="48" height="48" rx="11" {...BOX}/>
      <g transform="translate(360,67) scale(1.08)" {...ICO}>
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M22,6 L12,13 L2,6"/>
      </g>
      <text x="372" y="121" {...LBL}>Gmail</text>
    </svg>
  );
}

/** Card 3 — Vipps → n8n → Fiken → Gmail */
function Card3SVG() {
  return (
    <svg viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <marker id="a3" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0.5 L6,3.5 L0,6.5Z" fill="rgba(255,255,255,0.35)"/>
        </marker>
      </defs>

      {/* Vipps — CreditCard icon */}
      <rect x="24" y="55" width="48" height="48" rx="11" {...BOX}/>
      <g transform="translate(36,67) scale(1.08)" {...ICO}>
        <rect x="1" y="4" width="22" height="16" rx="2"/>
        <line x1="1"  y1="10" x2="23" y2="10"/>
        <line x1="5"  y1="15" x2="9"  y2="15"/>
        <line x1="11" y1="15" x2="13" y2="15"/>
      </g>
      <text x="48" y="121" {...LBL}>Vipps</text>

      <path d="M72,79 L132,79" {...ARR} markerEnd="url(#a3)"/>

      {/* n8n */}
      <rect x="132" y="55" width="48" height="48" rx="11" {...BOX}/>
      <text x="156" y="85" textAnchor="middle" fontSize="17" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif">n8n</text>
      <text x="156" y="121" {...LBL}>n8n</text>

      <path d="M180,79 L240,79" {...ARR} markerEnd="url(#a3)"/>

      {/* Fiken — BookOpen icon */}
      <rect x="240" y="55" width="48" height="48" rx="11" {...BOX}/>
      <g transform="translate(252,67) scale(1.08)" {...ICO}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </g>
      <text x="264" y="121" {...LBL}>Fiken</text>

      <path d="M288,79 L348,79" {...ARR} markerEnd="url(#a3)"/>

      {/* Gmail */}
      <rect x="348" y="55" width="48" height="48" rx="11" {...BOX}/>
      <g transform="translate(360,67) scale(1.08)" {...ICO}>
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M22,6 L12,13 L2,6"/>
      </g>
      <text x="372" y="121" {...LBL}>Gmail</text>
    </svg>
  );
}

const CARD_SVGS = [<Card1SVG />, <Card2SVG />, <Card3SVG />];

/* ─── CountUp stat ──────────────────────────────────────────────── */

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

/* ─── Section ───────────────────────────────────────────────────── */

export default function Cases() {
  const { t } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = t('cases.testimonials', { returnObjects: true }) as { quote: string; author: string }[];
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
                whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
                className="card-base overflow-hidden rounded-[20px] p-0 group cursor-default"
                style={{ borderColor: 'rgba(255,255,255,0.25)', borderLeft: '2px solid rgba(200,200,200,0.5)' }}
              >
                {/* SVG flow diagram */}
                <div className="overflow-hidden" style={{ height: 180, background: '#0A0A0A' }}>
                  {CARD_SVGS[i]}
                </div>

                <div className="px-6 pt-4 pb-6">
                  <span className="inline-block text-[11px] px-2.5 py-1 rounded-full text-foreground border border-border mb-4">
                    {t(`cases.${key}.badge`)}
                  </span>
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{t(`cases.${key}.title`)}</h3>
                  <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-surface-elevated border border-border/50 rounded-md px-2 py-1 mb-4">
                    <span className="opacity-60">→</span> {t(`cases.${key}.audience`)}
                  </p>
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
          <h2 className="section-title">{t('cases.testimonialsTitle1')}</h2>
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
              <p className="text-sm font-medium text-foreground">{testimonials[currentTestimonial]?.author}</p>
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
