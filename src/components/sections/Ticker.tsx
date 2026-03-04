const tools = [
  'N8N', 'MAKE', 'ZAPIER', 'OPENAI', 'CLAUDE', 'VOICEFLOW', 'VIPPS', 'FIKEN',
  'HUBSPOT', 'PIPEDRIVE', 'AIRTABLE', 'GOOGLE SHEETS', 'TELEGRAM', 'WHATSAPP',
  'NOTION', 'SLACK', 'TYPEFORM', 'FRAMER', 'WEBFLOW', 'VERCEL',
];

export default function Ticker() {
  const content = tools.join(' · ');

  return (
    <div className="w-full h-14 border-y border-border overflow-hidden flex items-center group">
      <div className="ticker-scroll flex whitespace-nowrap">
        <span className="text-xs tracking-[0.08em] uppercase text-muted-foreground px-4">
          {content} · {content} · 
        </span>
        <span className="text-xs tracking-[0.08em] uppercase text-muted-foreground px-4">
          {content} · {content} · 
        </span>
      </div>
    </div>
  );
}
