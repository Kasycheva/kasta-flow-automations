import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export default function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([]);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 4000);
    const hide = setTimeout(() => setShowTooltip(false), 9000);
    return () => { clearTimeout(timer); clearTimeout(hide); };
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setShowTooltip(false);
    if (messages.length === 0) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages([{ from: 'bot', text: t('chat.welcome') }]);
      }, 1500);
    }
  };

  const handleQuickReply = (reply: string) => {
    setShowQuickReplies(false);
    setMessages(prev => [...prev, { from: 'user', text: reply }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        from: 'bot',
        text: 'Thank you for your interest! Please fill out our audit form below and we\'ll get back to you within 48 hours. 👇',
      }]);
    }, 1500);
  };

  const quickReplies = t('chat.quickReplies', { returnObjects: true }) as string[];

  return (
    <>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-[9999] bg-surface border border-border rounded-xl px-4 py-2.5 text-sm text-foreground shadow-lg max-w-[220px]"
            onClick={() => { setShowTooltip(false); handleOpen(); }}
          >
            {t('chat.tooltip')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <MessageCircle size={24} className="text-background" />
        </motion.button>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 z-[9999] w-[380px] h-[520px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-48px)] bg-background border border-border rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="bg-surface border-b border-border px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 100 100">
                  <text x="50" y="70" textAnchor="middle" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="52" fill="hsl(0 0% 96%)">KF</text>
                </svg>
                <span className="text-sm text-foreground font-medium">Kasta Flow Studio</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-kasta-green" />
                  {t('chat.online')}
                </span>
                <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.from === 'user' ? 'bg-foreground text-background' : 'bg-surface text-foreground'
                  }`}>{msg.text}</div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-surface rounded-2xl px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              {showQuickReplies && messages.length > 0 && !typing && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {quickReplies.map((reply, i) => (
                    <button key={i} onClick={() => handleQuickReply(reply)}
                      className="text-xs px-3 py-1.5 rounded-full border border-border text-foreground hover:bg-surface transition-colors">
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
