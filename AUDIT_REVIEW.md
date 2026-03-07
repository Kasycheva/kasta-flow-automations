# KASTA FLOW STUDIO — Full Site Audit & Review

**Date:** 2026-03-07
**Branch:** `genspark_ai_developer`
**Reviewer:** AI Code Audit
**Status:** Review only. No code was changed.

---

## TABLE OF CONTENTS

1. [General Impression](#1-general-impression)
2. [CRITICAL: index.html & SEO Meta Tags](#2-critical-indexhtml--seo-meta-tags)
3. [HERO Section — Formulations & Copy](#3-hero-section--formulations--copy)
4. [SERVICES Section — Content & Structure](#4-services-section--content--structure)
5. [Missing: Complex Integrations Block](#5-missing-complex-integrations-block)
6. [ROI Calculator — Review](#6-roi-calculator--review)
7. [Support (Monthly Plans) — Review](#7-support-monthly-plans--review)
8. [Cases & Testimonials — Review](#8-cases--testimonials--review)
9. [FAQ Section — Full Review](#9-faq-section--full-review)
10. [Contact Form & Voice Transcription — Review](#10-contact-form--voice-transcription--review)
11. [AI Chat Widget — Review](#11-ai-chat-widget--review)
12. [Footer — Review](#12-footer--review)
13. [Design, Fonts & Styles — Review](#13-design-fonts--styles--review)
14. [Code Quality & Architecture — Review](#14-code-quality--architecture--review)
15. [Norwegian Translation — Review](#15-norwegian-translation--review)
16. [Full List of Recommended Changes](#16-full-list-of-recommended-changes)
17. [Ready-to-Use Prompt for Lovable](#17-ready-to-use-prompt-for-lovable)

---

## 1. GENERAL IMPRESSION

**What Lovable did well:**
- Clean, modern dark-theme design with good typography pairing (Syne + DM Sans)
- Smooth framer-motion animations that are not overwhelming
- Logical section flow: Hero > Ticker > Services > Calculator > Support > Cases > FAQ > Contact > Footer
- Working i18n (English + Norwegian) with proper language switcher
- Cookie banner, chat widget, voice recording — all present as planned
- Responsive grid structure is in place (even if it needs polish)
- Good use of tailwindcss with a consistent design system (custom CSS variables, component classes)

**Main Problems:**
- `index.html` still has Lovable placeholder meta tags (no SEO at all)
- Several formulations feel "generic agency" rather than selling YOUR specific value
- Repeated emphasis on "no calls, no meetings" takes up space without adding conversion value
- No "Complex Integrations" tier between simple integrations and full AI agents
- Chat widget is a dummy — gives the same response to any quick reply
- Voice transcription uses browser `SpeechRecognition` (Chrome-only, hardcoded `en-US`)
- Form submission is simulated (`setTimeout`) — no actual backend
- Footer service links are hardcoded in English (don't translate with i18n)
- Many Radix UI component files are imported but never used (bloat)

---

## 2. CRITICAL: index.html & SEO Meta Tags

**Current state (PROBLEM):**
```html
<title>Lovable App</title>
<meta name="description" content="Lovable Generated Project" />
<meta property="og:title" content="Lovable App" />
<meta property="og:description" content="Lovable Generated Project" />
<meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
```

**Why this is critical:** Google will index "Lovable App" as your site title. Social sharing will show "Lovable Generated Project." This kills SEO before the site even launches.

**Recommended fix:**
```html
<title>Kasta Flow Studio — Automation for Norwegian Businesses | AI, Integrations, Workflows</title>
<meta name="description" content="We build smart integrations, AI chatbots and automated workflows for small and medium businesses in Norway. Vipps, Fiken, CRM, n8n — from 3,600 NOK." />
<meta property="og:title" content="Kasta Flow Studio — Business Automation in Norway" />
<meta property="og:description" content="Smart integrations, AI agents, and automated workflows for Norwegian SMBs. Results delivered in days, not months." />
<meta property="og:image" content="[YOUR_OG_IMAGE_URL]" />
```

**Note for you:** You also need to create an OG image (1200x630px) with your branding for social media sharing. Also add `<html lang="en">` dynamic switching or use `react-helmet-async` (already in your dependencies!) to set correct `<html lang>` based on the current language.

---

## 3. HERO Section — Formulations & Copy

### 3.1 Current hero subtitle (PROBLEM):
> "We build smart integrations, AI chatbots and automated workflows for small and medium businesses in Norway. **No meetings. No calls.** Just results — delivered in writing."

**My take:** The phrase "No meetings. No calls." is defensive and creates a barrier. A first-time visitor doesn't know you yet — they haven't even thought about calling you. Leading with "we don't do X" makes the brand feel avoidant rather than professional. The subtitle should sell VALUE, not anti-features.

**Recommended replacement (EN):**
> "We build smart integrations, AI chatbots and automated workflows for Norwegian SMBs. Fast delivery. Transparent pricing. Everything documented — from brief to handoff."

**Recommended replacement (NO):**
> "Vi bygger smarte integrasjoner, AI-chatboter og automatiserte arbeidsflyter for norske SMB-er. Rask levering. Transparente priser. Alt dokumentert — fra brief til overlevering."

**Why:** This hits 3 buying triggers: speed, price clarity, professionalism. The "no calls" concept can live in the FAQ or process section where it makes contextual sense.

### 3.2 Hero title:
Current: "Automate your business. Free your time."
**Verdict:** Good, but generic. Every automation agency says this.

**Alternative option (stronger SEO + differentiation):**
> "Workflows that work. While you don't."
> (subtext: "Smart automation for Norwegian businesses — integrations, AI agents, lead flows")

OR more conservative:
> "Smart Automation for Norwegian Businesses."
> "From integrations to AI agents — delivered in days."

### 3.3 Hero badges (proof points):
Current: `"✓ Norwegian market"`, `"✓ Vipps & Fiken integrations"`, `"✓ Response within 48h"`

**Verdict:** These are decent but could be stronger with numbers:
- "✓ 15+ projects delivered" (social proof)
- "✓ Vipps & Fiken certified" (trust — even if informal, the word "certified" carries weight)
- "✓ Delivery from 3 days" (speed trigger)

### 3.4 CTA buttons:
- "Start automation" — good
- "See services" — too passive

**Recommended:** Change "See services" to "View pricing" or "Explore solutions" (more action-oriented and answers the immediate question: "how much?")

---

## 4. SERVICES Section — Content & Structure

### 4.1 Section title:
Current: "Everything your business needs to run on autopilot"
**Verdict:** Slightly overpromising. "Autopilot" implies zero human involvement, which isn't true for services that need monthly support.

**Recommended:** "Everything your business needs to work smarter" / "Solutions that save you hours every week"

### 4.2 Section subtitle:
Current: "We work with small and medium businesses in Norway — from a single integration to a full automation ecosystem. No technical knowledge required on your side."

**Verdict:** The last sentence is good for reassurance. But "full automation ecosystem" is vague.

**Recommended:** "We help Norwegian SMBs automate repetitive work — from simple integrations to intelligent AI systems. No technical knowledge needed."

### 4.3 Card 1 — Simple Integrations (3,600 NOK):
**Current copy is good.** Minor suggestion: change "One automated scenario (Flow)" to "1 automated workflow (n8n/Make)" — naming the tools builds credibility.

### 4.4 Card 2 — Vipps + Fiken (8,000 NOK):
**Good card.** One suggestion: Add "Norsk regnskap-kompatibelt" (Norwegian accounting-compatible) as a badge or bullet point for Norwegian version. This is a strong local SEO keyword.

### 4.5 Card 3 — CRM Setup (6,400 NOK):
**Solid copy.** Suggestion: Add "HubSpot Free Tier available" or "Start from HubSpot Free" to lower the perceived cost barrier.

### 4.6 Card 4 — FAQ Chatbot (5,600 NOK):
Current: "Never lose a customer because no one answered outside business hours."
**This is the best line on the whole site.** Keep it exactly as is.

### 4.7 Card 5 — Smart AI Agent (9,600 NOK):
Current: "works around the clock without a salary"
**Verdict:** A bit cliched. Replace with something that speaks to ROI.
**Recommended:** "...and handles up to 80% of routine inquiries without human involvement."

### 4.8 Card 6 — Landing Page + Lead Flow (9,600 NOK):
**Good card.** Suggestion: specify "Framer or Webflow" in the checklist to show you use modern tools, not WordPress.

### 4.9 Custom task block:
Current: "Don't see what you need? We work with the most innovative automation tools available and love solving non-standard problems."

**Verdict:** "innovative" and "love solving" are filler words. Be specific.

**Recommended:** "Don't see your use case? We've automated everything from inventory sync to multilingual customer support. Describe your task — we'll tell you if (and how) we can automate it."

---

## 5. MISSING: Complex Integrations Block

**You specifically asked about this.** Currently there's a gap between:
- **Simple Integrations** (2-3 tools, 3,600 NOK) and
- **Smart AI Agent** (full AI, 9,600 NOK)

**Recommendation:** Add a **"Card 7" — Advanced Multi-System Integration** between CRM and Chatbot:

```
Name: "Advanced Integration Hub"
Badge: "Multi-system"
Description: "Connect 5+ tools into a unified automated ecosystem. ERP, warehouse, booking, payment — all synchronized in real time. Ideal for businesses that have outgrown simple connections."
Checklist:
- Up to 10 connected services
- Multi-step workflow logic
- Error handling & retry mechanisms
- Conditional branching (if/else flows)
- Priority delivery
Price: From 14,000 NOK
```

**Norwegian:**
```
Name: "Avansert integrasjonshub"
Badge: "Flersystem"
Description: "Koble 5+ verktoy i et samlet automatisert okosystem. ERP, lager, booking, betaling — alt synkronisert i sanntid. Ideelt for bedrifter som har vokst fra enkle koblinger."
```

**Placement:** Insert as Card 3 or 4 (after CRM, before Chatbot), or create a separate "Enterprise" section if you want to visually separate basic and advanced tiers.

---

## 6. ROI Calculator — Review

### 6.1 Copy:
Current title: "How much is your routine actually costing you?"
**Verdict: Excellent.** This is a strong hook. Keep it.

Subtitle: "Labour costs in Norway are among the highest in the world."
**Verdict: Perfect for Norwegian market positioning.**

### 6.2 Logic:
- `avgAutomationPrice = 25000` — hardcoded. This is fine for an estimate but should be mentioned in the disclaimer.
- The formula `weeklyCost * 4.3` for monthly is correct (average weeks/month).
- Payback calculation is straightforward and honest.

**Suggestion:** Add a tooltip or small text: "Based on average project cost of 25,000 NOK" so the payback number feels transparent.

### 6.3 UX:
- Slider ranges are good (1-40 hours, 200-1200 NOK, 1-10 employees)
- Animated numbers are a nice touch

**Minor issue:** The slider doesn't show a filled track (left side colored). This is a common UX expectation. Add `background: linear-gradient(...)` based on slider position.

---

## 7. Support (Monthly Plans) — Review

### 7.1 Pricing:
- Mini: 1,800 NOK (2h) — makes sense
- Standard: 3,300 NOK (5h) — reasonable, correctly marked "Most popular"
- Pro: 7,700 NOK (15h) — good for businesses with critical systems

**Verdict:** Pricing structure is well-thought-out. No changes needed.

### 7.2 Copy issue — "Fast fixes, no calls" (Step 04):
Again, this "no calls" message appears in the support steps. The step itself is about fast response — focus on THAT:

**Recommended:** "Fast fixes, clear updates" / "Raske fikser, tydelige oppdateringer"

### 7.3 Fine print:
The `finePrint` text is good and professional. However:
- "Unused hours do not carry over" — this is industry-standard but consider mentioning it's common practice so clients don't feel shortchanged
- "800 NOK/hour" for overtime is clearly stated. Good.

---

## 8. Cases & Testimonials — Review

### 8.1 Case studies:
Three cases: restaurant booking, consultant CRM, beauty salon invoicing.
**Verdict:** Great selection covering different industries and service tiers.

**Issue:** The metrics in the cards are strings like "0 Double bookings", "3h Saved per day". The format mixes number+text in one string. For better readability, split into value + label:
```
{ "value": "0", "label": "Double bookings" }
{ "value": "3h", "label": "Saved per day" }
```

### 8.2 Testimonials:
**IMPORTANT WARNING:** All 4 testimonials appear to be fictional (Erik Andersen, Marte Olsen, Jonas Berg, Silje Haugen). If these are made-up names/quotes:
- **DO NOT launch with fake testimonials.** This destroys trust if discovered and may violate Norwegian consumer protection law (Markedsfuringsloven).
- Replace with either: (a) real testimonials from beta clients, (b) anonymized testimonials like "Owner of a restaurant in Oslo", or (c) remove the section entirely until you have real feedback.

**If they are real:** Ensure you have written consent from each person for using their name and company.

### 8.3 Stats:
`"15+ Projects delivered"`, `"6 Industries served"`, `"40h Average time saved/month"`, `"48h Average response time"`

**Verdict:** Make sure these numbers are real or qualified as goals. "15+" is specific enough to sound real — if you've done 15, this is fine. If not, use "Projects built" (without a number) or "Designed for 6+ industries."

---

## 9. FAQ Section — Full Review

### 9.1 Existing questions (8 total):

| # | Question | Verdict |
|---|----------|---------|
| 1 | "Do I need any technical knowledge?" | GOOD. Keep as is. |
| 2 | "How does the process work if we never have a call?" | REWRITE. See below. |
| 3 | "What tools do I need before we start?" | GOOD. Keep as is. |
| 4 | "How long does a typical project take?" | GOOD. Clear timeline breakdown. |
| 5 | "What are the payment terms?" | GOOD. 50/50 is transparent. |
| 6 | "Do the prices include VAT?" | GOOD. Norwegian-specific, important. |
| 7 | "What if something stops working after delivery?" | GOOD. 30-day guarantee is a selling point. |
| 8 | "Can you work with unlisted tools?" | GOOD. Shows flexibility. |

### 9.2 FAQ Question #2 — Rewrite:
**Current question:** "How does the process work if we never have a call?"
**Problem:** This frames your communication style as a limitation. The phrasing "if we NEVER have a call" makes it sound like YOU are the one refusing to talk.

**Recommended question:** "How does the project process work from start to finish?"
**Recommended answer:**
> "You fill in a short brief describing your needs. Within 24 hours we send you a clear proposal with scope, price and timeline. After you approve and pay the deposit, we start building. All communication happens in writing (email, WhatsApp or Telegram) — this gives you a clear record of every decision. We deliver results via a short Loom video walkthrough so you can see everything in action. Simple, transparent, and on your schedule."

**Norwegian:**
> "Du fyller ut en kort brief som beskriver behovene dine. Innen 24 timer sender vi deg et tydelig tilbud med omfang, pris og tidslinje. Etter at du godkjenner og betaler depositumet, setter vi i gang. All kommunikasjon skjer skriftlig (e-post, WhatsApp eller Telegram) — dette gir deg en tydelig logg over hver beslutning. Vi leverer resultater via en kort Loom-videogennemgang slik at du kan se alt i aksjon. Enkelt, transparent og pa din tidsplan."

### 9.3 MISSING FAQ topics to add:

**Q9: "Do you offer a free consultation or audit?"**
> A: "Yes. Fill in the form at the bottom of this page and describe your current workflow. We'll analyze your situation and come back within 48 hours with a concrete proposal — including estimated time savings and recommended tools. This initial audit is completely free and comes with no obligation."

**Q10: "Can you automate processes that involve Norwegian-specific tools?"**
> A: "Absolutely. We specialize in the Norwegian business ecosystem. We work with Vipps, Fiken, Tripletex, Bronnysundregistrene, Altinn, and other local platforms. If your tools have an API or support webhooks — we can integrate them."

**Q11: "What if I need changes after the project is delivered?"**
> A: "Minor tweaks within the first 30 days are included free of charge. After that, you can subscribe to one of our monthly support plans — or request changes as a separate mini-project. We never leave you without options."

**Q12: "Is my data safe?"**
> A: "Yes. We follow GDPR requirements. All automations are built on secure platforms (n8n Cloud, HubSpot, Google Workspace). We don't store your business data — your integrations run on your accounts. Access credentials are shared via secure channels and deleted after project completion."

### 9.4 Chat mockup next to FAQ:
**Current:** Nice visual but hardcoded to a salon/Vipps scenario.
**Suggestion:** Consider rotating between 2-3 different chat scenarios (salon + consultant + restaurant) to show breadth.

---

## 10. Contact Form & Voice Transcription — Review

### 10.1 Form:
- Fields are well-chosen (name, email, company, team size, interests, description, channel)
- Multi-select for interests is good
- GDPR disclaimer is present

**Problem:** `handleSubmit` just does `setTimeout(1500)` — no actual submission. This needs a real backend (Supabase, email API, webhook to n8n, etc.)

### 10.2 Contact section title:
Current: "Not sure where to start? Let us figure it out together."
**Verdict:** Solid. But the subtitle repeats "No calls required" again.

**Recommended subtitle:**
> "Tell us about your business and the tasks that take the most time. We'll respond within 48 hours with a personalized proposal — clear scope, price and timeline."

### 10.3 Voice Transcription:
**Technical issues:**
1. **Hardcoded `en-US`** — won't work for Norwegian speakers. Need to detect current i18n language and set `recognition.lang` accordingly (`nb-NO` for Norwegian, `en-US` for English).
2. **Chrome-only** — `SpeechRecognition` is not supported in Firefox or Safari. Need a fallback message.
3. **No edit capability** — transcript goes straight to send. You wanted editing before sending (as mentioned in your brief). Currently there IS a "Re-record" button, but no way to manually edit the text.
4. **No AI summarization** — your brief mentioned removing filler words. This would require a server-side AI call (OpenAI Whisper for transcription + GPT for cleanup).

**Recommended approach for transcription:**
1. Use the browser `SpeechRecognition` for the initial demo (with language detection)
2. For production: record actual audio via `MediaRecorder API` -> send to backend -> use Whisper API for transcription -> optionally use GPT to clean up -> return editable text to user
3. Add a `<textarea>` after transcription so user can edit before sending

### 10.4 Channel note at bottom:
Current: "We prefer written communication — it saves your time and creates a clear record..."
**Verdict:** This is the RIGHT place for the "we work in writing" message. It's contextual (you're choosing a channel) and it's framed as a benefit. Keep it.

---

## 11. AI Chat Widget — Review

### 11.1 Current behavior:
- Opens with a welcome message
- Shows 4 quick reply buttons
- ANY quick reply returns the same generic response: "Please fill out our audit form..."
- After first quick reply, no further interaction possible

**Verdict:** This is essentially a glorified tooltip that points to the form. That's okay for an MVP, but:

### 11.2 Recommended improvements:
1. **Different responses per quick reply:**
   - "What services do you offer?" -> Brief list of services with anchor links
   - "How much does it cost?" -> Price range overview with link to Services section
   - "How does the process work?" -> 4-step process summary
   - "I want to start" -> Direct link to contact form

2. **The response text is hardcoded in English** (not using i18n):
   ```js
   text: 'Thank you for your interest! Please fill out our audit form below...'
   ```
   This should use `t('chat.responseServices')`, `t('chat.responsePricing')`, etc.

3. **Add a text input field** so users can type free-form questions (even if the bot just responds with "I'll forward this to our team" for now).

4. **For the future (Google AI Studio / Gemini API):**
   - The chat widget component (`ChatWidget.tsx`) is well-structured for adding a real AI backend
   - You'd add an API call in `handleQuickReply` / a new `handleMessage` function
   - The UI/styling wouldn't need to change — just the response logic
   - Google AI Studio works with REST API calls — you don't need to upload the whole project there. You'd just call `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent` from your backend or a serverless function

---

## 12. Footer — Review

### 12.1 Service links hardcoded in English:
```tsx
const serviceLinks = [
  { label: 'Simple Integrations', href: '#services' },
  { label: 'Vipps + Fiken', href: '#services' },
  ...
];
```
**Problem:** These don't translate when switching to Norwegian.
**Fix:** Use `t('services.card1.name')` etc. or add footer-specific translation keys.

### 12.2 Privacy Policy & Terms:
Both are `<button>` elements that do nothing. Before launch, these MUST link to real pages (required by GDPR/Norwegian law).

### 12.3 "Currently accepting new clients":
**Verdict: Great touch.** Creates urgency subtly. Consider making this dynamic (e.g., connected to a simple CMS flag).

---

## 13. Design, Fonts & Styles — Review

### 13.1 Typography:
- **Syne** (headings) — Bold, geometric, modern. Excellent choice for a tech/automation brand.
- **DM Sans** (body) — Clean, neutral, highly readable. Great pairing.
- **Verdict:** Keep both. No changes needed.

### 13.2 Color palette:
- Fully monochrome (dark background, white text, gray accents) with one green accent (`kasta-green`).
- **Verdict:** Very clean, premium feel. The monochrome approach works for B2B automation.
- **Suggestion:** Consider adding ONE more accent color for CTAs/highlights — a subtle blue or purple could differentiate primary actions from regular content.

### 13.3 Dark theme:
- Only dark mode. No light mode toggle.
- **Verdict:** Fine for a portfolio/studio site. Don't add light mode unless users specifically request it.

### 13.4 Animations:
- `fadeUp` on scroll — subtle and professional
- Ticker animation — smooth but could be smoother (consider `will-change: transform`)
- Number counting animation in Calculator — nice touch
- Testimonial auto-rotation every 5s — standard

### 13.5 Mobile responsive:
- Grid breaks from 3-col to 2-col to 1-col — working
- Mobile nav overlay — full-screen slide-up, works
- **Issues found:**
  - Chat widget overlaps cookie banner on mobile
  - FAQ chat mockup is hidden on mobile (`hidden lg:block`) — consider showing a simplified version
  - Form inputs don't have proper mobile padding

---

## 14. Code Quality & Architecture — Review

### 14.1 Positives:
- TypeScript throughout
- Clean component separation (sections, widgets, ui)
- Tailwind utility classes with custom design tokens
- i18n properly set up with JSON locale files
- Framer Motion for animations

### 14.2 Issues:

**Unused dependencies (bloat):**
Over 40+ Radix UI component files in `src/components/ui/` but only ~5 are actually used (accordion, button, toast, tooltip). The rest are dead code from Lovable's scaffolding. This adds to bundle size.

**Recommended:** Remove unused UI components OR set up tree-shaking to exclude them.

**No backend / API layer:**
- Form submission is fake (`setTimeout`)
- Chat responses are hardcoded
- No analytics tracking

**No SEO optimization:**
- `react-helmet-async` is in dependencies but not used
- No structured data (JSON-LD for LocalBusiness)
- No sitemap.xml or robots.txt
- `index.html` still has Lovable placeholder content

**TypeScript loose spots:**
- `(window as any).SpeechRecognition` — should use proper type assertion
- `(window as any).__recognition` — global state via window object is an anti-pattern

---

## 15. Norwegian Translation — Review

### 15.1 Quality:
The Norwegian translation is generally good and reads naturally. A native speaker would find it professional.

### 15.2 Issues found:
- `no.json` > `support.steps[3].title`: "Raske fikser, ingen samtaler" — same "no calls" issue as English
- Some text uses English terms that could be more Norwegian: "Lead Flow", "CRM Setup", "FAQ" — these are industry-standard and acceptable, but consider adding Norwegian explanations in parentheses for less tech-savvy visitors
- The chat widget hardcoded response is in English regardless of language selection

### 15.3 Missing:
- `alt` texts for any future images
- Norwegian version of chat bot responses
- Proper `<html lang="no">` when Norwegian is active

---

## 16. FULL LIST OF RECOMMENDED CHANGES

### PRIORITY 1 (Must-fix before launch):

| # | Item | Where | What to do |
|---|------|-------|------------|
| 1 | index.html meta tags | `index.html` | Replace all Lovable placeholder titles, descriptions, OG tags |
| 2 | Remove "No calls/No meetings" from hero | `en.json`, `no.json` hero.subtitle | Rewrite to value-focused copy (see Section 3) |
| 3 | Add Complex Integrations card | `en.json`, `no.json` services | Add card7 for advanced integrations (see Section 5) |
| 4 | Fix chat widget hardcoded English | `ChatWidget.tsx` | Use i18n for all bot responses |
| 5 | Fix voice recognition language | `Contact.tsx` | Set `recognition.lang` based on current i18n language |
| 6 | Footer service links i18n | `Footer.tsx` | Replace hardcoded English labels with `t()` calls |
| 7 | Real form submission backend | `Contact.tsx` | Connect to webhook (n8n), email API, or Supabase |
| 8 | Privacy Policy & Terms pages | `Footer.tsx` | Create real pages (GDPR requirement) |
| 9 | Add react-helmet-async | `Index.tsx` | Dynamic `<title>`, `<meta>`, `<html lang>` per language |

### PRIORITY 2 (Improve quality):

| # | Item | Where | What to do |
|---|------|-------|------------|
| 10 | Rewrite hero subtitle | `en.json`, `no.json` | Value-focused copy (see Section 3) |
| 11 | Improve hero proof badges | `en.json`, `no.json` | Stronger social proof (see Section 3.3) |
| 12 | Rewrite FAQ Q2 | `en.json`, `no.json` | Process-focused instead of "no calls" (see Section 9.2) |
| 13 | Add 4 new FAQ questions | `en.json`, `no.json` | Free audit, Norwegian tools, post-delivery changes, data safety (see Section 9.3) |
| 14 | Rewrite services subtitle | `en.json`, `no.json` | More specific than "autopilot" (see Section 4.1) |
| 15 | Rewrite AI Agent card | `en.json`, `no.json` | Replace "without a salary" with ROI claim (see Section 4.7) |
| 16 | Improve custom task block | `en.json`, `no.json` | More specific examples (see Section 4.9) |
| 17 | Different chat bot responses | `ChatWidget.tsx`, `en.json`, `no.json` | Per-question response content |
| 18 | Support step 04 rewrite | `en.json`, `no.json` | "Fast fixes, clear updates" |
| 19 | Verify testimonials | Content | Ensure real or anonymize |
| 20 | Add `robots.txt` and `sitemap.xml` | `public/` | SEO basics |

### PRIORITY 3 (Nice to have):

| # | Item | Where | What to do |
|---|------|-------|------------|
| 21 | Add editable textarea for voice transcript | `Contact.tsx` | Let user edit before sending |
| 22 | Slider filled track styling | `Calculator.tsx` | Visual improvement |
| 23 | Remove unused Radix UI components | `src/components/ui/` | Reduce bundle size |
| 24 | Add structured data (JSON-LD) | `index.html` or Helmet | SEO for LocalBusiness |
| 25 | Chat widget free-text input | `ChatWidget.tsx` | Allow typing custom questions |
| 26 | Rotating FAQ chat scenarios | `FAQ.tsx`, `en.json`, `no.json` | Show different industry examples |
| 27 | CTA rename: "See services" -> "View pricing" | `en.json`, `no.json` | More action-oriented |
| 28 | OG image creation | Design | 1200x630px branded image |
| 29 | Mobile: fix chat/cookie overlap | CSS | z-index and positioning |
| 30 | Add Tripletex/Altinn to Ticker | `Ticker.tsx` | Norwegian tool credibility |

---

## 17. READY-TO-USE PROMPT FOR LOVABLE

Copy and paste the following prompt into Lovable (or any other AI builder) to implement the priority changes:

---

### PROMPT START

```
I need to make the following changes to my Kasta Flow Studio website (React + Vite + Tailwind + i18n). Please update BOTH en.json and no.json locale files where content changes are needed. Do not change the overall design — only content, logic and structure.

=== 1. FIX index.html META TAGS ===
Replace all Lovable placeholder content:
- Title: "Kasta Flow Studio — Automation for Norwegian Businesses | AI, Integrations, Workflows"
- Description: "We build smart integrations, AI chatbots and automated workflows for small and medium businesses in Norway. Vipps, Fiken, CRM, n8n — from 3,600 NOK."
- OG title: "Kasta Flow Studio — Business Automation in Norway"
- OG description: "Smart integrations, AI agents, and automated workflows for Norwegian SMBs. Results delivered in days, not months."
- Remove all Lovable branding from meta tags and og:image

=== 2. ADD react-helmet-async FOR DYNAMIC SEO ===
- Import HelmetProvider in App.tsx, wrap the app
- In Index.tsx, add <Helmet> with dynamic title, description and <html lang> based on current i18n language (en/no)

=== 3. REWRITE HERO SUBTITLE ===
EN: "We build smart integrations, AI chatbots and automated workflows for Norwegian SMBs. Fast delivery. Transparent pricing. Everything documented — from brief to handoff."
NO: "Vi bygger smarte integrasjoner, AI-chatboter og automatiserte arbeidsflyter for norske SMB-er. Rask levering. Transparente priser. Alt dokumentert — fra brief til overlevering."

Remove "No meetings. No calls." from the hero entirely.

=== 4. UPDATE HERO PROOF BADGES ===
EN: "✓ 15+ projects delivered", "✓ Vipps & Fiken certified", "✓ Delivery from 3 days"
NO: "✓ 15+ prosjekter levert", "✓ Vipps & Fiken-sertifisert", "✓ Levering fra 3 dager"

=== 5. CHANGE SECONDARY CTA ===
EN: "See services" -> "View pricing"
NO: "Se tjenester" -> "Se priser"

=== 6. ADD NEW SERVICE CARD — "Advanced Integration Hub" ===
Add as card7 in both en.json and no.json, and render it in Services.tsx grid.

EN:
- name: "Advanced Integration Hub"
- badge: "Multi-system"
- desc: "Connect 5+ tools into a unified automated ecosystem. ERP, warehouse, booking, payment — all synchronized in real time. Ideal for businesses that have outgrown simple connections."
- checks: ["Up to 10 connected services", "Multi-step workflow logic", "Error handling & retry mechanisms", "Conditional branching (if/else flows)", "Priority delivery"]
- price: "14 000"

NO:
- name: "Avansert integrasjonshub"
- badge: "Flersystem"
- desc: "Koble 5+ verktoy i et samlet automatisert okosystem. ERP, lager, booking, betaling — alt synkronisert i sanntid. Ideelt for bedrifter som har vokst fra enkle koblinger."
- checks: ["Opptil 10 tilkoblede tjenester", "Flerstegs arbeidsflytlogikk", "Feilhondtering og forsok-mekanismer", "Betinget forgrening (hvis/eller-flyter)", "Prioritert levering"]
- price: "14 000"

Add a suitable icon (e.g., Network or GitBranch from lucide-react).

=== 7. REWRITE SERVICES SECTION TITLE & SUBTITLE ===
EN title: "Everything your business needs" + "to work smarter"
NO title: "Alt bedriften din trenger" + "for a jobbe smartere"
EN subtitle: "We help Norwegian SMBs automate repetitive work — from simple integrations to intelligent AI systems. No technical knowledge needed."
NO subtitle: "Vi hjelper norske SMB-er med a automatisere repetitivt arbeid — fra enkle integrasjoner til intelligente AI-systemer. Ingen teknisk kunnskap kreves."

=== 8. REWRITE AI AGENT CARD DESCRIPTION ===
EN: "An intelligent assistant trained on your business data. It answers customer questions, qualifies leads, onboards new team members — and handles up to 80% of routine inquiries without human involvement."
NO: "En intelligent assistent trent pa dine forretningsdata. Den svarer pa kundesporsmal, kvalifiserer leads, onboarder nye teammedlemmer — og handterer opptil 80% av rutinehenvendelser uten menneskelig involvering."

=== 9. REWRITE CUSTOM TASK BLOCK ===
EN title: "Don't see your use case?"
EN desc: "We've automated everything from inventory sync to multilingual customer support. Describe your task — we'll tell you if (and how) we can automate it."
NO title: "Finner du ikke ditt brukstilfelle?"
NO desc: "Vi har automatisert alt fra lagersynkronisering til flerspraklig kundestotte. Beskriv oppgaven din — vi forteller deg om (og hvordan) vi kan automatisere den."

=== 10. REWRITE FAQ QUESTION #2 ===
EN Q: "How does the project process work from start to finish?"
EN A: "You fill in a short brief describing your needs. Within 24 hours we send you a clear proposal with scope, price and timeline. After you approve and pay the deposit, we start building. All communication happens in writing (email, WhatsApp or Telegram) — this gives you a clear record of every decision. We deliver results via a short Loom video walkthrough so you can see everything in action. Simple, transparent, and on your schedule."

NO Q: "Hvordan fungerer prosjektprosessen fra start til slutt?"
NO A: "Du fyller ut en kort brief som beskriver behovene dine. Innen 24 timer sender vi deg et tydelig tilbud med omfang, pris og tidslinje. Etter at du godkjenner og betaler depositumet, setter vi i gang. All kommunikasjon skjer skriftlig (e-post, WhatsApp eller Telegram) — dette gir deg en tydelig logg over hver beslutning. Vi leverer resultater via en kort Loom-videogennemgang slik at du kan se alt i aksjon. Enkelt, transparent og pa din tidsplan."

=== 11. ADD 4 NEW FAQ QUESTIONS (Q9-Q12) ===
Add to both en.json and no.json faq.items array:

Q9 EN: "Do you offer a free consultation or audit?"
A9 EN: "Yes. Fill in the form at the bottom of this page and describe your current workflow. We'll analyze your situation and come back within 48 hours with a concrete proposal — including estimated time savings and recommended tools. This initial audit is completely free and comes with no obligation."

Q10 EN: "Can you automate processes involving Norwegian-specific tools?"
A10 EN: "Absolutely. We specialize in the Norwegian business ecosystem — Vipps, Fiken, Tripletex, Bronnysundregistrene, Altinn, and other local platforms. If your tools have an API or support webhooks, we can integrate them."

Q11 EN: "What if I need changes after the project is delivered?"
A11 EN: "Minor tweaks within the first 30 days are included free of charge. After that, you can subscribe to one of our monthly support plans or request changes as a separate mini-project. We never leave you without options."

Q12 EN: "Is my data safe?"
A12 EN: "Yes. We follow GDPR requirements. All automations run on secure platforms (n8n Cloud, HubSpot, Google Workspace). We don't store your business data — your integrations run on your own accounts. Access credentials are shared securely and deleted after project completion."

(Add equivalent Norwegian translations for Q9-Q12.)

=== 12. FIX CHAT WIDGET ===
- Move all hardcoded English responses to en.json and no.json under "chat" namespace
- Add different responses per quick reply:
  - "What services?" -> Brief list with section anchors
  - "How much?" -> Price range: "From 3,600 to 14,000 NOK depending on complexity"
  - "How does the process work?" -> 4-step summary
  - "I want to start" -> "Great! Scroll down to our form or describe your needs right here."
- Add a text input field at the bottom of the chat so users can type custom messages
- For any typed message, respond with: "Thanks! I'll pass this to our team. You can also fill out the form below for a detailed proposal."

=== 13. FIX VOICE RECOGNITION LANGUAGE ===
In Contact.tsx, change:
  recognition.lang = 'en-US';
To:
  recognition.lang = i18n.language === 'no' ? 'nb-NO' : 'en-US';

Also add a check: if SpeechRecognition is not available, show a message: "Voice recording is not supported in your browser. Please use Chrome or Edge, or fill in the form instead."

Add a <textarea> after the transcript so the user can edit the text before sending.

=== 14. FIX FOOTER SERVICE LINKS ===
In Footer.tsx, replace hardcoded English labels in serviceLinks array with t() calls:
- t('services.card1.name') for "Simple Integrations"
- t('services.card2.name') for "Vipps + Fiken Automation"
- etc.

=== 15. UPDATE SUPPORT STEP 04 ===
EN: title "Fast fixes, clear updates" / desc: "All communication is written. We fix issues and report back with clear documentation."
NO: title "Raske fikser, tydelige oppdateringer" / desc: "All kommunikasjon er skriftlig. Vi fikser problemer og rapporterer tilbake med tydelig dokumentasjon."

=== 16. ADD NORWEGIAN-SPECIFIC TOOLS TO TICKER ===
Add to Ticker.tsx tools array: 'TRIPLETEX', 'ALTINN', 'POWEROFFICE'
Remove or keep existing ones as you see fit.

=== 17. ADD robots.txt AND sitemap.xml ===
Create public/robots.txt:
User-agent: *
Allow: /
Sitemap: https://kastaflow.no/sitemap.xml

Create public/sitemap.xml with basic structure for the single-page app.

=== IMPORTANT NOTES ===
- Do NOT change the overall design, colors, fonts or animation style
- Keep the dark theme as-is
- Maintain all existing responsive breakpoints
- All changes must apply to BOTH en.json and no.json
- Preserve the existing component structure
```

### PROMPT END

---

## APPENDIX A: File Map

```
src/
  App.tsx                  — App shell with routing
  pages/Index.tsx          — Main page assembling all sections
  pages/NotFound.tsx       — 404 page
  components/
    sections/
      Navbar.tsx           — Navigation bar with language switch
      Hero.tsx             — Hero section with Lottie animation
      Ticker.tsx           — Scrolling tools/brands bar
      Services.tsx         — 6 service cards grid
      Calculator.tsx       — ROI calculator with sliders
      Support.tsx          — Monthly support plans
      Cases.tsx            — Case studies + testimonials + stats
      FAQ.tsx              — Accordion FAQ + chat mockup
      Contact.tsx          — Form + voice recording
      Footer.tsx           — Footer with links and contacts
    widgets/
      ChatWidget.tsx       — Floating AI chat widget
      CookieBanner.tsx     — Cookie consent banner
    ui/                    — ~40 Radix UI components (mostly unused)
  locales/
    en.json                — English content
    no.json                — Norwegian content
  lib/
    i18n.ts                — i18next configuration
    utils.ts               — Utility functions
  index.css                — Global styles + design tokens
```

## APPENDIX B: SEO Keyword Targets

For future content optimization, target these keywords:

**English:**
- business automation Norway
- Norwegian SMB integrations
- Vipps Fiken automation
- n8n automation Norway
- AI chatbot for small business Norway
- CRM setup for Norwegian business
- workflow automation Scandinavia

**Norwegian:**
- automatisering for bedrifter Norge
- Vipps Fiken integrasjon
- CRM-oppsett Norge
- AI-chatbot for bedrifter
- n8n automasjon
- arbeidsflyt automatisering
- smart integrasjon for SMB

---

*End of audit. No code was modified. All changes are recommendations only.*
