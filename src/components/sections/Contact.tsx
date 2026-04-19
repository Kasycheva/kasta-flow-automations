import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Mail, MessageCircle, Send as SendIcon } from 'lucide-react';

export default function Contact() {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'form' | 'voice'>('form');
  const [formData, setFormData] = useState({
    name: '', email: '', company: '', teamSize: '', services: [] as string[], description: '', channel: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  // Voice state
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceEmail, setVoiceEmail] = useState('');
  const [voiceChannel, setVoiceChannel] = useState('');

  const teamOptions = t('contact.teamOptions', { returnObjects: true }) as string[];
  const interestOptions = t('contact.interestOptions', { returnObjects: true }) as string[];
  const channels = t('contact.channels', { returnObjects: true }) as string[];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Read chat transcript from sessionStorage (set by ChatWidget)
    const chatTranscript = sessionStorage.getItem('chat_transcript_for_form') || '';

    // Build the full payload including chat history
    const payload = {
      ...formData,
      chatTranscript,
      voiceTranscript: transcript || '',
      voiceEmail: voiceEmail || '',
      voiceChannel: voiceChannel || '',
    };

    console.log('[Contact] Form submission payload:', payload);

    // Simulate submission (replace with actual API call)
    await new Promise(r => setTimeout(r, 1500));

    // Clear chat transcript after successful submit
    sessionStorage.removeItem('chat_transcript_for_form');

    setSending(false);
    setSent(true);
  };

  const toggleRecording = () => {
    if (!recording) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) {
          alert('Speech recognition is not supported in this browser.');
          return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = 0; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setTranscript(text);
        };
        recognition.start();
        (window as any).__recognition = recognition;
        setRecording(true);
      } catch {
        alert('Speech recognition error');
      }
    } else {
      (window as any).__recognition?.stop();
      setRecording(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-b from-surface to-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="section-badge">{t('contact.badge')}</span>
          <h2 className="section-title">{t('contact.title1')}<br />{t('contact.title2')}</h2>
          <p className="section-subtitle">{t('contact.subtitle')}</p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center gap-4 mb-12">
          <button onClick={() => setMode('form')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${mode === 'form' ? 'bg-foreground text-background' : 'border border-foreground text-foreground'}`}>
            <span>{t('contact.formToggle')}</span>
            <span className="block text-xs opacity-70 mt-0.5">{t('contact.formToggleSub')}</span>
          </button>
          <button onClick={() => setMode('voice')}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${mode === 'voice' ? 'bg-foreground text-background' : 'border border-foreground text-foreground'}`}>
            <span>{t('contact.voiceToggle')}</span>
            <span className="block text-xs opacity-70 mt-0.5">{t('contact.voiceToggleSub')}</span>
          </button>
        </div>

        <AnimatePresence mode="wait">
          {mode === 'form' ? (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-[680px] mx-auto card-base rounded-3xl p-8 md:p-12">
              {sent ? (
                <div className="text-center py-12">
                  <p className="text-xl text-foreground font-heading font-bold">{t('contact.success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Hidden field: chat transcript for manager review */}
                  <input type="hidden" name="chatTranscript" value={typeof window !== 'undefined' ? (sessionStorage.getItem('chat_transcript_for_form') ?? '') : ''} />
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">{t('contact.nameLabel')}</label>
                    <input type="text" required placeholder={t('contact.namePlaceholder')}
                      value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-border-hover transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">{t('contact.emailLabel')}</label>
                    <input type="email" required placeholder={t('contact.emailPlaceholder')}
                      value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-border-hover transition-colors" />
                    <p className="text-xs text-muted-foreground mt-1">{t('contact.emailHelper')}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">{t('contact.companyLabel')}</label>
                    <input type="text" placeholder="Kasta Flow Studio"
                      value={formData.company} onChange={e => setFormData(p => ({ ...p, company: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-border-hover transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">{t('contact.teamLabel')}</label>
                    <select value={formData.teamSize} onChange={e => setFormData(p => ({ ...p, teamSize: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm focus:outline-none focus:border-border-hover transition-colors">
                      <option value="">—</option>
                      {teamOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">{t('contact.interestLabel')}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map(opt => (
                        <label key={opt} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                          <input type="checkbox" checked={formData.services.includes(opt)}
                            onChange={() => handleServiceToggle(opt)}
                            className="rounded border-border bg-background accent-accent" />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">{t('contact.descLabel')}</label>
                    <textarea required placeholder={t('contact.descPlaceholder')}
                      value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-border-hover transition-colors min-h-[120px] resize-y" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">{t('contact.channelLabel')}</label>
                    <div className="flex gap-3 flex-wrap">
                      {channels.map(ch => (
                        <label key={ch} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                          <input type="radio" name="channel" value={ch}
                            checked={formData.channel === ch}
                            onChange={e => setFormData(p => ({ ...p, channel: e.target.value }))}
                            className="accent-accent" />
                          {ch}
                        </label>
                      ))}
                    </div>
                  </div>
                  <button type="submit" disabled={sending}
                    className="w-full bg-foreground text-background rounded-xl py-3.5 font-medium text-sm transition-opacity hover:opacity-90 disabled:opacity-50">
                    {sending ? t('contact.sending') : t('contact.submit')}
                  </button>
                  <p className="text-[12px] text-muted-foreground leading-relaxed">{t('contact.gdpr')}</p>
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div key="voice" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="max-w-[680px] mx-auto card-base rounded-3xl p-8 md:p-12 text-center">
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">{t('contact.voiceTitle')}</h3>
              <p className="text-sm text-muted-foreground mb-8">{t('contact.voiceSubtitle')}</p>

              <div className="relative inline-flex mb-4">
                <button onClick={toggleRecording}
                  className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center transition-transform hover:scale-105">
                  <Mic size={32} className="text-background" />
                </button>
                {recording && (
                  <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-pulse-ring" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {recording ? t('contact.listening') : transcript ? '' : t('contact.tapToRecord')}
              </p>

              {transcript && (
                <div className="bg-surface-elevated rounded-xl p-5 text-left mb-6 max-h-40 overflow-y-auto">
                  <p className="text-xs text-muted-foreground mb-2">{t('contact.transcript')}</p>
                  <p className="text-sm text-foreground">{transcript}</p>
                </div>
              )}

              {transcript && (
                <div className="space-y-4">
                  <input type="email" required placeholder={t('contact.emailPlaceholder')} value={voiceEmail}
                    onChange={e => setVoiceEmail(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-border-hover" />
                  <div className="flex gap-3 justify-center">
                    {channels.map(ch => (
                      <label key={ch} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                        <input type="radio" name="voiceChannel" value={ch}
                          checked={voiceChannel === ch} onChange={e => setVoiceChannel(e.target.value)} className="accent-accent" />
                        {ch}
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => { setTranscript(''); setRecording(false); }} className="btn-outline text-sm">{t('contact.reRecord')}</button>
                    <button onClick={handleSubmit} className="btn-primary text-sm">{t('contact.sendTranscript')}</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contact channels */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="card-base rounded-2xl p-7 text-center">
            <Mail size={28} className="text-accent mx-auto mb-3" />
            <h4 className="text-foreground font-medium mb-1">{t('contact.emailCard.title')}</h4>
            <a href="mailto:kontakt@kastaflow.no" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('contact.emailCard.address')}
            </a>
            <p className="text-xs text-muted-foreground mt-2">{t('contact.emailCard.note')}</p>
          </div>
          <div className="card-base rounded-2xl p-7 text-center">
            <MessageCircle size={28} className="text-kasta-green mx-auto mb-3" />
            <h4 className="text-foreground font-medium mb-1">{t('contact.whatsappCard.title')}</h4>
            <p className="text-sm text-muted-foreground">{t('contact.whatsappCard.text')}</p>
            <p className="text-xs text-muted-foreground mt-1">{t('contact.whatsappCard.note')}</p>
            <a href="https://wa.me/4700000000" target="_blank" rel="noopener noreferrer"
              className="inline-block mt-3 btn-outline text-xs py-2 px-4">{t('contact.whatsappCard.cta')}</a>
          </div>
          <div className="card-base rounded-2xl p-7 text-center">
            <SendIcon size={28} className="text-[#2AABEE] mx-auto mb-3" />
            <h4 className="text-foreground font-medium mb-1">{t('contact.telegramCard.title')}</h4>
            <a href="https://t.me/kastaflow" target="_blank" rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {t('contact.telegramCard.username')}
            </a>
            <p className="text-xs text-muted-foreground mt-2">{t('contact.telegramCard.note')}</p>
          </div>
        </div>
        <p className="text-[13px] text-muted-foreground text-center mt-6">{t('contact.channelNote')}</p>
      </div>
    </section>
  );
}
