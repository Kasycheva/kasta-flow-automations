import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Plus, HelpCircle } from 'lucide-react';
import SectionReveal from '../ui/SectionReveal';

export default function FAQ() {
  const { t, i18n } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = t('faq.items', { returnObjects: true }) as { q: string; a: string }[];
  const chatMessages = t('faq.chatMessages', { returnObjects: true }) as { from: string; text: string }[];
  const chatRef = useRef<HTMLDivElement>(null);
  const chatInView = useInView(chatRef, { once: true, margin: '-80px 0px' });
  const EASE = [0.23, 1, 0.32, 1] as const;

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div key={i18n.language} className="text-center mb-16">
          <motion.span
            className="section-badge inline-flex items-center gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '0px' }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <HelpCircle size={12} />
            {t('faq.badge')}
          </motion.span>
          <SectionReveal as="h2" className="section-title" delay={0.1}>
            {`${t('faq.title1')} ${t('faq.title2')}`}
          </SectionReveal>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          >
            {t('faq.subtitle')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Accordion */}
          <div className="lg:col-span-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="rounded-[12px] mb-2 overflow-hidden transition-all duration-300"
                style={{
                  border: openIndex === i ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.2)',
                  ...(openIndex === i && { borderLeft: '2px solid rgba(200,200,200,0.4)' }),
                }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full py-5 px-5 flex items-center justify-between text-left"
                >
                  <span className="text-[17px] font-heading font-medium text-foreground pr-4">{item.q}</span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0"
                  >
                    <Plus size={18} className="text-muted-foreground" />
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-[15px] text-muted-foreground leading-[1.7] text-center">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Chat mockup */}
          <motion.div
            ref={chatRef}
            className="lg:col-span-2 hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={chatInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="bg-surface border border-border rounded-[20px] p-6 sticky top-24">
              <div className="space-y-4">
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.4 }}
                    className={`flex ${msg.from === 'studio' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.from === 'studio'
                        ? 'bg-foreground text-background'
                        : 'bg-surface-elevated text-muted-foreground'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">{t('faq.chatStatus')}</p>
              <div className="mt-4 text-center">
                <span className="text-xs px-3 py-1.5 rounded-full bg-surface-elevated border border-border text-muted-foreground">
                  {t('faq.chatBadge')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">{t('faq.bottomCta')}</p>
          <a href="#contact" className="btn-outline">{t('faq.bottomCtaLink')}</a>
        </div>
      </div>
    </section>
  );
}


