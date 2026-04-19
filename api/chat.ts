export const maxDuration = 30;

import { GoogleGenerativeAI } from '@google/generative-ai';

/* ------------------------------------------------------------------ */
/*  SDK initialization moved inside POST to ensure env vars exist      */
/* ------------------------------------------------------------------ */
const MODEL_NAME = 'gemini-2.5-flash';

/* ------------------------------------------------------------------ */
/*  System prompt — multilingual, concise, ROI-aware, form-oriented   */
/* ------------------------------------------------------------------ */
const SYSTEM_PROMPT = `You are a helpful AI assistant for Kasta Flow Studio, a business automation agency in Norway.

YOUR PERSONALITY: friendly, professional, concise. You feel like a smart colleague who gives clear answers — not a corporate chatbot.

LANGUAGE RULES:
- Detect the language the user writes in and ALWAYS reply in that same language.
- You support any language: English, Norwegian Bokmål, Ukrainian, Russian, German, Polish, Spanish, and others.
- Priority languages are English and Norwegian — but if a client writes in any other language, respond in their language.
- Keep the same style constraints regardless of language.

STYLE RULES:
- Maximum 3–5 sentences per reply. Be concise but warm.
- Never use bullet points, numbered lists, or markdown formatting in your replies.
- Write in flowing, natural sentences — like a real human texting.

SERVICES AND PRICES (starting prices, NOK, excl. VAT):
1. Simple Integrations — from 3 600 NOK
2. Advanced Integrations — from 4 800 NOK
3. Vipps + Fiken Automation — from 8 000 NOK
4. CRM Setup — from 6 400 NOK
5. FAQ Chatbot — from 5 600 NOK
6. Smart AI Agent — from 9 600 NOK
7. Landing Page + Lead Flow — from 9 600 NOK
8. Booking System — from 5 500 NOK
9. Automated Reminders — from 3 200 NOK
10. Monthly Support — from 1 800 NOK/month

KEY FACTS:
- All communication is written, no calls or video meetings.
- Response from the team within 24–48 hours on business days.
- Norwegian market focus: Vipps and Fiken expertise.
- Contact: kastaflow.studio@gmail.com
- Prices shown are starting prices; the final quote depends on the complexity of the project.

PRICE OBJECTION HANDLING:
If the client says the price is too high, questions the cost, or asks about ROI/payback:
- Briefly explain how many hours of routine work per month the automation saves (typically 5–20+ hours depending on the service).
- Mention that the investment usually pays for itself within 1–3 months.
- IMPORTANT: Tell the client that there is an ROI calculator right on this page — they can scroll up to the "Calculator" section and calculate their own savings in 30 seconds. Say something like: "By the way, we have an ROI calculator right on this page — scroll up to see exactly how much you could save each month."
- After explaining, still guide them toward filling out the contact form for a personalized assessment.

CONVERSATION FLOW:
- Mentally track the length of the conversation. By your 2nd or 3rd reply, proactively ask for their email address so the team can contact them if the conversation disconnects. E.g., "Could you share your email address so our team can send you a detailed proposal?"
- If they provide an email, acknowledge it and then suggest they fill out the short form at the bottom of the page.
- If the user seems interested or asks how to start: suggest filling out the contact form.
- After 2–3 exchanges, always end with a gentle nudge: suggest they fill out the short form so the team can assess their case and get back within 24–48 hours.
- If asked about anything unrelated to automation or these services: politely redirect.

FORM CTA — always phrase it naturally, e.g.:
- English: "Ready to move forward? Fill out our short form below and we'll get back to you within 24 hours."
- Norwegian: "Klar for neste steg? Fyll ut skjemaet under, så kommer vi tilbake innen 24 timer."
- Adapt this to whatever language the client is writing in.`;

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type ChatRequestBody = {
  messages?: ChatMessage[];
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function jsonResponse(body: unknown, init?: ResponseInit) {
  return Response.json(body, {
    headers: { 'Cache-Control': 'no-store' },
    ...init,
  });
}

/** Sleep helper for exponential backoff */
function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/* ------------------------------------------------------------------ */
/*  POST handler with exponential backoff retry                        */
/* ------------------------------------------------------------------ */
export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: 'API key not configured' }, { status: 500 });
  }

  // Initialize SDK inside the request scope so env vars are fully hydrated
  const genAI = new GoogleGenerativeAI(apiKey);

  let body: ChatRequestBody;

  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter(
        (message): message is ChatMessage =>
          (message.role === 'user' || message.role === 'assistant') &&
          typeof message.content === 'string' &&
          message.content.trim().length > 0
      )
    : [];

  if (messages.length === 0) {
    return jsonResponse({ error: 'Invalid messages' }, { status: 400 });
  }

  /* Build the Gemini chat history */
  const rawHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: msg.content }],
  }));

  /* Gemini SDK strictly requires history to start with a 'user' message */
  const history = [...rawHistory];
  while (history.length > 0 && history[0].role === 'model') {
    history.shift();
  }

  const lastUserMessage = messages[messages.length - 1].content;

  /* Retry with exponential backoff: 1s → 2s → 4s */
  const MAX_RETRIES = 3;
  const BASE_DELAY_MS = 1000;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
          maxOutputTokens: 350,
          temperature: 0.5,
        },
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastUserMessage);
      const reply = result.response.text();

      if (reply && reply.trim().length > 0) {
        return jsonResponse({ reply });
      }

      /* Empty response — retry */
      console.error(`[api/chat] Empty response on attempt ${attempt + 1}`);
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status;
      const message = (error as { message?: string })?.message ?? '';

      if (status === 429 || message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
        console.warn(`[api/chat] Rate limited on attempt ${attempt + 1}, retrying...`);

        if (attempt < MAX_RETRIES - 1) {
          await sleep(BASE_DELAY_MS * Math.pow(2, attempt));
          continue;
        }

        /* All retries exhausted — return rate limit error */
        return jsonResponse({ error: 'rate_limit' }, { status: 429 });
      }

      /* Non-retryable error */
      console.error('[api/chat] Gemini SDK error', error);
      return jsonResponse({ error: 'upstream_error' }, { status: 502 });
    }
  }

  return jsonResponse({ error: 'upstream_error' }, { status: 502 });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'POST, OPTIONS',
      'Cache-Control': 'no-store',
    },
  });
}
