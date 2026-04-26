export const maxDuration = 30;

import { GoogleGenerativeAI } from '@google/generative-ai';

/* ------------------------------------------------------------------ */
/*  SDK initialization moved inside POST to ensure env vars exist      */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  System prompt — multilingual, concise, ROI-aware, form-oriented   */
/* ------------------------------------------------------------------ */
const SYSTEM_PROMPT = `You are a helpful AI assistant for Kasta Flow Studio, a business automation agency in Norway.

YOUR PERSONALITY: friendly, professional, concise. You feel like a smart colleague who gives clear answers — not a corporate chatbot.

LANGUAGE RULES:
- CRITICAL: Detect the language of the user's LATEST message and reply in that EXACT language.
- You must evaluate the language fresh on EVERY single message. Even if you previously agreed to speak a specific language, if the user's new message is in a different language, switch to it immediately without apologizing or acknowledging the switch.
- DO NOT default to Norwegian just because you are a Norwegian agency. If the user writes in English, reply in English. If they write in Russian, reply in Russian.
- Keep the same style constraints completely regardless of language.

STYLE RULES:
- Maximum 3–5 sentences per reply. Be concise but warm.
- Never use bullet points, numbered lists, or markdown formatting in your replies.
- Write in flowing, natural sentences — like a real human texting.

SERVICES AND PRICES (starting prices, NOK, excl. VAT):
1. Simple Integrations — from 3 600 NOK
2. Advanced Integrations — from 5 800 NOK
3. Vipps + Fiken Automation — from 8 000 NOK
4. CRM Setup — from 7 500 NOK
5. FAQ Chatbot — from 5 600 NOK
6. Smart AI Agent — from 9 600 NOK
7. Landing Page + Lead Flow — from 9 600 NOK
8. Booking System — from 5 500 NOK
9. Automated Reminders — from 3 800 NOK
10. Monthly Support — from 1 800 NOK/month

KEY FACTS:
- All communication is written, no calls or video meetings.
- Response from the team within 24–48 hours on business days.
- Norwegian market focus: Vipps and Fiken expertise.
- Contact: kastaflow.studio@gmail.com
- Prices shown are starting prices for simple, clearly defined scopes; the final quote depends on the complexity of the project.
- When discussing a service or price, explain that the listed price is a starting point: if the task is simple and limited, it can fit that price, while more complex tasks depend on the client's specific workflow. Then guide the client to contact the team by filling out the form so managers can assess the task and give a precise proposal.

PRICE OBJECTION HANDLING:
If the client says the price is too high, questions the cost, or asks about ROI/payback:
- Briefly explain how many hours of routine work per month the automation saves (typically 5–20+ hours depending on the service).
- Mention that the investment usually pays for itself within 1–3 months.
- IMPORTANT: Tell the client that there is an ROI calculator right on this page — they can scroll up to the "Calculator" section and calculate their own savings in 30 seconds. Say something like: "By the way, we have an ROI calculator right on this page — scroll up to see exactly how much you could save each month."
- After explaining, still guide them toward filling out the contact form for a personalized assessment.

CONVERSATION FLOW:
- Whenever you explain a service or price, YOU MUST end your message by asking for their email address (e.g., "Could you share your email address so we can send a custom proposal?").
- If they have ALREADY provided an email, acknowledge it and tell them to fill out the form.
- VERY IMPORTANT: Always use the exact word "form" (English), "форма" or "форму" (Russian/Ukrainian), or "skjema" (Norwegian) when suggesting they apply. This word triggers a button for the user!
- If asked about anything unrelated to automation or these services: politely redirect.

FORM CTA:
- Always phrase the call to action naturally.
- Explicitly use the triggering word for the form in the matching language ("form", "форма", "skjema").
- Frame it as an assessment that takes 24-48 business hours.`;

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

  /* Model Fallback Cascade: Bypass rate limits per model */
  const MODEL_FALLBACKS = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash-8b'
  ];

  for (let attempt = 0; attempt < MODEL_FALLBACKS.length; attempt++) {
    const currentModelName = MODEL_FALLBACKS[attempt];
    try {
      const model = genAI.getGenerativeModel({
        model: currentModelName,
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
      console.error(`[api/chat] Empty response from ${currentModelName}`);
    } catch (error: unknown) {
      const status = (error as { status?: number })?.status;
      const message = (error as { message?: string })?.message ?? '';

      if (status === 429 || message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
        console.warn(`[api/chat] Rate limited on ${currentModelName}`);

        if (attempt < MODEL_FALLBACKS.length - 1) {
          console.warn(`[api/chat] Falling back to next model...`);
          await sleep(500 * (attempt + 1)); // Small pause before switching model
          continue;
        }

        /* All models exhausted — return rate limit error */
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
