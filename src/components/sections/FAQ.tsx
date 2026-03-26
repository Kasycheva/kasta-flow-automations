import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

export default function FAQ() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = t('faq.items', { returnObjects: true }) as { q: string; a: string }[];
  const chatMessages = t('faq.chatMessages', { returnObjects: true }) as { from: string; text: string }[];

  return (
    <section id="faq" className="section-padding bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{t('faq.badge')}</span>
          <h2 className="section-title">{t('faq.title1')}<br />{t('faq.title2')}</h2>
          <p className="section-subtitle">{t('faq.subtitle')}</p>
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
                      <p className="px-5 pb-5 text-[15px] text-muted-foreground leading-[1.7]">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Chat mockup */}
          <div className="lg:col-span-2 hidden lg:block">
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
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">{t('faq.bottomCta')}</p>
          <a href="#contact" className="btn-outline">{t('faq.bottomCtaLink')}</a>
        </div>
      </div>
    </section>
  );
}
