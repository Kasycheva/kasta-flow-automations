import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { trackEvent } from '../../lib/analytics';


interface Message {
  role: 'user' | 'assistant';
  content: string;
}

function containsFormMention(text: string): boolean {
  // Removed \b boundaries to catch Russian/Ukrainian endings (форму, форме, заполните, анкету etc)
  return /(form|skjema|fill out|fyll ut|форм|заполн|анкет)/i.test(text);
}

/** Detect email addresses in a string */
function containsEmail(text: string): boolean {
  return /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
}

export default function ChatWidget() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasShownTooltip, setHasShownTooltip] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState('');
  const [showCta, setShowCta] = useState(false);
  const [emailCaptured, setEmailCaptured] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 4000);
    const hide = setTimeout(() => { setShowTooltip(false); setHasShownTooltip(true); }, 9000);
    return () => { clearTimeout(timer); clearTimeout(hide); };
  }, []);

  // Periodic reminder: show tooltip for 2s every 35s, up to 4 times, on all devices
  useEffect(() => {
    if (!hasShownTooltip || open) return;
    let count = 0;
    const interval = setInterval(() => {
      if (open) return;
      count++;
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      if (count >= 4) clearInterval(interval);
    }, 35000);
    return () => clearInterval(interval);
  }, [hasShownTooltip, open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chat_history', JSON.stringify(messages));
      // Also store for the contact form to read
      sessionStorage.setItem('chat_transcript_for_form', JSON.stringify(messages));
    }
  }, [messages]);

  const handleOpen = (openSource: 'button' | 'tooltip' = 'button') => {
    if (!open) {
      trackEvent('chat_open', { open_source: openSource });
    }
    setOpen(true);
    setShowTooltip(false);
    if (messages.length === 0) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        const welcome: Message = { role: 'assistant', content: t('chat.welcome') };
        setMessages([welcome]);
        sessionStorage.setItem('chat_history', JSON.stringify([welcome]));
      }, 800);
    }
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || typing) return;

    setInput('');
    setError('');
    const userMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setTyping(true);

    // Detect email in user message
    if (containsEmail(text) && !emailCaptured) {
      setEmailCaptured(true);

      // Auto-capture: silently send the transcript to email right away
      const capturePayload = {
        _subject: "Live Chat Auto-Capture (Email Provided)",
        _template: "box",
        _cc: "kasycheva00@ukr.net",
        emailCapturedMessage: text,
        chatTranscript: JSON.stringify(updatedMessages),
        note: "User provided their email in the live chat. This is an auto-capture to ensure the lead is not lost."
      };
      
      fetch("https://formsubmit.co/ajax/kastaflow.studio@gmail.com", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(capturePayload)
      }).catch(console.error);
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error === 'rate_limit' ? 'rate_limit' : 'api_error');
      }

      const data = await response.json();
      const reply: string = data.reply ?? t('chat.error');

      const assistantMsg: Message = { role: 'assistant', content: reply };
      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      sessionStorage.setItem('chat_history', JSON.stringify(finalMessages));

      if (containsFormMention(reply)) {
        setShowCta(true);
      }
    } catch (err) {
      const isRateLimit = err instanceof Error && err.message === 'rate_limit';
      setError(isRateLimit ? t('chat.errorRateLimit') : t('chat.error'));
    } finally {
      setTyping(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToContact = () => {
    // Store transcript in sessionStorage for the contact form
    sessionStorage.setItem('chat_transcript_for_form', JSON.stringify(messages));
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  return (
    <>
      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[100px] right-6 z-[9999] cursor-pointer"
            onClick={() => { setShowTooltip(false); handleOpen('tooltip'); }}
          >
            <div style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#F5F5F5',
              fontSize: '13px',
              maxWidth: '200px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            }}>
              {t('chat.tooltip')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      {!open && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          onClick={() => handleOpen('button')}
          onMouseEnter={() => { if (hasShownTooltip) setShowTooltip(true); }}
          onMouseLeave={() => { if (hasShownTooltip) setShowTooltip(false); }}
          aria-label="Open chat"
          style={{
            position: 'fixed',
            bottom: '28px',
            right: '24px',
            zIndex: 9999,
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <MessageCircle size={22} color="#F5F5F5" />
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              bottom: '28px',
              right: '24px',
              zIndex: 9999,
              width: '360px',
              height: '480px',
              maxWidth: 'calc(100vw - 32px)',
              maxHeight: 'calc(100vh - 32px)',
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '20px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '14px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="20" height="20" viewBox="0 0 100 100" aria-hidden="true">
                  <text x="50" y="70" textAnchor="middle" fontFamily="Syne, sans-serif" fontWeight="800" fontSize="52" fill="#F5F5F5">KF</text>
                </svg>
                <span style={{ color: '#F5F5F5', fontSize: '14px', fontWeight: 500 }}>
                  {t('chat.title')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'rgba(245,245,245,0.5)' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                  {t('chat.online')}
                </span>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(245,245,245,0.5)', display: 'flex', alignItems: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    background: msg.role === 'user' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                    color: '#F5F5F5',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Email captured confirmation */}
              {emailCaptured && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '8px 12px',
                    borderRadius: '12px 12px 12px 4px',
                    background: 'rgba(74, 222, 128, 0.12)',
                    color: '#4ade80',
                    fontSize: '12px',
                  }}>
                    {t('chat.emailCaptured')}
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px 12px 12px 4px',
                    background: 'rgba(255,255,255,0.05)',
                    display: 'flex',
                    gap: '5px',
                    alignItems: 'center',
                  }}>
                    {[0, 150, 300].map((delay) => (
                      <span key={delay} style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'rgba(245,245,245,0.4)',
                        display: 'inline-block',
                        animation: 'bounce 1.2s infinite',
                        animationDelay: `${delay}ms`,
                      }} />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA button */}
              {showCta && !typing && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <button
                    onClick={scrollToContact}
                    style={{
                      background: '#F5F5F5',
                      color: '#111111',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '10px 20px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                      maxWidth: '82%',
                    }}
                  >
                    {t('chat.formCta')}
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: '12px 12px 12px 4px',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#fca5a5',
                    fontSize: '13px',
                  }}>
                    {error}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              flexShrink: 0,
            }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('chat.placeholder')}
                disabled={typing}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  color: '#F5F5F5',
                  fontSize: '14px',
                  outline: 'none',
                  opacity: typing ? 0.6 : 1,
                }}
              />
              <button
                onClick={sendMessage}
                disabled={typing || !input.trim()}
                aria-label="Send message"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#F5F5F5',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: typing || !input.trim() ? 'not-allowed' : 'pointer',
                  opacity: typing || !input.trim() ? 0.4 : 1,
                  flexShrink: 0,
                  transition: 'opacity 0.15s',
                }}
              >
                <Send size={16} color="#111111" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
