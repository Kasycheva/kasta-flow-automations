import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Mail, ChevronDown, Linkedin, MessageCircle, Send, Facebook, FileSearch } from 'lucide-react';
import SectionReveal from '../ui/SectionReveal';

const EASE = [0.23, 1, 0.32, 1] as const;

function getChannelIcon(ch: string) {
  const l = ch.toLowerCase();
  if (l.includes('email') || l.includes('e-post')) return Mail;
  if (l.includes('whatsapp'))  return MessageCircle;
  if (l.includes('linkedin'))  return Linkedin;
  if (l.includes('telegram'))  return Send;
  if (l.includes('facebook'))  return Facebook;
  return null;
}

// Brand SVG icons — WhatsApp and Telegram don't exist in lucide
const WhatsAppIcon = ({ size = 28, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const TelegramIcon = ({ size = 28, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

// ── Typewriter hook ──────────────────────────────────────────────────────────

function useTypewriter(examples: string[], active: boolean): string {
  const [text, setText] = useState('');
  const [exIdx, setExIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing');

  useEffect(() => {
    if (!active) {
      setText('');
      setExIdx(0);
      setCharIdx(0);
      setPhase('typing');
      return;
    }
    const current = examples[exIdx % examples.length];
    let timer: ReturnType<typeof setTimeout>;
    if (phase === 'typing') {
      if (charIdx < current.length) {
        timer = setTimeout(() => {
          setText(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, 65 + Math.random() * 55);
      } else {
        timer = setTimeout(() => setPhase('pausing'), 1800);
      }
    } else if (phase === 'pausing') {
      timer = setTimeout(() => setPhase('deleting'), 400);
    } else {
      if (charIdx > 0) {
        timer = setTimeout(() => {
          setText(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        }, 35);
      } else {
        timer = setTimeout(() => {
          setExIdx(i => (i + 1) % examples.length);
          setPhase('typing');
        }, 350);
      }
    }
    return () => clearTimeout(timer);
  }, [active, examples, exIdx, charIdx, phase]);

  return text;
}

// ── AnimatedInput ────────────────────────────────────────────────────────────

interface AnimatedInputProps {
  examples: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearError?: () => void;
  type?: string;
  className?: string;
  name?: string;
  autoComplete?: string;
}

function AnimatedInput({ examples, value, onChange, onClearError, type = 'text', className, ...rest }: AnimatedInputProps) {
  const [focused, setFocused] = useState(false);
  const typed = useTypewriter(examples, !value && !focused);
  return (
    <input
      type={type}
      placeholder={typed}
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={className}
      {...rest}
    />
  );
}

// ── Placeholder example data ─────────────────────────────────────────────────

const NAME_EXAMPLES  = ['Erik Andersen', 'Anna Bakke', 'Lars Hansen'];
const EMAIL_EXAMPLES = ['erik@bedriften.no', 'anna@firma.no', 'lars@konsulent.no'];
const PHONE_EXAMPLES = ['+47 901 23 456', '+47 456 78 901'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── Contact ──────────────────────────────────────────────────────────────────

export default function Contact() {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<'form' | 'voice'>('form');
  // Written form
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', teamSize: '',
    services: [] as string[], description: '', channel: '', conditionalContact: '',
  });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);
  const serviceDropdownRef = useRef<HTMLDivElement>(null);

  // Voice form
  const [recording, setRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [transcript, setTranscript] = useState('');
  const transcriptRef = useRef('');
  const [recordingLang, setRecordingLang] = useState<'en-US' | 'nb-NO'>(
    () => i18n.language === 'no' ? 'nb-NO' : 'en-US',
  );
  const [punctuating, setPunctuating] = useState(false);
  const [voiceName, setVoiceName] = useState('');
  const [voiceEmail, setVoiceEmail] = useState('');
  const [voicePhone, setVoicePhone] = useState('');
  const [voiceChannel, setVoiceChannel] = useState('');
  const [voiceConditionalContact, setVoiceConditionalContact] = useState('');
  const [voiceErrors, setVoiceErrors] = useState({ name: '', email: '', phone: '' });

  const teamOptions    = t('contact.teamOptions', { returnObjects: true }) as string[];
  const serviceOptions = t('contact.serviceOptions', { returnObjects: true }) as string[];
  const channels       = t('contact.channels', { returnObjects: true }) as string[];

  const inputClass   = 'w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-border-hover transition-colors';
  const triggerClass = 'w-full bg-background border border-border rounded-xl px-4 py-3 text-sm flex justify-between items-center focus:outline-none focus:border-border-hover transition-colors';
  const labelReq     = 'text-sm font-medium text-foreground mb-2 block';
  const labelOpt     = 'text-sm text-muted-foreground mb-2 block';
  const asterisk     = <span className="text-foreground ml-0.5">*</span>;

  // Close service dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target as Node)) {
        setServiceDropdownOpen(false);
      }
    };
    if (serviceDropdownOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [serviceDropdownOpen]);

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleChannelChange = (channel: string) => {
    setFormData(prev => ({
      ...prev,
      channel,
      conditionalContact: channel.includes('WhatsApp') ? prev.phone : '',
    }));
  };

  const handleVoiceChannelChange = (channel: string) => {
    setVoiceChannel(channel);
    setVoiceConditionalContact(channel.includes('WhatsApp') ? voicePhone : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = { name: '', email: '', phone: '' };
    if (formData.name.trim().length < 2)  newErrors.name  = t('contact.nameError');
    if (!isValidEmail(formData.email))     newErrors.email = t('contact.emailError');
    if (!formData.phone.trim())            newErrors.phone = t('contact.phoneError');
    setErrors(newErrors);
    if (newErrors.name || newErrors.email || newErrors.phone) return;

    setSending(true);
    const chatTranscript = sessionStorage.getItem('chat_transcript_for_form') || '';
    try {
      const res = await fetch('https://formsubmit.co/ajax/kastaflow.studio@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'New lead from Kasta Flow Studio',
          _template: 'box',
          _cc: 'kasycheva00@ukr.net',
          ...formData,
          chatTranscript,
        }),
      });
      if (!res.ok) console.error('Formsubmit error', await res.text());
    } catch (err) {
      console.error('Formsubmit fetch failed', err);
    }
    sessionStorage.removeItem('chat_transcript_for_form');
    setSending(false);
    setSent(true);
  };

  const handleVoiceSubmit = async () => {
    const newErrors = { name: '', email: '', phone: '' };
    if (voiceName.trim().length < 2)  newErrors.name  = t('contact.nameError');
    if (!isValidEmail(voiceEmail))    newErrors.email = t('contact.emailError');
    if (!voicePhone.trim())           newErrors.phone = t('contact.phoneError');
    setVoiceErrors(newErrors);
    if (newErrors.name || newErrors.email || newErrors.phone) return;

    setSending(true);
    const chatTranscript = sessionStorage.getItem('chat_transcript_for_form') || '';
    try {
      const res = await fetch('https://formsubmit.co/ajax/kastaflow.studio@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          _subject: 'New voice lead from Kasta Flow Studio',
          _template: 'box',
          _cc: 'kasycheva00@ukr.net',
          name: voiceName, email: voiceEmail, phone: voicePhone,
          channel: voiceChannel, conditionalContact: voiceConditionalContact,
          voiceTranscript: transcript, chatTranscript,
        }),
      });
      if (!res.ok) console.error('Formsubmit error', await res.text());
    } catch (err) {
      console.error('Formsubmit fetch failed', err);
    }
    sessionStorage.removeItem('chat_transcript_for_form');
    setSending(false);
    setSent(true);
  };

  const handleReRecord = () => {
    transcriptRef.current = '';
    setTranscript('');
    setRecording(false);
    setRecordingComplete(false);
  };

  const toggleRecording = () => {
    if (!recording) {
      try {
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) { setVoiceErrors(p => ({ ...p, name: t('contact.voiceNotSupported') })); return; }

        const isIOS = /iP(hone|od|ad)/.test(navigator.userAgent);
        const recognition = new SR();
        recognition.lang = recordingLang;
        // iOS Safari terminates continuous recognition after silence — restart manually
        recognition.continuous = !isIOS;
        recognition.interimResults = !isIOS;

        const stopFlag = { current: false };
        (window as any).__recognitionStop = () => { stopFlag.current = true; recognition.stop(); };

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) text += event.results[i][0].transcript + ' ';
          transcriptRef.current = (transcriptRef.current + ' ' + text).trim();
          setTranscript(transcriptRef.current);
        };

        const finalize = async () => {
          const finalText = transcriptRef.current;
          setTranscript(finalText);
          setRecording(false);
          setRecordingComplete(true);
          if (finalText.trim()) {
            setPunctuating(true);
            try {
              const res = await fetch('/api/punctuate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: finalText, lang: recordingLang }),
              });
              const data = await res.json();
              if (data.result) setTranscript(data.result);
            } catch {
              // keep original text on network error
            } finally {
              setPunctuating(false);
            }
          }
        };

        recognition.onend = () => {
          if (isIOS && !stopFlag.current) {
            // iOS killed recognition due to silence — restart to continue
            try { recognition.start(); } catch { finalize(); }
          } else {
            finalize();
          }
        };

        recognition.onerror = (event: any) => {
          if (event.error === 'no-speech' && isIOS && !stopFlag.current) return; // iOS fires this on silence, ignore
          console.error('SR error:', event.error);
          if (!stopFlag.current) finalize();
        };

        recognition.start();
        (window as any).__recognition = recognition;
        transcriptRef.current = '';
        setTranscript('');
        setRecording(true);
        setRecordingComplete(false);
      } catch { alert('Speech recognition error'); }
    } else {
      (window as any).__recognitionStop?.();
    }
  };

  const voiceSubmitDisabled = sending
    || punctuating
    || voiceName.trim().length < 2
    || !isValidEmail(voiceEmail)
    || !voicePhone.trim()
    || !transcript.trim();

  const renderConditional = (channel: string, value: string, onChange: (v: string) => void) => {
    if (channel.includes('WhatsApp')) return (
      <div><label className={labelOpt}>{t('contact.whatsappContactLabel')}</label>
        <input type="tel" placeholder={t('contact.whatsappContactPlaceholder')} value={value} onChange={e => onChange(e.target.value)} className={inputClass} /></div>
    );
    if (channel.includes('LinkedIn')) return (
      <div><label className={labelOpt}>{t('contact.linkedinContactLabel')}</label>
        <input type="url" placeholder={t('contact.linkedinContactPlaceholder')} value={value} onChange={e => onChange(e.target.value)} className={inputClass} /></div>
    );
    if (channel.includes('Telegram')) return (
      <div><label className={labelOpt}>{t('contact.telegramContactLabel')}</label>
        <input type="text" placeholder={t('contact.telegramContactPlaceholder')} value={value} onChange={e => onChange(e.target.value)} className={inputClass} /></div>
    );
    if (channel.includes('Facebook')) return (
      <div><label className={labelOpt}>{t('contact.facebookContactLabel')}</label>
        <input type="text" placeholder={t('contact.facebookContactPlaceholder')} value={value} onChange={e => onChange(e.target.value)} className={inputClass} /></div>
    );
    return null;
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-surface to-background">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div key={i18n.language} className="text-center mb-16">
          <motion.span
            className="section-badge inline-flex items-center gap-1.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '0px' }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <FileSearch size={12} />
            {t('contact.badge')}
          </motion.span>
          <SectionReveal as="h2" className="section-title" delay={0.1}>
            {`${t('contact.title1')} ${t('contact.title2')}`}
          </SectionReveal>
          <motion.p
            className="section-subtitle"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="flex justify-center gap-3">
            <button onClick={() => setMode('form')}
              className={`flex-1 max-w-[220px] px-6 py-3 rounded-full text-sm font-medium transition-all text-center ${mode === 'form' ? 'bg-foreground text-background' : 'border border-foreground text-foreground'}`}>
              <span>{t('contact.formToggle')}</span>
              <span className="block text-xs opacity-70 mt-0.5">{t('contact.formToggleSub')}</span>
            </button>
            <button onClick={() => setMode('voice')}
              className={`flex-1 max-w-[220px] px-6 py-3 rounded-full text-sm font-medium transition-all text-center ${mode === 'voice' ? 'bg-foreground text-background' : 'border border-foreground text-foreground'}`}>
              <span>{t('contact.voiceToggle')}</span>
              <span className="block text-xs opacity-70 mt-0.5">{t('contact.voiceToggleSub')}</span>
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{t('contact.tabHint')}</p>
        </div>

        <AnimatePresence mode="wait">

          {/* ── Written form ── */}
          {mode === 'form' ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-[680px] mx-auto card-base rounded-3xl p-8 md:p-12">
              {sent ? (
                <div className="text-center py-12">
                  <p className="text-xl text-foreground font-heading font-bold">{t('contact.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-6">
                  <input type="hidden" name="chatTranscript"
                    value={typeof window !== 'undefined' ? (sessionStorage.getItem('chat_transcript_for_form') ?? '') : ''} />

                  {/* Full name * */}
                  <div>
                    <label className={labelReq}>{t('contact.nameLabel')}{asterisk}</label>
                    <AnimatedInput examples={NAME_EXAMPLES} type="text" value={formData.name}
                      onChange={e => { setFormData(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: '' })); }}
                      className={inputClass} autoComplete="name" />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email * */}
                  <div>
                    <label className={labelReq}>{t('contact.emailLabel')}{asterisk}</label>
                    <AnimatedInput examples={EMAIL_EXAMPLES} type="email" value={formData.email}
                      onChange={e => { setFormData(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })); }}
                      className={inputClass} autoComplete="email" />
                    {errors.email
                      ? <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      : <p className="text-xs text-muted-foreground mt-1">{t('contact.emailHelper')}</p>}
                  </div>

                  {/* Phone * */}
                  <div>
                    <label className={labelReq}>{t('contact.phoneLabel')}{asterisk}</label>
                    <AnimatedInput examples={PHONE_EXAMPLES} type="tel" value={formData.phone}
                      onChange={e => { setFormData(p => ({ ...p, phone: e.target.value })); setErrors(p => ({ ...p, phone: '' })); }}
                      className={inputClass} autoComplete="tel" />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  {/* Company */}
                  <div>
                    <label className={labelOpt}>{t('contact.companyLabel')}</label>
                    <input type="text" placeholder={t('contact.companyPlaceholder')} value={formData.company}
                      onChange={e => setFormData(p => ({ ...p, company: e.target.value }))} className={inputClass} />
                  </div>

                  {/* Team size */}
                  <div>
                    <label className={labelOpt}>{t('contact.teamLabel')}</label>
                    <select value={formData.teamSize} onChange={e => setFormData(p => ({ ...p, teamSize: e.target.value }))} className={inputClass}>
                      <option value="">—</option>
                      {teamOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Services multiselect */}
                  <div ref={serviceDropdownRef} className="relative">
                    <label className={labelOpt}>{t('contact.interestLabel')}</label>
                    <button type="button" onClick={() => setServiceDropdownOpen(p => !p)} className={triggerClass}>
                      <span className={formData.services.length > 0 ? 'text-foreground' : 'italic text-muted-foreground'}>
                        {formData.services.length > 0
                          ? t('contact.servicesSelected', { count: formData.services.length })
                          : t('contact.serviceSelectPlaceholder')}
                      </span>
                      <ChevronDown size={16} className={`shrink-0 ml-2 transition-transform text-muted-foreground ${serviceDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {serviceDropdownOpen && (
                      <div className="absolute z-20 top-full mt-1 w-full bg-background border border-border rounded-xl p-4 shadow-lg">
                        <div className="grid grid-cols-2 gap-2">
                          {serviceOptions.map(opt => (
                            <label key={opt} className="flex items-start gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                              <input type="checkbox" checked={formData.services.includes(opt)}
                                onChange={() => handleServiceToggle(opt)}
                                className="rounded border-border bg-background accent-accent shrink-0 mt-0.5" />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className={labelOpt}>{t('contact.descLabel')}</label>
                    <textarea placeholder={t('contact.descPlaceholder')} value={formData.description}
                      onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      className={`${inputClass} min-h-[120px] resize-y`} />
                  </div>

                  {/* Channel */}
                  <div>
                    <label className={labelOpt}>{t('contact.channelLabel')}</label>
                    <div className="flex gap-3 flex-wrap">
                      {channels.map(ch => {
                        const ChIcon = getChannelIcon(ch);
                        return (
                          <label key={ch} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                            <input type="radio" name="channel" value={ch} checked={formData.channel === ch}
                              onChange={() => handleChannelChange(ch)} className="accent-accent" />
                            {ChIcon && <ChIcon size={14} />}
                            {ch}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {formData.channel && renderConditional(formData.channel, formData.conditionalContact, v => setFormData(p => ({ ...p, conditionalContact: v })))}

                  <button type="submit" disabled={sending}
                    className="w-full bg-foreground text-background rounded-xl py-3.5 font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50">
                    {sending ? t('contact.sending') : t('contact.submit')}
                  </button>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{t('contact.gdpr')}</p>
                </form>
              )}
            </motion.div>

          ) : (

            /* ── Voice form ── */
            <motion.div key="voice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-[680px] mx-auto card-base rounded-3xl p-8 md:p-12">
              {sent ? (
                <div className="text-center py-12">
                  <p className="text-xl text-foreground font-heading font-bold">{t('contact.success')}</p>
                </div>
              ) : (
                <div className="space-y-6">

                  {/* Full name * */}
                  <div>
                    <label className={labelReq}>{t('contact.nameLabel')}{asterisk}</label>
                    <AnimatedInput examples={NAME_EXAMPLES} type="text" value={voiceName}
                      onChange={e => { setVoiceName(e.target.value); setVoiceErrors(p => ({ ...p, name: '' })); }}
                      className={inputClass} autoComplete="name" />
                    {voiceErrors.name && <p className="text-xs text-red-500 mt-1">{voiceErrors.name}</p>}
                  </div>

                  {/* Email * */}
                  <div>
                    <label className={labelReq}>{t('contact.emailLabel')}{asterisk}</label>
                    <AnimatedInput examples={EMAIL_EXAMPLES} type="email" value={voiceEmail}
                      onChange={e => { setVoiceEmail(e.target.value); setVoiceErrors(p => ({ ...p, email: '' })); }}
                      className={inputClass} autoComplete="email" />
                    {voiceErrors.email && <p className="text-xs text-red-500 mt-1">{voiceErrors.email}</p>}
                  </div>

                  {/* Phone * */}
                  <div>
                    <label className={labelReq}>{t('contact.phoneLabel')}{asterisk}</label>
                    <AnimatedInput examples={PHONE_EXAMPLES} type="tel" value={voicePhone}
                      onChange={e => {
                        setVoicePhone(e.target.value);
                        setVoiceErrors(p => ({ ...p, phone: '' }));
                        if (voiceChannel.includes('WhatsApp')) setVoiceConditionalContact(e.target.value);
                      }}
                      className={inputClass} autoComplete="tel" />
                    {voiceErrors.phone && <p className="text-xs text-red-500 mt-1">{voiceErrors.phone}</p>}
                  </div>

                  {/* Channel * */}
                  <div>
                    <label className={labelReq}>{t('contact.channelLabel')}{asterisk}</label>
                    <div className="flex gap-3 flex-wrap">
                      {channels.map(ch => {
                        const ChIcon = getChannelIcon(ch);
                        return (
                          <label key={ch} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                            <input type="radio" name="voiceChannel" value={ch} checked={voiceChannel === ch}
                              onChange={() => handleVoiceChannelChange(ch)} className="accent-accent" />
                            {ChIcon && <ChIcon size={14} />}
                            {ch}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {voiceChannel && renderConditional(voiceChannel, voiceConditionalContact, setVoiceConditionalContact)}

                  {/* Language selector */}
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-xs text-muted-foreground">{t('contact.voiceLangLabel')}</span>
                    <div className="flex gap-1">
                      {(['en-US', 'nb-NO'] as const).map(lang => (
                        <button key={lang} type="button"
                          onClick={() => setRecordingLang(lang)}
                          disabled={recording}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all disabled:cursor-not-allowed ${recordingLang === lang ? 'bg-foreground text-background' : 'border border-border text-muted-foreground hover:border-foreground'}`}>
                          {lang === 'en-US' ? t('contact.voiceLangEN') : t('contact.voiceLangNO')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recording area */}
                  {(() => {
                    const SR = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
                    if (!SR) {
                      return (
                        <div className="text-center rounded-2xl border border-border p-6 bg-surface">
                          <Mic size={28} className="text-muted-foreground mx-auto mb-3 opacity-50" />
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {t('contact.voiceNotSupportedMsg')}
                          </p>
                        </div>
                      );
                    }
                    return (
                      <div className="text-center">
                        <div className="relative inline-flex mb-4">
                          <button onClick={toggleRecording}
                            className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center transition-transform hover:scale-105">
                            <Mic size={32} className="text-background" />
                          </button>
                          {recording && (
                            <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-pulse-ring pointer-events-none" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {recording
                            ? t('contact.listening')
                            : recordingComplete
                              ? t('contact.recordingComplete')
                              : t('contact.tapToRecord')}
                        </p>
                      </div>
                    );
                  })()}

                  {/* Transcript area — live during recording, editable after */}
                  {(recording || recordingComplete) && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className={labelOpt}>
                          {recording ? t('contact.voiceLiveLabel') : t('contact.voiceTranscriptLabel')}
                        </label>
                        {recordingComplete && (
                          <button onClick={handleReRecord}
                            className="text-xs text-muted-foreground underline hover:text-foreground transition-colors">
                            {t('contact.reRecord')}
                          </button>
                        )}
                      </div>
                      <textarea
                        value={transcript}
                        onChange={e => !recording && setTranscript(e.target.value)}
                        placeholder={recording
                          ? t('contact.voiceLivePlaceholder')
                          : t('contact.voiceTranscriptPlaceholder')}
                        className={`${inputClass} min-h-[120px] resize-y ${recording ? 'opacity-60 cursor-default' : ''}`}
                      />
                      {punctuating && (
                        <p className="text-xs text-muted-foreground mt-2 animate-pulse">{t('contact.voicePunctuating')}</p>
                      )}
                      {recordingComplete && !transcript && !punctuating && (
                        <p className="text-xs text-muted-foreground mt-2">{t('contact.voiceNoSpeech')}</p>
                      )}
                    </div>
                  )}

                  <button onClick={handleVoiceSubmit} disabled={voiceSubmitDisabled}
                    className="w-full bg-foreground text-background rounded-xl py-3.5 font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50">
                    {sending ? t('contact.sending') : t('contact.sendVoice')}
                  </button>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{t('contact.gdpr')}</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 max-w-5xl mx-auto">
          {/* Email */}
          <motion.div
            initial={{ scale: 0, rotate: -8, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0 }}
            whileHover={{ scale: 1.03 }}
            className="card-base rounded-2xl p-7 flex flex-col items-center text-center gap-2">
            <Mail size={28} className="text-muted-foreground mb-1" />
            <h4 className="text-foreground font-medium">{t('contact.emailCard.title')}</h4>
            <a href="mailto:kastaflow.studio@gmail.com"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors break-all">
              {t('contact.emailCard.address')}
            </a>
            <p className="text-xs text-muted-foreground flex-1 flex items-center">{t('contact.emailCard.note')}</p>
            <a href="mailto:kastaflow.studio@gmail.com"
              className="btn-outline text-xs py-2 px-4">{t('contact.emailCard.cta')}</a>
          </motion.div>

          {/* WhatsApp */}
          <motion.div
            initial={{ scale: 0, rotate: -8, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.08 }}
            whileHover={{ scale: 1.03 }}
            className="card-base rounded-2xl p-7 flex flex-col items-center text-center gap-2">
            <WhatsAppIcon size={28} className="text-muted-foreground mb-1" />
            <h4 className="text-foreground font-medium">{t('contact.whatsappCard.title')}</h4>
            <p className="text-sm text-muted-foreground">{t('contact.whatsappCard.text')}</p>
            <p className="text-xs text-muted-foreground flex-1 flex items-center">{t('contact.whatsappCard.note')}</p>
            <a href="/whatsapp" target="_blank" rel="noopener noreferrer"
              className="btn-outline text-xs py-2 px-4">{t('contact.whatsappCard.cta')}</a>
          </motion.div>

          {/* Telegram */}
          <motion.div
            initial={{ scale: 0, rotate: -8, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.16 }}
            whileHover={{ scale: 1.03 }}
            className="card-base rounded-2xl p-7 flex flex-col items-center text-center gap-2">
            <TelegramIcon size={28} className="text-muted-foreground mb-1" />
            <h4 className="text-foreground font-medium">{t('contact.telegramCard.title')}</h4>
            <a href="https://t.me/kastaflow_assist_bot" target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('contact.telegramCard.username')}
            </a>
            <p className="text-xs text-muted-foreground flex-1 flex items-center">{t('contact.telegramCard.note')}</p>
            <a href="https://t.me/kastaflow_assist_bot" target="_blank" rel="noopener noreferrer"
              className="btn-outline text-xs py-2 px-4">{t('contact.telegramCard.cta')}</a>
          </motion.div>

          {/* LinkedIn */}
          <motion.div
            initial={{ scale: 0, rotate: -8, opacity: 0 }}
            whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.24 }}
            whileHover={{ scale: 1.03 }}
            className="card-base rounded-2xl p-7 flex flex-col items-center text-center gap-2">
            <Linkedin size={28} className="text-muted-foreground mb-1" />
            <h4 className="text-foreground font-medium">{t('contact.linkedinCard.title')}</h4>
            <a href="https://www.linkedin.com/in/maria-kasta-flow/" target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('contact.linkedinCard.handle')}
            </a>
            <p className="text-xs text-muted-foreground flex-1 flex items-center">{t('contact.linkedinCard.note')}</p>
            <a href="https://www.linkedin.com/in/maria-kasta-flow/" target="_blank" rel="noopener noreferrer"
              className="btn-outline text-xs py-2 px-4">{t('contact.linkedinCard.cta')}</a>
          </motion.div>
        </div>
        <p className="text-[13px] text-muted-foreground text-center mt-6">{t('contact.channelNote')}</p>
      </div>
    </section>
  );
}
