import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import SectionReveal from '../ui/SectionReveal';

const EASE = [0.23, 1, 0.32, 1] as const;

/* ── SVG shimmer overlay ──────────────────────────────────────────── */
function SvgShimmer() {
  return (
    <motion.div
      className="absolute inset-y-0 w-1/2 pointer-events-none"
      style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)' }}
      initial={{ x: '-110%' }}
      whileInView={{ x: ['-110%', '210%'] }}
      viewport={{ once: false }}
      transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3.5 }}
    />
  );
}

/* ─── SVG shared styles ─────────────────────────────────────────── */

const BOX  = { fill: '#111111', stroke: 'rgba(255,255,255,0.13)', strokeWidth: 1.5 } as const;
const ICO  = { stroke: 'rgba(255,255,255,0.8)', strokeWidth: 1.8, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
const LBL  = { fontSize: 10, fill: 'rgba(255,255,255,0.55)', fontFamily: 'system-ui,sans-serif', textAnchor: 'middle' as const };
const ARR  = { stroke: 'rgba(255,255,255,0.4)', strokeWidth: 1.5, fill: 'none' } as const;

/* Arrow path — opacity fade, animate (not whileInView) for iOS Safari compat */
function AnimPath({ d, delay = 0, markerId }: { d: string; delay?: number; markerId: string }) {
  return (
    <motion.path
      d={d}
      {...ARR}
      markerEnd={`url(#${markerId})`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    />
  );
}

/* Animated data pulse — moves along the path to suggest automation */
function FlowPulse({ d, begin = '0s', duration = '3.2s' }: { d: string; begin?: string; duration?: string }) {
  return (
    <circle r="2.5" fill="rgba(255,255,255,0.9)" opacity="0.95">
      <animateMotion dur={duration} begin={begin} repeatCount="indefinite" path={d} />
      <animate attributeName="opacity" values="0;1;1;0" dur={duration} begin={begin} repeatCount="indefinite" />
    </circle>
  );
}

/* Node box — opacity only, animate (no scale/viewport for iOS Safari compat) */
function AnimNode({ x, y, w, h, rx, delay = 0 }: { x: number; y: number; w: number; h: number; rx: number; delay?: number }) {
  return (
    <motion.rect
      x={x} y={y} width={w} height={h} rx={rx}
      {...BOX}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, delay, ease: EASE }}
    />
  );
}

/* ─── SVG Flow Diagrams ─────────────────────────────────────────── */

/** Card 1 — 3 inputs branch into n8n → Calendar → Gmail */
function Card1SVG() {
  return (
    <svg viewBox="0 0 420 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <marker id="a1" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0,0.5 L6,3.5 L0,6.5Z" fill="rgba(255,255,255,0.35)"/>
        </marker>
      </defs>

      {/* Typeform */}
      <AnimNode x={24} y={25} w={38} h={38} rx={10} delay={0}/>
      <g transform="translate(33,34) scale(0.92)" {...ICO}>
        <line x1="2" y1="5" x2="22" y2="5"/>
        <line x1="2" y1="12" x2="18" y2="12"/>
        <line x1="2" y1="19" x2="13" y2="19"/>
      </g>

      {/* Phone */}
      <AnimNode x={24} y={71} w={38} h={38} rx={10} delay={0.05}/>
      <g transform="translate(33,80) scale(0.92)" {...ICO}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.38 2 2 0 0 1 3.64 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.63a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </g>

      {/* Chat */}
      <AnimNode x={24} y={117} w={38} h={38} rx={10} delay={0.1}/>
      <g transform="translate(33,126) scale(0.92)" {...ICO}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </g>

      {/* Arrows → n8n */}
      <AnimPath d="M62,44 C108,44 138,90 156,90"  delay={0.15} markerId="a1"/>
      <AnimPath d="M62,90 C102,90 132,90 156,90"  delay={0.2}  markerId="a1"/>
      <AnimPath d="M62,136 C108,136 138,90 156,90" delay={0.25} markerId="a1"/>
      <FlowPulse d="M62,44 C108,44 138,90 156,90" begin="0s" duration="2.8s" />
      <FlowPulse d="M62,90 C102,90 132,90 156,90" begin="0.45s" duration="2.8s" />
      <FlowPulse d="M62,136 C108,136 138,90 156,90" begin="0.9s" duration="2.8s" />

      {/* n8n */}
      <AnimNode x={156} y={63} w={54} h={54} rx={13} delay={0.3}/>
      <motion.text
        x="183" y="96" textAnchor="middle" fontSize="19" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.32 }}
      >n8n</motion.text>
      <motion.text
        {...LBL} x="183" y="130"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.33 }}
      >n8n</motion.text>

      {/* n8n → Calendar */}
      <AnimPath d="M210,90 L258,90" delay={0.4} markerId="a1"/>
      <FlowPulse d="M210,90 L258,90" begin="1.25s" duration="2.6s" />

      {/* Google Calendar */}
      <AnimNode x={258} y={66} w={48} h={48} rx={11} delay={0.45}/>
      <g transform="translate(270,78) scale(1.08)" {...ICO}>
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8"  y1="2" x2="8"  y2="6"/>
        <line x1="3"  y1="10" x2="21" y2="10"/>
      </g>
      <text x="282" y="128" {...LBL}>Google Calendar</text>

      {/* Calendar → Gmail */}
      <AnimPath d="M306,90 L342,90" delay={0.55} markerId="a1"/>
      <FlowPulse d="M306,90 L342,90" begin="1.8s" duration="2.4s" />

      {/* Gmail */}
      <AnimNode x={342} y={66} w={48} h={48} rx={11} delay={0.6}/>
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

      <AnimNode x={24} y={55} w={48} h={48} rx={11} delay={0}/>
      <g transform="translate(36,67) scale(1.08)" {...ICO}>
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8"  y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </g>
      <text x="48" y="121" {...LBL}>Landing page</text>

      <AnimPath d="M72,79 L132,79" delay={0.15} markerId="a2"/>
      <FlowPulse d="M72,79 L132,79" begin="0s" duration="2.6s" />

      <AnimNode x={132} y={55} w={48} h={48} rx={11} delay={0.2}/>
      <motion.text
        x="156" y="85" textAnchor="middle" fontSize="17" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
      >n8n</motion.text>
      <text x="156" y="121" {...LBL}>n8n</text>

      <AnimPath d="M180,79 L240,79" delay={0.35} markerId="a2"/>
      <FlowPulse d="M180,79 L240,79" begin="0.75s" duration="2.6s" />

      <AnimNode x={240} y={55} w={48} h={48} rx={11} delay={0.4}/>
      <g transform="translate(252,67) scale(1.08)" {...ICO}>
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 5v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5"/>
        <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
      </g>
      <text x="264" y="121" {...LBL}>CRM</text>

      <AnimPath d="M288,79 L348,79" delay={0.55} markerId="a2"/>
      <FlowPulse d="M288,79 L348,79" begin="1.45s" duration="2.6s" />

      <AnimNode x={348} y={55} w={48} h={48} rx={11} delay={0.6}/>
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

      <AnimNode x={24} y={55} w={48} h={48} rx={11} delay={0}/>
      <g transform="translate(36,67) scale(1.08)" {...ICO}>
        <rect x="1" y="4" width="22" height="16" rx="2"/>
        <line x1="1"  y1="10" x2="23" y2="10"/>
        <line x1="5"  y1="15" x2="9"  y2="15"/>
        <line x1="11" y1="15" x2="13" y2="15"/>
      </g>
      <text x="48" y="121" {...LBL}>Vipps</text>

      <AnimPath d="M72,79 L132,79" delay={0.15} markerId="a3"/>
      <FlowPulse d="M72,79 L132,79" begin="0s" duration="2.6s" />

      <AnimNode x={132} y={55} w={48} h={48} rx={11} delay={0.2}/>
      <motion.text
        x="156" y="85" textAnchor="middle" fontSize="17" fontWeight="700" fill="white" fontFamily="system-ui,sans-serif"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}
      >n8n</motion.text>
      <text x="156" y="121" {...LBL}>n8n</text>

      <AnimPath d="M180,79 L240,79" delay={0.35} markerId="a3"/>
      <FlowPulse d="M180,79 L240,79" begin="0.75s" duration="2.6s" />

      <AnimNode x={240} y={55} w={48} h={48} rx={11} delay={0.4}/>
      <g transform="translate(252,67) scale(1.08)" {...ICO}>
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </g>
      <text x="264" y="121" {...LBL}>Fiken</text>

      <AnimPath d="M288,79 L348,79" delay={0.55} markerId="a3"/>
      <FlowPulse d="M288,79 L348,79" begin="1.45s" duration="2.6s" />

      <AnimNode x={348} y={55} w={48} h={48} rx={11} delay={0.6}/>
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

function CountUpStat({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) {
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
        initial={{ opacity: 0, y: 14 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay, ease: EASE }}
        className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-1"
      >
        {value}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: delay + 0.15 }}
        className="text-sm text-muted-foreground"
      >
        {label}
      </motion.p>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────────────────── */

export default function Cases() {
  const { t, i18n } = useTranslation();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const testimonials = t('cases.testimonials', { returnObjects: true }) as { quote: string; author: string }[];
  const stats = t('cases.stats', { returnObjects: true }) as { value: string; label: string }[];
  const caseKeys = ['case1', 'case2', 'case3'] as const;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleScroll = () => {
    if (!hasScrolled) setHasScrolled(true);
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    setActiveCard(Math.round(progress * (caseKeys.length - 1)));
  };

  const scrollBy = (dir: 1 | -1) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.querySelector('[data-card]')?.clientWidth ?? 380;
    scrollRef.current.scrollBy({ left: dir * (cardWidth + 24), behavior: 'smooth' });
    setHasScrolled(true);
  };

  const scrollToCard = (index: number) => {
    if (!scrollRef.current) return;
    const cards = scrollRef.current.querySelectorAll('[data-card]');
    const card = cards[index] as HTMLElement;
    if (card) {
      // offsetLeft is relative to scrollRef, which already has px-4 padding applied
      scrollRef.current.scrollTo({ left: card.offsetLeft, behavior: 'smooth' });
    }
    setHasScrolled(true);
  };

  return (
    <section id="cases" className="section-padding bg-gradient-to-b from-background to-surface">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div key={i18n.language} className="text-center mb-16">
          <motion.span
            className="section-badge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            {t('cases.badge')}
          </motion.span>
          <SectionReveal as="h2" className="section-title" delay={0.1}>
            {`${t('cases.title1')} ${t('cases.title2')}`}
          </SectionReveal>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
          >
            {t('cases.subtitle')}
          </motion.p>
        </div>

        {/* Case cards — full-bleed on mobile/tablet, 3-col on desktop */}
        <div className="relative mb-20 -mx-4 md:-mx-8 lg:mx-0">

          {/* Scroll track */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-4 md:px-8 lg:px-0 lg:gap-6"
            style={{ WebkitOverflowScrolling: 'touch', scrollPaddingLeft: '1rem' }}
          >
            {caseKeys.map((key, i) => {
              const metrics = t(`cases.${key}.metrics`, { returnObjects: true }) as string[];
              const stack = t(`cases.${key}.stack`, { returnObjects: true }) as string[];

              return (
                <motion.div
                  key={key}
                  data-card=""
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
                  whileHover={{ y: -6, transition: { duration: 0.22, ease: 'easeOut' } }}
                  className="card-base overflow-hidden rounded-[20px] p-0 group cursor-default snap-start flex-shrink-0 w-[82vw] sm:w-[380px] lg:w-[calc((100%-3rem)/3)]"
                  style={{ borderColor: 'rgba(255,255,255,0.25)', borderLeft: '2px solid rgba(200,200,200,0.5)' }}
                >
                  <div className="overflow-hidden relative" style={{ height: 180, background: '#0A0A0A' }}>
                    {CARD_SVGS[i]}
                    <SvgShimmer />
                  </div>
                  <div className="px-5 pt-4 pb-6">
                    <span className="inline-block text-[11px] px-2.5 py-1 rounded-full text-foreground border border-border mb-4">
                      {t(`cases.${key}.badge`)}
                    </span>
                    <h3 className="text-base font-heading font-semibold text-foreground mb-2">{t(`cases.${key}.title`)}</h3>
                    <p className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-surface-elevated border border-border/50 rounded-md px-2 py-1 mb-3">
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

          {/* Navigation — same style as testimonials block */}
          <div className="flex items-center justify-center gap-4 mt-6 px-4 lg:px-0">
            <button
              type="button"
              aria-label="Previous case"
              onClick={() => scrollBy(-1)}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={16}/>
            </button>
            <div className="flex gap-2">
              {caseKeys.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToCard(i)}
                  aria-label={`Case ${i + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${i === activeCard ? 'bg-foreground' : 'bg-border'}`}
                />
              ))}
            </div>
            <button
              type="button"
              aria-label="Next case"
              onClick={() => scrollBy(1)}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight size={16}/>
            </button>
          </div>
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

        {/* Stats — staggered entrance */}
        <div className="bg-surface rounded-2xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <CountUpStat key={i} value={stat.value} label={stat.label} delay={i * 0.28} />
          ))}
        </div>
      </div>
    </section>
  );
}
